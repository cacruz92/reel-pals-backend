const db = require("../db");
const { BadRequestError } = require("../expressError")
const { sqlForPartialUpdate } = require("../helpers/sql");

class Review {
    /** add a new review */
    static async addReview(movieId, userId){
        try{
            const result = await db.query(
                `INSERT INTO reviews
                (rating,
                title,
                body,
                user_id,
                movie_id)`
            )
        } catch(e){
            console.error("Database error:", e);
            throw new BadRequestError("There was an issue in adding the review :(")
        }
    }
    /** edit a review */
    /** delete a review */
}

module.exports = Review;

