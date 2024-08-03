const db = require("../db");
const {
    NotFoundError, 
    BadRequestError, 
    UnauthorizedError
} = require("../expressError")

class Follow {
    /** Follow another user 
     * adds a new following/followed relationship into the database.
    */

    static async followUser(followingUserId, followedUserID){
        try{
            const result = await db.query(
                `INSERT INTO follows
                (following_user_id,
                followed_user_id)
                VALUES ($1, $2)
                RETURNING following_user_id AS followingUserId, followed_user_id AS followedUserID`,
                [followingUserId, followedUserID]
            )

            const follow = result.row[0];
            return follow;
        } catch (e){
            console.error("Database error:", e);
            throw new  BadRequestError("Error in trying to follow user")
        }
    }

    /** Show all followers 
     * shows a list of all users that follow a particular user
    */
    static async findUserFollowers(userId){
        try{
            let result = await db.query(
            `SELECT u.id,
                u.username, 
                u.first_name AS "firstName", 
                u.last_name AS "lastName",
                f.created_at AS "followedSince" 
            FROM users u
            JOIN follows f ON u.id = f.followed_user_id
            WHERE u.user_id = $1
            ORDER BY f.created_at DESC`,
            [userId]
            );

            const followers = result.rows;

            if(reviews.length === 0){
                throw new NotFoundError(`No followers found for user: ${userId}`);
            }
            return reviews;
        } catch (e){
            console.error("Database error:", e);
            throw new BadRequestError("Error fetching followers for user");
        }
    }

    /** Show all following 
     * shows a list of all users that a particular user follows
    */
    static async findUserFollowing(userId){
        try{
            let result = await db.query(
            `SELECT u.id,
                u.username, 
                u.first_name AS "firstName", 
                u.last_name AS "lastName",
                f.created_at AS "followingSince" 
            FROM users u
            JOIN follows f ON u.id = f.following_user_id
            WHERE u.user_id = $1
            ORDER BY f.created_at DESC`,
            [userId]
            );

            const followers = result.rows;

            if(reviews.length === 0){
                throw new NotFoundError(`User doesn't follow anyone yet`);
            }
            return reviews;
        } catch (e){
            console.error("Database error:", e);
            throw new BadRequestError("Error fetching user's followed accounts");
        }
    }

}

module.exports = Follow;