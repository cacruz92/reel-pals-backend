/** Routes for users. */

const express = require("express");
const {BadRequestError} = require("../expressError");
const User = require("../models/user");

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
        return res.status(201).json({user})
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
        return res.json({user})
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

module.exports = router;