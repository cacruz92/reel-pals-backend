const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Like = require("./like.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require("../_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Like Model", () => {
    test("can add a like", async () => {
      const newLike = {
        username: "user5",
        reviewId: 1
      };
      const like = await Like.addLike(newLike.username, newLike.reviewId);
      expect(like.username).toEqual(newLike.username);
      expect(like.reviewId).toEqual(newLike.reviewId);
    });
  
    test("can remove a like", async () => {
      await Like.addLike("user1", 2);
  
      const removedLike = await Like.removeLike("user1", 2);
      expect(removedLike.username).toEqual("user1");
      expect(removedLike.reviewId).toEqual(2);
    });
  
  });