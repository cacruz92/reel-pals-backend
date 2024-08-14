const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Review = require("./review.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Review Model", () => {
    test("can add a review", async () => {
      const newReview = {
        movie_imdb_id: "tt0111161",
        user_username: "user1",
        rating: 5,
        title: "Great movie",
        body: "This movie was amazing!",
        poster: "http://example.com/poster.jpg"
      };

      const review = await Review.addReview(newReview);
      expect(review.movie_imdb_id).toEqual(newReview.movie_imdb_id);
      expect(review.user_username).toEqual(newReview.user_username);
      expect(review.rating).toEqual(newReview.rating);
      expect(review.title).toEqual(newReview.title);
      expect(review.body).toEqual(newReview.body);
      expect(review.poster).toEqual(newReview.poster);
    });
  
    test("can edit a review", async () => {
      const newReview = await Review.addReview({
        movie_imdb_id: "tt0111161",
        user_username: "user2",
        rating: 5,
        title: "Great movie",
        body: "This movie was amazing!",
        poster: "http://example.com/poster.jpg"
      });
  
      const editedReview = await Review.editReview(newReview.id, {
        rating: 4,
        title: "Good movie",
        body: "This movie was pretty good."
      });
  
      expect(editedReview.rating).toEqual(4);
      expect(editedReview.title).toEqual("Good movie");
      expect(editedReview.body).toEqual("This movie was pretty good.");
    });
  
    test("can remove a review", async () => {
      const newReview = await Review.addReview({
        movie_imdb_id: "tt0111161",
        user_username: "user3",
        rating: 4,
        title: "Good movie",
        body: "This movie was ok!",
        poster: "http://example.com/poster.jpg"
      });
  
      const remomvedReview = await Review.removeReview(newReview.id);
      
      expect(remomvedReview.id).toEqual(newReview.id);
    });

    test("can find user reviews", async () => {
      const reviews = await Review.findUserReviews("user1");

      expect(reviews.length).toBeGreaterThan(0);
      expect(reviews[0].user_username).toEqual("user1");
    });

    test("can get user feed", async () => {
      const feed = await Review.getFeedForUser("user1");

      expect(Array.isArray(feed)).toBeTruthy();
      expect(feed.length).toBeGreaterThan(0);
      expect(feed.map(f => f.user_username)).toContain("user2");
      expect(feed.map(f => f.user_username)).toContain("user3");
    });

    test("can get likes count", async () => {
      //review from test database
      const review = await Review.getReview(2);
      const likesCount = await Review.getLikesCount(review.id);

      expect(typeof likesCount).toBe('number');
      expect(likesCount).toEqual(1);
    });

    test("can check if review is liked by user", async () => {
      //review from test database
      const review = await Review.getReview(2);
      const isLiked = await Review.isLikedByUser(review.id, "user2");

      expect(typeof isLiked).toBe('boolean');
      expect(isLiked).toEqual(true);
    });

    test("can get review byId", async () => {
      //reviews from test database
      const review = await Review.getReview(1);
           
      expect(review.id).toEqual(review.id);
      expect(review.likes_count).toBeDefined();
      expect(review.comments).toBeDefined();
    });

    test("can get reviews for a movie", async () => {
      const reviews = await Review.getMovieReviews("tt0111161");
      
      expect(Array.isArray(reviews)).toBeTruthy();

      expect(reviews[0].movie_imdb_id).toEqual("tt0111161");
    });

  });