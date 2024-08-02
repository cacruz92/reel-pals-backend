const db = require("../db");
const {
    NotFoundError, 
    BadRequestError, 
    UnauthorizedError
} = require("../expressError")

class User {
    /**  authenticate user with username, password.
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
                    birthday
            FROM users
            WHERE username = $1`,
            [username]
        );
        
        const user = result.rows[0];

        if (user) {
            if(user.hashed_password === password){
                delete user.hashed_password;
                return user;
            }
        }
        throw new UnauthorizedError("Invalid username/password")
    }catch(e){
        console.error("Database error:", e);
        throw new UnauthorizedError("Login Failed")
    }
    }

    /** register user with data
     * returns {username, first_name, last_name, email, birthday}
     * Throws BadRequestError on duplicates
    */

    static async register({username, password, email, firstName, lastName, birthday}){
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

        const result = await db.query(
            `INSERT INTO users
            (username,
            hashed_password,
            email,
            first_name,
            last_name,
            birthday)
            VALUES ($1, $2, $3, $4, $5, $6 )
            RETURNING username, email, first_name AS "firstName", last_name AS "lastName", birthday`,
            [
                username, 
                password, 
                email, 
                firstName, 
                lastName, 
                birthday
            ]
        )

        const user = result.rows[0];
        return user;
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
                    birthday
            FROM users
            WHERE username = $1`,
            [username]
        );
        
        const user = result.rows[0];

        if(!user){
            throw new NotFoundError(`No user: ${username}`)
        }
    }
}

module.exports = User;