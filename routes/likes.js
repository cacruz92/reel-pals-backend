const express = require("express");
const Like = require("../models/like")

const router = express.Router();

/** POST / { userId, reviewId }  => { like }
 *
 * Adds a new like to a review. 
 *
 * This returns the newly created like:
 *  { userId, reviewId }
 *
 **/

router.post('/add', async(req, res, next) => {
    try{
        const {userId, reviewId} = req.body;
        const like = await Like.addLike(userId, reviewId);
        return res.status(201).json({like})  
    } catch(e){
        next(e)
    }
})


/** DELETE /remove  => { removed }
 *
 * Removes a like from a review
 *
 * This returns the removed follow relationship:
 *  { removed: { userId, reviewId } }
 *
 **/

router.delete('/remove', async( req, res, next ) => {
    try{
        const {userId, reviewId} = req.body;
        const removed = await Like.removeLike(userId, reviewId);
        return res.json({removed})
    } catch(e){
        return next(e)
    }
})


module.exports = router;