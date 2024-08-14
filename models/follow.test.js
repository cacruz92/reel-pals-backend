const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Follow = require("./follow.js");
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

describe("Follow Model", () => {
    test("can follow a user", async () => {
      const follow = await Follow.followUser("user5", "user2");
      expect(follow.followerUsername).toEqual("user5");
      expect(follow.followedUsername).toEqual("user2");
    });
  
    test("can find user followers", async () => {
      
      await Follow.followUser("user4", "user1");
      await Follow.followUser("user3", "user1");
  
      const followers = await Follow.findUserFollowers("user1");
      expect(followers.length).toEqual(2);
      expect(followers.map(f => f.username)).toContain("user3");
      expect(followers.map(f => f.username)).toContain("user4");
    });
  
    test("can find user following", async () => {
      
      await Follow.followUser("user5", "user2");
      await Follow.followUser("user5", "user3");
  
      const following = await Follow.findUserFollowing("user5");
      expect(following.length).toEqual(2);
      expect(following.map(f => f.username)).toContain("user2");
      expect(following.map(f => f.username)).toContain("user3");
    });

    test("can unfollow a user", async () => {
      await Follow.followUser("user5", "user1");
      
      const removedFollow = await Follow.removeFollow("user5", "user1");

      expect(removedFollow.followerUsername).toEqual("user5");
      expect(removedFollow.followedUsername).toEqual("user1");
    });
      
  });