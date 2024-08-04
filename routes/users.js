/** Routes for users. */

const express = require("express");
const {BadRequestError} = require("../expressError");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");

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
        const {username, password, firstName, lastName, birthday, email} = req.body;
        const user = await User.register({username, password, firstName, lastName, birthday, email});
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
    try{
        const {username, password} = req.body;
        const user = await User.authenticate(username, password);
        const token = User.generateToken(user);
        return res.json({user, token})
    } catch(e){
        console.error("Login error:", e);
        return next(e);
    }
});


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: friend or same user-as-:username
 **/

router.get('/:username', async (req, res, next) => {
    try{
        const username = req.params.username;
        const user = await User.get(username);
        return res.json({user})
    } catch(e) {
        return next(e);
    }
})



/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email, birthday }
 *
 * Returns { username, firstName, lastName, email, birthday }
 *
 * Authorization required: same-user-as-:username
 **/

router.patch('/:username', async (req, res, next) => {
    try{
        const username = req.params.username;
        const data = req.body;
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



module.exports = router;