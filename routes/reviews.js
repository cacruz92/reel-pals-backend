/** Routes for reviews. */

const express = require("express");
const {BadRequestError, NotFoundError} = require("../expressError");
const Review = ("../models/review");

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

router.patch('/edit/:reviewId', async (req, res, next) => {
    try{
        const reviewId = req.params.reviewId;
        const {rating, title, body} = req.body;
        const updatedReview = await Review.editReview(reviewId, rating, title, body)

        if(!updatedReview){
            throw new NotFoundError(`Review with id ${reviewId} not found`)
        }
    }catch(e){
        return next(e)
    }
});

/** delete a review */
router.delete('/:reviewId/delete', async(req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
        const deletedReview = await Review.removeReview(reviewId);

        if(!updatedReview){
            throw new NotFoundError(`Review with id ${reviewId} not found`)
        }

        return deletedReview;
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
        return reviews;
    } catch(e) {
        return next(e)
    }
})

