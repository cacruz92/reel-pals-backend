const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError")
const { sqlForPartialUpdate } = require("../helpers/sql");

class Review {
    /** Add a new review */
    static async addReview({movie_imdb_id, user_username, rating, title, body, poster}){
        try{
            const result = await db.query(
                `INSERT INTO reviews
                (rating,
                title,
                body,
                user_username,
                movie_imdb_id,
                poster)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, rating, title, user_username AS "user_username", movie_imdb_id AS "movie_imdb_id", poster`,
                [
                    rating, 
                    title, 
                    body, 
                    user_username, 
                    movie_imdb_id,
                    poster
                ]
            )

            const review = result.rows[0];
            return review;
        } catch(e){
            console.error("Database error:", e);
            throw new BadRequestError("There was an issue in adding the review :(")
        }
    }

    /** Edit a review */

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
                          user_username AS "user_username", 
                          movie_imdb_id AS "movie_imdb_id"`;
        const result = await db.query(querySql, [...values, reviewId]);
        const review = result.rows[0];
    
        if (!review) throw new NotFoundError(`No review: ${reviewId}`);
    
        return review;
      }

    /** Delete a review */

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

    /** Find all reviews made by a specific user */

    static async findUserReviews(user_username){
        try{
           let result = await db.query(
            `SELECT r.id, 
                r.rating, 
                r.title, 
                r.body,
                r.user_username AS "user_username", 
                r.created_at AS "createdAt", 
                r.movie_imdb_id AS "movie_imdb_id",
                r.poster,
                m.title AS movie_title
            FROM reviews r
            JOIN movies m ON r.movie_imdb_id = m.imdb_id
            WHERE r.user_username = $1
            ORDER BY r.created_at DESC`,
            [user_username]
            );

            const reviews = result.rows;

            return reviews;
        } catch (e){
            console.error("Database error:", e);
            console.error("Error details:", e.message, e.stack);
            throw new BadRequestError("Error fetching reviews for user");
        }
    }

    /**Get feed for username
     * generates a list of the 50 most recent posts by users we follow
     */

    static async getFeedForUser(username){
        const result = await db.query(
            `SELECT r.id,
                r.rating,
                r.title,
                r.body,
                r.user_username,
                r.created_at,
                r.movie_imdb_id,
                r.poster,
                m.title AS movie_title
            FROM reviews r
            JOIN follows f ON r.user_username = f.followed_username
            JOIN movies m ON r.movie_imdb_id = m.imdb_id
            WHERE f.follower_username = $1
            ORDER BY r.created_at DESC
            LIMIT 50`,
            [username]
        );
        const feed = result.rows;
        return feed;
    }

    /** Get like count for a review */
    
    static async getLikesCount(reviewId){
        try{
            const result = await db.query(
                `SELECT COUNT(*) as like_count
                FROM likes
                WHERE review_id = $1`,
                [reviewId]
            );
            return parseInt(result.rows[0].like_count);
        }catch(e){
            console.error("Database error:", e);
            throw new BadRequestError(`Error retrieving like count for review: ${reviewId}`)
        }
    }

    /** Find out if review has been liked by user already */
    
    static async isLikedByUser(reviewId, username){
        try{
            const result = await db.query(
                `SELECT EXISTS(
                    SELECT 1
                    FROM likes 
                    WHERE review_id = $1 AND user_username = $2
                ) as is_liked`,
                [reviewId, username]
            );
            return result.rows[0].is_liked;
        }catch(e){
            console.error("Database error:", e);
            throw new BadRequestError(`Error checking if review has been liked: ${reviewId}`)
        }
    }

    /** Get review by review id */

    static async getReview(reviewId){
        try{
            let result = await db.query(
                `SELECT 
                r.id, 
                r.rating, 
                r.title, 
                r.body, 
                r.user_username, 
                r.created_at, 
                r.movie_imdb_id, 
                r.poster,
                m.title AS movie_title
                FROM reviews r
                JOIN movies m ON r.movie_imdb_id = m.imdb_id
                WHERE r.id = $1`,
                [reviewId]
            )
            let review = result.rows[0];

            if(!review){
                throw new NotFoundError(`Review not found: ${reviewId}`);
            }

            review.likes_count = await this.getLikesCount(reviewId);
            review.comments = await this.getReviewComments(reviewId);
            
            return review;
        }catch(e){
            console.error("Database error:", e);
            throw new BadRequestError(`Error finding review: ${reviewId}`)
        }
    };

    /** Gets the comments for a particular review */
    static async getReviewComments(reviewId){
        try{
            let result = await db.query(
                `SELECT c.id,
                    c.body,
                    c.created_at,
                    c.user_username,
                    u.username as user_username
                FROM comments c
                JOIN users u ON c.user_username = u.username
                WHERE c.review_id = $1
                ORDER BY c.created_at DESC`,
                [reviewId]
            );
            return result.rows;
        }catch(e){
            console.error("Database error:", e);
            throw new BadRequestError(`Error finding comments for review: ${reviewId}`)
        }
    }

    /** Get reviews for a specific movie */
    static async getMovieReviews(movie_imdb_id) {
        try {
            const result = await db.query(
                `SELECT r.id, 
                    r.rating, 
                    r.title, 
                    r.body,
                    r.user_username, 
                    r.created_at AS "createdAt", 
                    r.movie_imdb_id,
                    r.poster,
                    m.title AS movie_title
                FROM reviews r
                JOIN movies m ON r.movie_imdb_id = m.imdb_id
                WHERE r.movie_imdb_id = $1
                ORDER BY r.created_at DESC`,
                [movie_imdb_id]
            );

            const reviews = result.rows;

            return reviews;
        } catch (e) {
            console.error("Database error:", e);
            throw new BadRequestError("Error fetching reviews for movie");
        }
    }
}

module.exports = Review;

