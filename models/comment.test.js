const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Comment = require("./comment.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../_testCommon.js");
const exp = require("constants");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Comment Model", () => {
    test("can add a comment", async () => {
        const newComment = {
            username: "user1",
            reviewId: 1, 
            body: "Great review!"
        };
        const comment = await Comment.addComment(newComment.username, newComment.reviewId, newComment.body);
        expect(comment.username).toEqual(newComment.username);
        expect(comment.reviewId).toEqual(newComment.reviewId);
        expect(comment.body).toEqual(newComment.body);
    });
  
    test("can edit a comment", async () => {
        const newComment = await Comment.addComment("user1", 1, "Great review!");
 
        const editedComment = await Comment.editComment(newComment.id, {
        body: "Updated comment"
        });
  
        expect(editedComment.body).toEqual("Updated comment");
        expect(editedComment.username).toEqual("user1");
        expect(editedComment.reviewId).toEqual(1);
    });

    test("can find review comments", async() => {
        await Comment.addComment("user3", 3, "Comment on review3");
        await Comment.addComment("user4", 3, "Another comment on review3");

        const reviewComments = await Comment.findReviewComments(3);
        //each review has 1 comment from the test setup
        expect(reviewComments.length).toEqual(3);                   
        expect(reviewComments[0].reviewId).toEqual(3);
        expect(reviewComments[1].reviewId).toEqual(3);
    })


    test("can remove a comment", async () => {
        const newComment = await Comment.addComment("user1", 1, "Comment to be removed");
        const removedComment = await Comment.removeComment(newComment.id);

        expect(removedComment.username).toEqual("user1");
        expect(removedComment.reviewId).toEqual(1);
    });
        
    test("thows NotFoundError when removing non-existent comment", async () => {
       await expect(Comment.removeComment(0)).rejects.toThrow(NotFoundError); 
    })
        
    test("thows NotFoundError when editing non-existent comment", async () => {
       await expect(Comment.editComment(0, {body: "blah blah"})).rejects.toThrow(NotFoundError); 
    })
   
    test("returns empty array for review with no comments", async () => {
        const comments = await Comment.findReviewComments(999999);
        expect(comments).toEqual([]);
    });
  });