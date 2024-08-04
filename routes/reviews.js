/** Routes for reviews. */

const express = require("express");
const {BadRequestError, NotFoundError} = require("../expressError");
const Review = require("../models/review");

const router = express.Router();

/** add a review */

router.post('/add', async(req, res,  next) => {
    try{
        const {movieId, userId, rating, title, body} = req.body;
        const review = await Review.addReview(movieId, userId, rating, title, body);
        return res.status(201).json({review})
    }catch (e){
        return next(e);
    }
});

/** edit a review */

router.patch('/:reviewId', async (req, res, next) => {
    try{
        const reviewId = req.params.reviewId;
        const {rating, title, body} = req.body;
        const updatedReview = await Review.editReview(reviewId, {rating, title, body})

        if(!updatedReview){
            throw new NotFoundError(`Review with id ${reviewId} not found`)
        }
        return res.json({ review: updatedReview });
    }catch(e){
        return next(e)
    }
});

/** delete a review */
router.delete('/:reviewId', async(req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
        const deletedReview = await Review.removeReview(reviewId);

        if(!deletedReview){
            throw new NotFoundError(`Review with id ${reviewId} not found`)
        }
        return res.json({ deleted: deletedReview });
    } catch(e){
        return next(e);
    }
});

/** find all reviews made by a specific user */
router.get('/:userId/all', async(req, res, next)=> {
    try{
        const userId = req.params.userId;
        const reviews = await Review.findUserReviews(userId);
        if(!reviews){
            throw new NotFoundError(`No reviews found for this user: ${userId}`)
        }
        return res.json({ reviews });
    } catch(e) {
        return next(e)
    }
})

/** Add tag to a review */
router.post('/:reviewId/tag', async(req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
        const {tagName} = req.body;
        const tagReview = await Review.addTagToReview(reviewId, tagName);
        return res.json({taggedReview: tagReview})
    } catch(e){
        return next(e);
    }
})

/** remove tag from a review */
router.delete('/:reviewId/tag/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        const removedTag = await Review.removeTagFromReview(id);
        return res.json({removed: removedTag})
    } catch(e){
        return next(e);
    }
})

/** Get the tags associated with a specific review */
router.get('/:reviewId/tags', async(req, res, next)=> {
    try{
        const reviewId = req.params.reviewId;
        const tags = await Review.getReviewTags(reviewId);
        if(!tags){
            throw new NotFoundError(`No tags found for this review: ${reviewId}`)
        }
        return res.json({tags});
    } catch(e) {
        return next(e)
    }
})

/** Get the reviews associated with a specific tag */
router.get('/tags/:tagName', async(req, res, next)=> {
    try {
        const tagName = req.params.tagName;
        const taggedReviews = await Review.getReviewsByTags(tagName);

        if(!taggedReviews){
            throw new NotFoundError(`Error finding reviews for tag: ${tagName}`)
        }

        return res.json({ taggedReviews });
    } catch(e){
        return next(e)
    }
})

module.exports = router;