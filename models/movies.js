const db = require("../db");
const {
    NotFoundError, 
    BadRequestError, 
    UnauthorizedError
} = require("../expressError")

class Movie{
    /** Add Movie
     * adds movie to database
     * returns { id, title, year, imdb_id}
     * Throws BadRequestError on duplicates
     */

    static async addMovie(title, year, imdbId){
        //check for duplicates
        const duplicateCheck = await db.query(
            `SELECT title,
                year
            FROM movies
            WHERE title = $1 AND year = $2`,
            [title, year]
        )

        if(duplicateCheck.rows[0]){
            throw new BadRequestError("That movie already exists!")
        }

        const result = await db.query(
            `INSERT INTO movies
            (title,
            year,
            imdb_id)
            VALUES ($1, $2, $3)
            RETURNING title, year, imdb_id AS "imdbId`,
            [title, year, imdbId]
        )

        const movie = result.rows[0];
        return movie;
    }

}

module.exports = Movie;