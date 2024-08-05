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

    static async addMovie(movieData){
        //Check for duplicates
        const duplicateCheck = await db.query(
            `SELECT imdb_id
            FROM movies
            WHERE imdb_id = $1`,
            [movieData.imdb_id]
        )

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Movie with IMDb ID ${imdbID} already exists!`);
          }
          
        const result = await db.query(
            `INSERT INTO movies(   
                imdb_id, title, year, actor1, actor2, actor3, country, director,
                genre1, genre2, genre3, plot, poster_url, rated,
                imdb_rating, rotten_tomatoes_rating, metacritic_rating,
                released, runtime, writer)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING *`,
            [
                movieData.imdb_id, movieData.title, movieData.year, 
                movieData.actor1, movieData.actor2, movieData.actor3, 
                movieData.country, movieData.director, 
                movieData.genre1, movieData.genre2, movieData.genre3,
                movieData.plot, movieData.poster_url, movieData.rated, 
                movieData.imdb_rating, movieData.rotten_tomatoes_rating, movieData.metacritic_rating,
                movieData.released, movieData.runtime, movieData.writer
            ]
        )

        const movie = result.rows[0];
        return movie;
    }

}

module.exports = Movie;