const express = require("express");
const Movie = require("../models/movie")

const router = express.Router();

/** POST / { movie }  => { movie }
 *
 * Adds a new movie from the API to our database. 
 *
 * This returns the newly created movie:
 *  {movie: { title, year, imdbId }}
 *
 **/

router.post('/add', async(req, res, next) => {
    try{
        const {
            imdbID, Title, Year, Actors, Country, Director, 
            Genre, Plot, Poster, Rated, Ratings, Released, 
            Runtime, Writer
        } = req.body;

        //separate the actors and genres into individual columns
        const actors = Actors.split(', ')
        const genres = Genre.split(', ')
        
        //separate the ratings into different sources
        let imdbRating = null;
        let rottenTomatoesRating = null;
        let metacriticRating = null;

        for(let rating of Ratings){
            if(rating.Source === 'Internet Movie Database'){
                imdbRating = rating.Value;
            } else if(rating.Source === 'Rotten Tomatoes'){
                rottenTomatoesRating = rating.Value;
            }
            if(rating.Source === 'Metacritic'){
                metacriticRating = rating.Value;
            }
        }

        const movieData = {
            imdb_id: imdbID, 
            title: Title, 
            year: parseInt(Year),
            actor1: actors[0] || null, 
            actor2: actors[1] || null, 
            actor3: actors[2] || null, 
            country: Country, 
            director: Director,
            genre1: genres[0] || null, 
            genre2: genres[1] || null, 
            genre3: genres[2] || null, 
            plot: Plot, 
            poster_url: Poster, 
            rated: Rated,
            imdb_rating: imdbRating, 
            rotten_tomatoes_rating: rottenTomatoesRating, 
            metacritic_rating: metacriticRating,
            released: Released, 
            runtime: Runtime, 
            writer: Writer
        }


        const movie = await Movie.addMovie(movieData);
        return res.status(movie.id ? 201 : 200).json({movie})
    } catch(e){
        return next(e);
    }
})

module.exports = router;