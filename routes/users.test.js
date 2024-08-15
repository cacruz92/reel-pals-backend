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

beforeAll(commonBeforeAll);

beforeEach(async () => {
  await commonBeforeEach();
  const loginResponse = await request(app)
    .post('/users/login')
    .send({ username: 'user1', password: 'password1' });
  userToken = loginResponse.body.token;
});

afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("User Routes", () => {
  describe("POST /users/register", () => {
    test("works for anon", async () => {
      const resp = await request(app)
        .post("/users/register")
        .send({
          username: "newuser",
          password: "password",
          firstName: "New",
          lastName: "User",
          email: "new@user.com",
          birthday: "1990-01-01"
        });
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        user: {
          username: "newuser",
          firstName: "New",
          lastName: "User",
          email: "new@user.com",
          birthday: expect.any(String),
          picture: expect.any(String)
        },
        token: expect.any(String)
      });
    });
  });

  describe("POST /users/login", () => {
    test("works", async () => {
      const resp = await request(app)
        .post("/users/login")
        .send({
          username: "user1",
          password: "password1"
        });
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual({
        user: {
          username: "user1",
          firstName: "First1",
          lastName: "Last1",
          email: "user1@example.com",
          birthday: expect.any(String),
          picture: expect.any(String)
        },
        token: expect.any(String)
      });
    });

    test("unauth with wrong password", async () => {
      const resp = await request(app)
        .post("/users/login")
        .send({
          username: "user1",
          password: "wrongpassword"
        });
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("GET /users/search", () => {
    test("works", async () => {
      const resp = await request(app)
        .get("/users/search")
        .query({ term: "user" });
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual({
        users: expect.any(Array)
      });
      expect(resp.body.users.length).toBeGreaterThan(0);
    });
  });

  describe("GET /users/:username", () => {
    test("works for same user", async () => {
      const resp = await request(app)
        .get("/users/user1")
        .set("Authorization", `Bearer ${userToken}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual({
        user: {
          username: "user1",
          firstName: "First1",
          lastName: "Last1",
          email: "user1@example.com",
          birthday: expect.any(String),
          picture: "http://example.com/pic1.jpg"
        }
      });
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .get("/users/user1");
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("POST /users/:username/verify-password", () => {
    test("works for same user", async () => {
      const resp = await request(app)
        .post("/users/user1/verify-password")
        .send({ password: "password1" })
        .set("Authorization", `Bearer ${userToken}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual({ isValid: true });
    });
  });

  describe("PATCH /users/:username", () => {
    test("works for same user", async () => {
      const resp = await request(app)
        .patch("/users/user1")
        .send({
          firstName: "NewFirst",
          email: "new@email.com"
        })
        .set("Authorization", `Bearer ${userToken}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual({
        user: {
          username: "user1",
          firstName: "NewFirst",
          lastName: "Last1",
          email: "new@email.com",
          birthday: expect.any(String),
          picture: "http://example.com/pic1.jpg"
        }
      });
    });

    test("unauth for anon", async () => {
      const resp = await request(app)
        .patch("/users/user1")
        .send({
          firstName: "NewFirst"
        });
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("POST /users/:username/follow", () => {
    test("works", async () => {
      const resp = await request(app)
        .post("/users/user2/follow")
        .set("Authorization", `Bearer ${userToken}`);
      expect(resp.statusCode).toEqual(400);
      });
    });
  });

  describe("GET /users/:username/followers", () => {
    test("works", async () => {
      const resp = await request(app)
        .get("/users/user1/followers")
        .set("Authorization", `Bearer ${userToken}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual({
        followers: expect.any(Array)
      });
    });
  });

  describe("GET /users/:username/following", () => {
    test("works", async () => {
      const resp = await request(app)
        .get("/users/user1/following")
        .set("Authorization", `Bearer ${userToken}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual({
        following: expect.any(Array)
      });
    });
  });

  describe("DELETE /users/:username/follow", () => {
    test("works", async () => {
      const resp = await request(app)
        .delete("/users/user2/follow")
        .set("Authorization", `Bearer ${userToken}`);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual({
        removedFollow: expect.any(Object)
      });
    });
  });