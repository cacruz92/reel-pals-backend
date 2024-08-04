const express = require("express");
const Follow = require("../models/follow");

const router = express.Router();

/** POST / { followingUserId, followedUserId }  => { follow }
 *
 * Adds a new follow relationship to the database. 
 *
 * This returns the newly created follow relationship:
 *  { followingUserId, followedUserId }
 *
 **/

router.post('/add', async(req, res, next) => {
    try{
        const {followingUserId, followedUserID} = req.body;
        const newFollow = await Follow.followUser(followingUserId, followedUserID);
        return res.status(201).json({newFollow})  
    } catch(e){
        next(e)
    }
})


/** GET /followers/:userId  => { followers }
 *
 * Gets all followers for a specific user
 *
 * This returns an array of followers:
 *  { followers: [ {id, username, firstName, lastName, followedSince}, ... ] }
 *
 **/

router.get('/followers/:userId', async(req, res, next) => {
    try{
        const userId = req.params.userId;
        const followers = await Follow.findUserFollowers(userId);
        return res.json({followers})  
    } catch(e){
        next(e)
    }
})



/** GET /following/:userId  => { following }
 *
 * Gets all users that a specific user is following
 *
 * This returns an array of followed users:
 *  { following: [ {id, username, firstName, lastName, followingSince}, ... ] }
 *
 **/
router.get('/following/:userId', async(req, res, next) => {
    try{
        const userId = req.params.userId;
        const following = await Follow.findUserFollowing(userId);
        return res.json({following})  
    } catch(e){
        return next(e)
    }
})

/** DELETE /remove  => { removed }
 *
 * Removes a follow relationship from the database
 *
 * This returns the removed follow relationship:
 *  { removed: { followingUserId, followedUserId } }
 *
 **/

router.delete('/remove', async( req, res, next ) => {
    try{
        const {followingUserId, followedUserID} = req.body;
        const removedFollow = await Follow.removeFollow(followingUserId, followedUserID);
        return res.json({removedFollow})
    } catch(e){
        return next(e)
    }
})


module.exports = router;