const db = require("../db");
const bcrypt = require("bcrypt");
const {BCRYPT_WORK_FACTOR, JWT_SECRET} = require("../config");
const jwt = require("jsonwebtoken");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError, 
    BadRequestError, 
    UnauthorizedError
} = require("../expressError")

class User {
    /**  Authenticate user with username, password.
    *returns {username, first_name, last_name, email, birthday}
    * throws UnauthorizedError if user not found or wrong password
    **/

    static async authenticate(username, password){
        try {
            const result = await db.query(
            `SELECT username,
                    hashed_password,
                    email, 
                    first_name AS "firstName", 
                    last_name AS "lastName",
                    birthday,
                    picture
            FROM users
            WHERE username = $1`,
            [username]
        );
        
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.hashed_password)) {
            delete user.hashed_password;
            const token = User.generateToken(user)
            return {user, token};
        }

        throw new UnauthorizedError("Invalid username/password")
    }catch(e){
        console.error("Database error:", e);
        throw e;
    }
    }

    /** Register user with data
     * returns {username, first_name, last_name, email, birthday}
     * Throws BadRequestError on duplicates
    */

    static async register({username, password, email, firstName, lastName, birthday, picture}){
        // check for duplicates
        const duplicateCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username]
        )
        if(duplicateCheck.rows[0]){
            throw new BadRequestError("That username already exists!")
        } 

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)

        const result = await db.query(
            `INSERT INTO users
            (username,
            hashed_password,
            email,
            first_name,
            last_name,
            birthday,
            picture)
            VALUES ($1, $2, $3, $4, $5, $6, $7 )
            RETURNING username, email, first_name AS "firstName", last_name AS "lastName", birthday, picture`,
            [
                username, 
                hashedPassword, 
                email, 
                firstName, 
                lastName, 
                birthday,
                picture
            ]
        )

        const user = result.rows[0];
        return user;
    }
    /** Generate a token for a user */
    static generateToken(user){
        const payload = {
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };
        return jwt.sign(payload, JWT_SECRET)
    }
    /** Verify the token  */
    static verifyToken(token) {
        try {
            const payload = jwt.verify(token, JWT_SECRET);
            return payload;
        } catch (err) {
            throw new UnauthorizedError('Invalid token');
        }
    }

    /** find a user by the username given
     * returns {username, first_name, last_name, email, birthday}
     * throws NotFoundError if user not found.
     */

    static async get(username){
        const result = await db.query(
            `SELECT username,
                    email, 
                    first_name AS "firstName", 
                    last_name AS "lastName",
                    birthday,
                    picture
            FROM users
            WHERE username = $1`,
            [username]
        );
        
        const user = result.rows[0];

        if(!user){
            throw new NotFoundError(`No user: ${username}`)
        }
        return user;
    }

    /** Delete given user from database; 
     * Throws NotFoundError if user not found. */

    static async remove(username) {
        let result = await db.query(
            `DELETE
            FROM users
            WHERE username = $1
            RETURNING username`,
            [username],
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        return user; 
    }

    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { password, email, firstName, lastName, birthday }
     *
     * Returns { username, email, firstName, lastName, birthday }
     *
     * Throws NotFoundError if not found.
     *
     * WARNING: this function can set a new password.
     * Callers of this function must be certain they have validated inputs to this
     * or serious security risks can be opened.
     */
    static async update(username, data) {
        if (data.password) {
          data.hashed_password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }
    
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
              firstName: "first_name",
              lastName: "last_name"
            });
        const usernameVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE users 
                          SET ${setCols} 
                          WHERE username = ${usernameVarIdx} 
                          RETURNING username,
                                    first_name AS "firstName",
                                    last_name AS "lastName",
                                    email,
                                    birthday,
                                    picture`;
        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);
    
        return user;
      }

    static async search(term){
        const result = await db.query(
            `SELECT username, first_name, last_name
            FROM users
            WHERE username ILIKE $1
            OR first_name ILIKE $1
            OR last_name ILIKE $1
            LIMIT 30`,
            [`%${term}%`]
        );
        return result.rows;
    }

      

      
}

module.exports = User;