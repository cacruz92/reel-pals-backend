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
     * returns { user_username, review_id, body}
     */

    static async addComment(username, reviewId, body){

        const result = await db.query(
            `INSERT INTO comments
            (user_username,
            review_id,
            body)
            VALUES ($1, $2, $3)
            RETURNING id, user_username AS "username", review_id AS "reviewId", body`,
            [username, reviewId, body]
        )

        const comment = result.rows[0];
        return comment;
    }


    /** Edit Comment
     * edits and existing comment
     * returns { user_username, review_id, body}
     * Throws NotFoundError on duplicates
     */

    static async editComment(commentId, data){

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                username: "user_username",
                reviewId: "review_id"
            });
        const commentVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE comments 
                          SET ${setCols} 
                          WHERE id = ${commentVarIdx} 
                          RETURNING id, user_username AS "username", review_id AS "reviewId", body, created_at AS "createdAt"`;
        const result = await db.query(querySql, [...values, commentId]);
        const comment = result.rows[0];
    
        if (!comment) throw new NotFoundError(`Comment not found: ${commentId}`);
    
        return comment;
    }


    /** Delete Comment
     * deletes an existing comment
     * returns { user_username, review_id }
     * Throws NotFoundError on duplicates
     */

    static async removeComment(commentId){

        let result = await db.query(
            `DELETE
            FROM comments
            WHERE id = $1
            RETURNING user_username AS "username", review_id AS "reviewId"`,
            [commentId],
        );
        const comment = result.rows[0];

        if (!comment) throw new NotFoundError(`This comment no longer exists`);

        return comment; 
    }


    /** Finds all comments made on a specific post
     * returns comments
     */

    static async findReviewComments(reviewId){
        const result = await db.query(
            `SELECT id,
            user_username AS "username",
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