const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require("../_testCommon.js");
const exp = require("constants");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("User Model", () => {
  test("can register", async () => {
    const newUser = {
      username: "newuser",
      password: "password123",
      firstName: "New",
      lastName: "User",
      email: "new@user.com",
      birthday: "1990-01-01"
    };
    const user = await User.register(newUser);
    expect(user.username).toEqual(newUser.username);
    expect(user.firstName).toEqual(newUser.firstName);
    expect(user.lastName).toEqual(newUser.lastName);
    expect(user.email).toEqual(newUser.email);
    expect(user.birthday instanceof Date).toBe(true);
    expect(user.birthday.toISOString().split('T')[0]).toEqual(newUser.birthday);
    expect(user.password).not.toEqual(newUser.password);
  });

  test("can authenticate", async () => {
    const newUser = {
      username: "testuser",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      email: "test@user.com",
      birthday: "1990-01-01"
    };
    await User.register(newUser);
    const auth = await User.authenticate(newUser.username, newUser.password);
    expect(auth).toBeTruthy();
  });

  test("throws error when password is wrong", async () => {
    await expect(User.authenticate("user1", "wrongpassword")).rejects.toThrow(UnauthorizedError);
  });

  test("can generate and verify token", () => {
    const user = {
      username: "user4",
      email: "user4@example.com",
      firstName: "First4",
      lastName: "Last4"
    };

    const token = User.generateToken(user);
    expect(typeof token).toBe('string');

    const verified = User.verifyToken(token);
    expect(verified.username).toEqual(user.username);
  });

  test("can get user by username", async () => {
    const user = await User.get("user1");
    expect(user.username).toEqual("user1")
  });

  test("throws error when trying to get user by incorrect username", async () => {
    await expect(User.get("zoltan")).rejects.toThrow(NotFoundError);
  });

  test("can remove a user", async () => {
    await User.register({
      username: "removeUser",
      password: "password",
      firstName: "Remove",
      lastName: "User",
      email: "remove@user.com",
      birthday: "1992-04-04"
    });

    const removed = await User.remove("removeUser");
    expect(removed.username).toEqual("removeUser");
  });

  test("can update a user", async () => {
    await User.register({
      username: "updateUser",
      password: "password",
      firstName: "Update",
      lastName: "User",
      email: "remove@user.com",
      birthday: "1992-04-04"
    });

    const updated = await User.update("updateUser", {
      firstName: "UPDATED",
      lastName: "UPDATED"
    });
    expect(updated.username).toEqual("updateUser");
    expect(updated.firstName).toEqual("UPDATED");
    expect(updated.lastName).toEqual("UPDATED");
  });

  test("can search users by name", async () => {
    const results = await User.search("user");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].username).toBeDefined();
      expect(results[0].lastName).toBeDefined();
      expect(results[0].firstName).toBeDefined();
  })

});