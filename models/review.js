const db = require("../db");
const { BadRequestError } = require("../expressError")
const { sqlForPartialUpdate } = require("../helpers/sql");

class Review {
    /** add a new review */
    static async addReview(movieId, userId, rating, title, body){
        try{
            const result = await db.query(
                `INSERT INTO reviews
                (rating,
                title,
                body,
                user_id,
                movie_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, rating, title, user_id AS "userId", movie_id AS "movieId"`,
                [
                    rating, 
                    title, 
                    body, 
                    userId, 
                    movieId
                ]
            )

            const review = result.rows[0];
            return review;
        } catch(e){
            console.error("Database error:", e);
            throw new BadRequestError("There was an issue in adding the review :(")
        }
    }

    /** edit a review */

    static async editReview(reviewId, data) {
         const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                reviewId: "review_id"
            });
        const reviewIdVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE reviews 
                          SET ${setCols} 
                          WHERE id = ${reviewIdVarIdx} 
                          RETURNING id, 
                          rating, 
                          title, 
                          user_id AS "userId", 
                          movie_id AS "movieId"`;
        const result = await db.query(querySql, [...values, reviewId]);
        const review = result.rows[0];
    
        if (!review) throw new NotFoundError(`No review: ${reviewId}`);
    
        return review;
      }

    /** delete a review */

    static async removeReview(reviewId) {
        let result = await db.query(
            `DELETE
                FROM reviews
                WHERE id = $1
                RETURNING id, title`,
            [reviewId]
        );
        const review = result.rows[0];

        if (!review) throw new NotFoundError(`No review: ${reviewId}`);

        return review; 
    }

    /** find all reviews made by a specific user */

    static async findUserReviews(userId){
        try{
            let result = await db.query(
            `SELECT r.id, 
                r.rating, 
                r.title, 
                r.body,
                r.user_id AS "userId", 
                r.created_at AS "createdAt", 
                r.movie_id AS "movieId"
            FROM reviews r
            JOIN movies m ON r.movie_id = m.id
            WHERE r.user_id = $1
            ORDER BY r.created_at DESC`,
            [userId]
            );

            const reviews = result.rows;

            if(reviews.length === 0){
                throw new NotFoundError(`No reviews found for user with id ${userId}`);
            }
            return reviews;
        } catch (e){
            console.error("Database error:", e);
            throw new BadRequestError("Error fetching reviews for user");
        }
    }

    /** Add tag to a review
     * Updates the review_tags table
     */

    static async addTagToReview(reviewId, tagName){
        try{
            let result = await db.query(
                `INSERT INTO review_tags
                (review_id, name)
                VALUES ($1, $2)
                RETURNING id, review_id AS "reviewId", name AS "tagName"`,
                [reviewId, tagName]
            )
            let tag = result.rows[0];
            return tag;
        }catch(e){
            console.error("Database error:", e);
            throw new BadRequestError("Error adding tag to review");
        }
    }

    /** Remove a tag from a review
     * Updates the review_tags table
     */

    static async removeTagFromReview(id){
        try{
            let result = await db.query(
                `DELETE FROM review_tags
                WHERE id = $1
                RETURNING id`,
                [id]
            )
            let tag = result.rows[0];
            return tag;
        }catch(e){
            console.error("Database error:", e);
            throw new BadRequestError("Error adding tag to review");
        }
    }

    /** Get the tags associated with a specific review */

    static async getReviewTags(reviewId){
        try{
            let result = await db.query(
                `SELECT t.id,
                    t.name
                FROM tags t
                JOIN review_tags rt ON t.id = rt.tag_name
                WHERE rt.review_id = $1
                ORDER BY t.name`,
                [reviewId]
            );
            let tags = result.rows;
            return tags;
            
        }catch(e){
            console.error("Database error:", e);
            throw new BadRequestError(`Error finding tags for review: ${reviewId}`);
        }
    }

    /** Get the reviews associated with a specific tag */

    static async getReviewsByTags(tagName){
        try{
            let result = await db.query(
                `SELECT r.id,
                    r.rating,
                    r.title,
                    r.body,
                    r.user_id AS "userId",
                    r.movie_id AS "movieId",
                    r.created_at AS "createdAt"
                FROM reviews r
                JOIN review_tags rt ON r.id = rt.review_id
                WHERE rt.tag_name = $1
                ORDER BY r.created_at DESC`,
                [tagName]
            );
            let reviews = result.rows;
            return reviews;

        }catch(e){
            console.error("Database error:", e);
            throw new BadRequestError(`Error finding reviews for tag: ${tagName}`);
        }
    }
}

module.exports = Review;

