/** Routes for users. */

const express = require("express");
const {BadRequestError, UnauthorizedError} = require("../expressError");
const User = require("../models/user");
const Comment = require("../models/comment");
const Follow = require("../models/follow");
const { authenticateJWT, ensureLoggedIn } = require("../middleware/auth");

const router = express.Router();

/** POST / { user }  => { user }
 *
 * Adds a new user. 
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, birthday }, token }
 *
 **/

router.post('/register', async (req, res, next) => {
    try{
        const {username, password, firstName, lastName, birthday, email, picture} = req.body;
        const user = await User.register({username, password, firstName, lastName, birthday, email, picture});
        const token = User.generateToken(user);
        return res.status(201).json({user, token})
    } catch(e){
        return next(e);
    }
});

/** POST / { username, password }  => { user }
 *
 * Authenticates a user for login. 
 *
 * This returns the user and their token:
 *  {user: { username, firstName, lastName, email, birthday }, token }
 *
 **/

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const { user, token } = await User.authenticate(username, password);
        res.set('Authorization', `Bearer ${token}`);
        return res.json({ user, token });
    } catch(e) {
        console.error("Login error:", e);
        return next(e);
    }
});

/** GET/ [searchTerm] => {users} */

router.get('/search', async(req, res, next) => {
    try{
        const {term} = req.query;
        const users = await User.search(term);
        return res.json({users});
    } catch(e){
        console.error("Backend: User search error", e);
        return next(e);
    }
});

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, birthday }
 *
 * Authorization required: friend or same user-as-:username
 **/

router.get('/:username', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try{
        const username = req.params.username;
        const user = await User.get(username);
        return res.json({user})
    } catch(e) {
        return next(e);
    }
})

/** POST /[username]/verify-password  => { isValid: boolean }
 *
 * Verifies the user's password
 * 
 * Authorization required: same-user-as-:username
 **/

console.log('authenticateJWT:', authenticateJWT);
console.log('ensureLoggedIn:', ensureLoggedIn);
console.log('User.verifyPassword:', User.verifyPassword);


router.post('/:username/verify-password', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const { username } = req.params;
        const { password } = req.body;
        const isValid = await User.verifyPassword(username, password);
        return res.json({ isValid });
    } catch (e) {
        return next(e);
    }
});

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email, birthday }
 *
 * Returns { username, firstName, lastName, email, birthday }
 *
 * Authorization required: same-user-as-:username
 **/

router.patch('/:username', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try{
        const username = req.params.username;
        const data = req.body;

        if(data.newPassword){
            const isValid = await User.verifyPassword(username, data.currentPassword);
            if(!isValid){
                throw new UnauthorizedError("Current password not correct.")
            }
            delete data.currentPassword;
        }

        const user = await User.update(username, data)

        if(!user){
            throw new NotFoundError(`User with username ${username} not found`)
        }
        return res.json({user});
    }catch(e){
        return next(e)
    }
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: same-user-as-:username or admin
 **/

router.delete('/:username', async(req, res, next) => {
    try {
        const username = req.params.username;
        const deletedUser = await User.remove(username);

        if(!deletedUser){
            throw new NotFoundError(`User with username ${username} not found`)
        }
        return res.json({ deleted: deletedUser });
    } catch(e){
        return next(e);
    }
});


/** Find all comments made by a specific user */
router.get('/:username/comments', async(req, res, next)=> {
    try{
        const username = req.params.username;
        const comments = await Comment.findUserComments(username);
        if(!comments){
            throw new NotFoundError(`No comments found for this user: ${username}`)
        }
        return res.json({ comments });
    } catch(e) {
        return next(e)
    }
})

//Follows routes

/** POST / { followerUsername, followedUsername }  => { follow }
 *
 * Adds a new follow relationship to the database. 
 *
 * This returns the newly created follow relationship:
 *  { followerUsername, followedUsername }
 *
 **/

router.post('/:username/follow', authenticateJWT, ensureLoggedIn, async(req, res, next) => {
    try{
        const followedUsername = req.params.username; 
        const followerUsername = req.user.username;
        
        const newFollow = await Follow.followUser(followerUsername, followedUsername);
        return res.status(201).json({follow: newFollow})  
    } catch(e){
        console.error("Error following user:", e);
        return next(e)
    }
})


/** GET /followers/:username  => { followers }
 *
 * Gets all followers for a specific user
 *
 * This returns an array of followers:
 *  { followers: [ {id, username, firstName, lastName, followedSince}, ... ] }
 *
 **/

router.get('/:username/followers', authenticateJWT, ensureLoggedIn, async(req, res, next) => {
    try{
        const username = req.params.username;
        const followers = await Follow.findUserFollowers(username);
        return res.json({followers})  
    } catch(e){
        return next(e)
    }
})



/** GET /:username/following  => { following }
 *
 * Gets all users that a specific user is following
 *
 * This returns an array of followed users:
 *  { follower: [ {id, username, firstName, lastName, followerSince}, ... ] }
 *
 **/
router.get('/:username/following', authenticateJWT, ensureLoggedIn, async(req, res, next) => {
    try{
        const username = req.params.username;
        const following = await Follow.findUserFollowing(username);
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
 *  { removed: { followerUsername, followedUsername } }
 *
 **/

router.delete('/:username/follow', authenticateJWT, ensureLoggedIn, async( req, res, next ) => {
    try{
        const followedUsername = req.params.username;
        const followerUsername = req.user.username;
        const removedFollow = await Follow.removeFollow( followerUsername, followedUsername );
        return res.json({removedFollow})
    } catch(e){
        return next(e)
    }
})


module.exports = router;