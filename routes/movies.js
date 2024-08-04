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
        const {title, year, imdbId} = req.body;
        const movie = await Movie.addMovie(title, year, imdbId);
        return res.status(201).json({movie})
    } catch(e){
        return next(e);
    }
})

module.exports = router;