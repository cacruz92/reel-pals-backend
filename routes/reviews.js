/** Routes for reviews. */

const express = require("express");
const {BadRequestError, NotFoundError} = require("../expressError");
const Review = require("../models/review");
const Comment = require("../models/comment");
const Like = require("../models/like");
const { authenticateJWT, ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");

const router = express.Router();

/** add a review */

router.post('/add', authenticateJWT, ensureLoggedIn, async(req, res,  next) => {
    try{
        const {movie_imdb_id, username, rating, title, body, poster} = req.body;
        const review = await Review.addReview({
            rating, 
            title, 
            body, 
            movie_imdb_id, 
            user_username: username,
            poster 
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

/** Delete a review */
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

/** Get review by id */
router.get('/:reviewId', async(req, res, next) => {
    try{
        const reviewId = req.params.reviewId;
        const currentUser = req.user;
        const review = await Review.getReview(reviewId);
        
        if (currentUser){
            review.is_liked_by_current_user = await Review.isLikedByUser(reviewId, currentUser);
        } else{
            review.is_liked_by_current_user = false;
        }
        
        return res.json({review})
    } catch(e){
        return next(e);
    }
})

/** Find all reviews made by a specific user */
router.get('/user/:username', async(req, res, next)=> {
    try{
        const username = req.params.username;
        const reviews = await Review.findUserReviews(username);
        return res.json({ reviews });
    } catch(e) {
        console.error("Error in route:", e.message, e.stack);
        return next(e)
    }
})

/** Get reviews for a specific movie */
router.get('/movie/:movie_imdb_id', async (req, res, next) => {
    try {
        const movie_imdb_id = req.params.movie_imdb_id;
        const reviews = await Review.getMovieReviews(movie_imdb_id);
        return res.json({ reviews });
    } catch (e) {
        return next(e);
    }
});

//Comment routes
/** These are nested within reviews because it allows for better routing
 * as comments are only relevant to reviews
 */

/** Add a comment */

router.post('/:reviewId/comments/add', async(req, res,  next) => {
    try{
        const {body} = req.body;
        const {reviewId} = req.params
        const username = req.user.username;

        if(!body || body.trim() === ""){
            throw new BadRequestError("comment cannot be empty")
        }

        const comment = await Comment.addComment(username, reviewId, body);
        return res.status(201).json({comment})
    }catch (e){
        console.error("Error adding comment:", e);
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
        const commentId = req.params.commentId;
        const deletedComment = await Comment.removeComment(commentId);

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

router.post('/:reviewId/like',  async(req, res, next) => {
    try{
        const username = req.user.username;
        const reviewId = req.params.reviewId;
        const like = await Like.addLike(username, reviewId);
        return res.status(201).json({like})  
    } catch(e){
        console.error("Error adding like:", e);
        next(e)
    }
})


/** Removes a like from a review */

router.delete('/:reviewId/like', async( req, res, next ) => {
    try{
        const username = req.user.username;
        const reviewId = req.params.reviewId;
        const removed = await Like.removeLike(username, reviewId);
        return res.json({removed})
    } catch(e){
        return next(e)
    }
})

/** Get Feed of reviews from users followed */

router.get('/feed/:username', async(req, res, next)=> {
    try{
        const username = req.params.username;
        const feed = await Review.getFeedForUser(username);
        return res.json({feed})
    } catch(e) {
        return next(e)
    }
})

/** Get Like count */

router.get('/:reviewId/likes', async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
        const likeCount = await Review.getLikesCount(reviewId);
        return res.json({ likeCount });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;