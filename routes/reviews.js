/** Routes for reviews. */

const express = require("express");
const {BadRequestError, NotFoundError} = require("../expressError");
const Review = require("../models/review");
const Comment = require("../models/comment");
const Like = require("../models/like");

const router = express.Router();

/** add a review */

router.post('/add', async(req, res,  next) => {
    try{
        console.log("Received review data:", req.body);
        const {movie_imdb_id, username, rating, title, body} = req.body;
        const review = await Review.addReview({
            rating, 
            title, 
            body, 
            movie_imdb_id, 
            user_username: username 
        });
        
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

/** Find all reviews made by a specific user */
router.get('/:userId', async(req, res, next)=> {
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

/** Remove tag from a review */
router.delete('/:reviewId/tag/:tagName', async(req, res, next) => {
    try {
        const {reviewId, tagName} = req.params;
        const removedTag = await Review.removeTagFromReview(reviewId, tagName);
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

//Comment routes
/** These are nested within reviews because it allows for better routing
 * as comments are only relevant to reviews
 */

/** Add a comment */

router.post('/:reviewId/comments/add', async(req, res,  next) => {
    try{
        const {userId, body} = req.body;
        const reviewId = req.params.reviewId;
        const comment = await Comment.addComment(userId, reviewId, body);
        return res.status(201).json({comment})
    }catch (e){
        return next(e);
    }
});

/** Edit a comment */

router.patch('/:reviewId/comments/:commentId', async (req, res, next) => {
    try{
        const { reviewId, commentId } = req.params;
        const data = req.body;
        const updatedComment = await Comment.editComment(commentId, {reviewId, ...data})

        return res.json({ comment: updatedComment });

    }catch(e){

        return next(e)
    }
});

/** Delete a comment */

router.delete('/:reviewId/comments/:commentId', async(req, res, next) => {
    try {
        const { reviewId, commentId } = req.params;
        const deletedComment = await Comment.removeComment(reviewId, commentId);

        if(!deletedComment){
            throw new NotFoundError(`Comment with id ${commentId} not found`)
        }
        return res.json({ deleted: deletedComment });
    } catch(e){
        return next(e);
    }
});



/** Find all comments made on a specific review */

router.get('/:reviewId/comments', async(req, res, next)=> {
    try{
        const reviewId = req.params.reviewId;
        const comments = await Comment.findReviewComments(reviewId);
        if(!comments){
            throw new NotFoundError(`No comments found for this review: ${reviewId}`)
        }
        return res.json({ comments });
    } catch(e) {
        return next(e)
    }
})

//Like routes
/** These are nested within reviews because it allows for better routing
 * as likes are only relevant to reviews
 */


/** Adds a new like to a review. **/

router.post('/:reviewId/like', async(req, res, next) => {
    try{
        const {userId} = req.body;
        const reviewId = req.params.reviewId;
        const like = await Like.addLike(userId, reviewId);
        return res.status(201).json({like})  
    } catch(e){
        next(e)
    }
})


/** Removes a like from a review */

router.delete('/:reviewId/like', async( req, res, next ) => {
    try{
        const {userId} = req.body;
        const reviewId = req.params.reviewId;
        const removed = await Like.removeLike(userId, reviewId);
        return res.json({removed})
    } catch(e){
        return next(e)
    }
})

module.exports = router;