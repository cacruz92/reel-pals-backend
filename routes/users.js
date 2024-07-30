/** Routes for users. */

const express = require("express");
const {BadRequestError} = require("../expressError");
const User = require("../models/user");

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. 
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 **/


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: friend or same user-as-:username
 **/