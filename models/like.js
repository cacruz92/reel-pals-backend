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
     * returns { user_id, review_id}
     */

    static async addLike(userId, reviewId){

        //check for duplicates
        const duplicateCheck = await db.query(
            `SELECT id
            FROM likes
            WHERE user_id = $1 AND review_id = $2`,
            [userId, reviewId]
        )
        if(duplicateCheck.rows[0]){
            throw new BadRequestError("User has already liked this review")
        }

        const result = await db.query(
            `INSERT INTO likes
            (user_id,
            review_id)
            VALUES ($1, $2)
            RETURNING user_id AS "userId", review_id AS "reviewId"`,
            [userId, reviewId]
        )

        const like = result.rows[0];
        return like;
    }


     /** Delete Like
     * deletes an existing like
     * returns { user_id, review_id }
     * Throws NotFoundError on duplicates
     */

    static async removeLike(userId, reviewId){

        let result = await db.query(
            `DELETE
            FROM likes
            WHERE user_id = $1 AND review_id = $2
            RETURNING user_id AS "userId", review_id AS "reviewId"`,
            [userId, reviewId],
        );
        const like = result.rows[0];

        if (!like) throw new NotFoundError(`This like no longer exists`);

        return like; 
    }

}

module.exports = Like;