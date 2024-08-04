const express = require("express");
const Tag = require("../models/tag")

const router = express.Router();

/** POST / { tag }  => { tag }
 *
 * Adds a new tag to our database. 
 *
 * This returns the newly created tag:
 *  {tag}
 *
 **/

router.post('/add', async(req, res, next) => {
    try{
        const {name} = req.body;
        const tag = await Tag.createTag(name);
        return res.status(201).json({tag})
    } catch(e){
        return next(e);
    }
});

/** GET / ()  => { tags }
 *
 * Finds all tags currently in database
 *
 * This returns the tags:
 *  {tags}
 *
 **/

router.get('/all', async(req, res, next) => {
    try{
        const tags = await Tag.findAllTags();
        return res.json({tags})
    } catch(e){
        return next(e);
    }
})

module.exports = router;