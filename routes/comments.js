/** Routes for comments. */

const express = require("express");
const {BadRequestError, NotFoundError} = require("../expressError");
const Comment = require("../models/comment");

const router = express.Router();

/** add a comment */

router.post('/add', async(req, res,  next) => {
    try{
        const {userId, reviewId, body} = req.body;
        const comment = await Comment.addComment(movieId, userId, rating, title, body);
        return res.status(201).json({comment})
    }catch (e){
        return next(e);
    }
});

/** edit a comment */

router.patch('/:commentId', async (req, res, next) => {
    try{
        const commentId = req.params.commentId;
        const data = req.body;
        const updatedComment = await Comment.editComment(commentId, rating, title, body)

        if(!updatedComment){
            throw new NotFoundError(`Comment with id ${commentId} not found`)
        }
        return res.json({ comment: updatedComment });
    }catch(e){
        return next(e)
    }
});

/** delete a comment */
router.delete('/:commentId', async(req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const deletedComment = await Comment.removeComment(commentId);

        if(!updatedComment){
            throw new NotFoundError(`Comment with id ${commentId} not found`)
        }
        return res.json({ deleted: deletedComment });
    } catch(e){
        return next(e);
    }
});

/** find all comments made by a specific user */
router.get('/user/:userId', async(req, res, next)=> {
    try{
        const userId = req.params.userId;
        const comments = await Comment.findUserComments(userId);
        if(!comments){
            throw new NotFoundError(`No comments found for this user: ${userId}`)
        }
        return res.json({ comments });
    } catch(e) {
        return next(e)
    }
})

/** find all comments made on a specific post */

router.get('/review/:reviewId', async(req, res, next)=> {
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



module.exports = router;