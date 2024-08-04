const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError, 
    BadRequestError, 
    UnauthorizedError
} = require("../expressError")

class Comment{
    /** Add Comment
     * adds comment to a review
     * returns { user_id, review_id, body}
     */

    static async addComment(userId, reviewId, body){

        const result = await db.query(
            `INSERT INTO comments
            (user_id,
            review_id,
            body)
            VALUES ($1, $2, $3)
            RETURNING user_id AS "userId", review_id AS "reviewId", body`,
            [userId, reviewId, body]
        )

        const comment = result.rows[0];
        return comment;
    }


    /** Edit Comment
     * edits and existing comment
     * returns { user_id, review_id, body}
     * Throws NotFoundError on duplicates
     */

    static async editComment(commentId, data){

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                userId: "user_id",
                reviewId: "review_id"
            });
        const commentVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE comments 
                          SET ${setCols} 
                          WHERE id = ${commentVarIdx} 
                          RETURNING user_id AS "userId", review_id AS "reviewId", body`;
        const result = await db.query(querySql, [...values, commentId]);
        const comment = result.rows[0];
    
        if (!comment) throw new NotFoundError(`Comment not found: ${commentId}`);
    
        return comment;
    }


    /** Delete Comment
     * deletes an existing comment
     * returns { user_id, review_id }
     * Throws NotFoundError on duplicates
     */

    static async removeComment(id){

        let result = await db.query(
            `DELETE
            FROM comments
            WHERE id = $1
            RETURNING user_id AS "userId", review_id AS "reviewId"`,
            [id],
        );
        const comment = result.rows[0];

        if (!comment) throw new NotFoundError(`This comment no longer exists`);

        return comment; 
    }


    /** Finds all comments made by a particular user
     * returns comments
     */

    static async findUserComments(userId){
        const result = await db.query(
            `SELECT id,
            user_id AS "userId",
            review_id AS "reviewId",
            body,
            created_at AS createdAt
            FROM comments
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        );

        return result.rows;
    }

    /** Finds all comments made on a specific post
     * returns comments
     */

    static async findReviewComments(reviewId){
        const result = await db.query(
            `SELECT id,
            user_id AS "userId",
            review_id AS "reviewId",
            body,
            created_at AS createdAt
            FROM comments
            WHERE review_id = $1
            ORDER BY created_at DESC`,
            [reviewId]
        );

        return result.rows;
    }
}

module.exports = Comment;