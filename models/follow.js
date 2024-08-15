const db = require("../db");
const {
    NotFoundError, 
    BadRequestError, 
    UnauthorizedError
} = require("../expressError")

class Follow {
    /** Follow another user 
     * adds a new follower/followed relationship into the database.
    */

    static async followUser(followerUsername, followedUsername){
        try{
            const result = await db.query(
                `INSERT INTO follows
                (follower_username,
                followed_username)
                VALUES ($1, $2)
                RETURNING follower_username AS "followerUsername", followed_username AS "followedUsername"`,
                [followerUsername, followedUsername]
            )

            const follow = result.rows[0];

            if (!follow) throw new BadRequestError(`Couldn't create follow relationship`);

            return follow;
        } catch (e){
            console.error("Database error:", e);
            throw new  BadRequestError("Error in trying to follow user")
        }
    }

    /** Show all followers 
     * shows a list of all users that follow a particular user
    */
    static async findUserFollowers(username){
        try{
            let result = await db.query(
            `SELECT 
                u.username, 
                u.first_name AS "firstName", 
                u.last_name AS "lastName",
                f.created_at AS "followedSince" 
            FROM users u
            JOIN follows f ON f.follower_username = u.username
            WHERE f.followed_username = $1
            ORDER BY f.created_at DESC`,
            [username]
            );

            const followers = result.rows;

            if(followers.length === 0){
                return [];
            }
            return followers;
        } catch (e){
            console.error("Database error:", e);
            return [];
        }
    }

    /** Show all following 
     * shows a list of all users that a particular user follows
    */
    static async findUserFollowing(username){
        try{
            let result = await db.query(
            `SELECT 
                u.username, 
                u.first_name AS "firstName", 
                u.last_name AS "lastName",
                f.followed_username,
                f.follower_username,
                f.created_at AS "followerSince" 
            FROM users u
            JOIN follows f ON f.followed_username = u.username
            WHERE f.follower_username = $1
            ORDER BY f.created_at DESC`,
            [username]
            );

            const following = result.rows;

            if(following.length === 0){
                throw new NotFoundError(`User doesn't follow anyone yet`);
            }
            return following;
        } catch (e){
            console.error("Database error:", e);
            return [];
        }
    }

        /** Delete given follow-follower relationship from table;  */

        static async removeFollow(followerUsername, followedUsername) {
            try {
                let result = await db.query(
                `DELETE
                FROM follows
                WHERE follower_username = $1 AND
                followed_username = $2
                RETURNING follower_username AS "followerUsername", followed_username AS "followedUsername"`,
                [followerUsername, followedUsername],
                );
                const follow = result.rows[0];
    
                if (!follow){
                    return null;
                }
    
                return follow; 
            } catch (e){
                console.error("Database error:", e);
                throw new BadRequestError("Error removing follow relationship");
            }
        }
}

module.exports = Follow;