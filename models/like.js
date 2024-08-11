const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError, 
    BadRequestError, 
    UnauthorizedError
} = require("../expressError")

class Like{
    /** Add Like
     * adds like to a review
     * returns { user_username, review_id}
     */

    static async addLike(username, reviewId){

        const result = await db.query(
            `INSERT INTO likes
            (user_username,
            review_id)
            VALUES ($1, $2)
            RETURNING user_username AS "username", review_id AS "reviewId"`,
            [username, reviewId]
        )

        const like = result.rows[0];
        return like;
    }


     /** Delete Like
     * deletes an existing like
     * returns { user_username, review_id }
     * Throws NotFoundError on duplicates
     */

    static async removeLike(username, reviewId){

        let result = await db.query(
            `DELETE
            FROM likes
            WHERE user_username = $1 AND review_id = $2
            RETURNING user_username AS "username", review_id AS "reviewId"`,
            [username, reviewId],
        );
        return result.rows[0];
    }
}

module.exports = Like;