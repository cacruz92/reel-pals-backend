const request = require("supertest");
const app = require("../app");
const db = require("../db");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testTokens
} = require("../_testCommon");

let userToken;
let testReviewId;
let testCommentId;

beforeAll(async () => {
  await commonBeforeAll();
});

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

beforeEach(async () => {
    await commonBeforeEach();
    const loginResponse = await request(app)
      .post('/users/login')
      .send({ username: 'user1', password: 'password1' });
    userToken = loginResponse.body.token;

    const reviewRes = await db.query(
      `INSERT INTO reviews (rating, title, body, user_username, movie_imdb_id, poster)
       VALUES (5, 'Test Review', 'This is a test review', 'user1', 'tt0111161', 'http://example.com/poster.jpg')
       RETURNING id`
    );
    testReviewId = reviewRes.rows[0].id;

    const commentRes = await db.query(
      `INSERT INTO comments (user_username, review_id, body)
       VALUES ('user1', $1, 'Test comment')
       RETURNING id`,
      [testReviewId]
    );
    testCommentId = commentRes.rows[0].id;
  });

describe("Review Routes", () => {
  describe("POST /reviews/add", () => {
    test("works for logged in user", async () => {
      const resp = await request(app)
        .post("/reviews/add")
        .send({
          movie_imdb_id: "tt0111161",
          username: "user1",
          rating: 5,
          title: "Great movie",
          body: "This is a fantastic movie!",
          poster: "http://example.com/poster.jpg"
        })
        .set("Authorization", `Bearer ${userToken}`);
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toHaveProperty("review");
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .post("/reviews/add")
        .send({
          movie_imdb_id: "tt0111161",
          username: "user1",
          rating: 5,
          title: "Great movie",
          body: "This is a fantastic movie!",
          poster: "http://example.com/poster.jpg"
        });
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("PATCH /reviews/:reviewId", () => {
    test("works for logged in user", async () => {
      const resp = await request(app).patch(`/reviews/${testReviewId}`)
        .send({
          rating: 4,
          title: "Updated title",
          body: "Updated body"
        })
        .set("Authorization", `Bearer ${testTokens.user1}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("review");
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .patch("/reviews/1")
        .send({
          rating: 4,
          title: "Updated title",
          body: "Updated body"
        });
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("DELETE /reviews/:reviewId", () => {
    test("works for logged in user", async () => {
      const resp = await request(app)
        .delete(`/reviews/${testReviewId}`)
        .set("Authorization", `Bearer ${userToken}`);
        
        if (resp.statusCode !== 200) {
            console.error("Delete review error:", resp.body);
          }

      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("deleted");
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .delete("/reviews/1");
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("GET /reviews/:reviewId", () => {
    test("works for logged in user", async () => {
      const resp = await request(app)
        .get("/reviews/1")
        .set("Authorization", `Bearer ${testTokens.user1}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("review");
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .get("/reviews/1");
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("GET /reviews/user/:username", () => {
    test("works for logged in user", async () => {
      const resp = await request(app)
        .get("/reviews/user/user1")
        .set("Authorization", `Bearer ${testTokens.user1}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("reviews");
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .get("/reviews/user/user1");
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("GET /reviews/movie/:movie_imdb_id", () => {
    test("works for anyone", async () => {
      const resp = await request(app)
        .get("/reviews/movie/tt0111161");
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("reviews");
    });
  });

  describe("POST /reviews/:reviewId/comments/add", () => {
    test("works for logged in user", async () => {
      const resp = await request(app)
        .post("/reviews/1/comments/add")
        .send({ body: "Great review!" })
        .set("Authorization", `Bearer ${testTokens.user1}`);
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toHaveProperty("comment");
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .post("/reviews/1/comments/add")
        .send({ body: "Great review!" });
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("PATCH /reviews/:reviewId/comments/:commentId", () => {
    test("works for logged in user", async () => {
      const resp = await request(app)
        .patch(`/reviews/${testReviewId}/comments/${testCommentId}`)
        .send({ body: "Updated comment" })
        .set("Authorization", `Bearer ${testTokens.user1}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("comment");
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .patch("/reviews/1/comments/1")
        .send({ body: "Updated comment" });
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("DELETE /reviews/:reviewId/comments/:commentId", () => {
    test("works for logged in user", async () => {
      const resp = await request(app)
        .delete(`/reviews/${testReviewId}/comments/${testCommentId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("deleted");
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .delete("/reviews/1/comments/1");
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("GET /reviews/:reviewId/comments", () => {
    test("works for anyone", async () => {
      const resp = await request(app)
        .get("/reviews/1/comments");
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("comments");
    });
  });

  describe("POST /reviews/:reviewId/like", () => {
    test("works for logged in user", async () => {
      const resp = await request(app)
        .post(`/reviews/${testReviewId}/like`)
        .set("Authorization", `Bearer ${testTokens.user1}`);
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toHaveProperty("like");
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .post("/reviews/1/like");
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("DELETE /reviews/:reviewId/like", () => {
    test("works for logged in user", async () => {
      const resp = await request(app)
        .delete("/reviews/1/like")
        .set("Authorization", `Bearer ${testTokens.user1}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("removed");
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .delete("/reviews/1/like");
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("GET /reviews/feed/:username", () => {
    test("works for logged in user", async () => {
      const resp = await request(app)
        .get("/reviews/feed/user1")
        .set("Authorization", `Bearer ${testTokens.user1}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("feed");
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .get("/reviews/feed/user1");
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("GET /reviews/:reviewId/likes", () => {
    test("works for anyone", async () => {
      const resp = await request(app)
        .get("/reviews/1/likes");
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("likeCount");
    });
  });
});