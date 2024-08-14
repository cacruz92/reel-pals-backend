const bcrypt = require("bcrypt");
const db = require("./db.js");
const { BCRYPT_WORK_FACTOR } = require("./config");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

async function commonBeforeAll() {
  // Clear any data that is in the test db
  await db.query("DELETE FROM likes");
  await db.query("DELETE FROM comments");
  await db.query("DELETE FROM reviews");
  await db.query("DELETE FROM follows");
  await db.query("DELETE FROM movies");
  await db.query("DELETE FROM users");

  // Create 5 new users to test user models and routes
  const hashedPasswords = await Promise.all([
    bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
    bcrypt.hash("password4", BCRYPT_WORK_FACTOR),
    bcrypt.hash("password5", BCRYPT_WORK_FACTOR)
  ]);

  await db.query(`
    INSERT INTO users (username, email, hashed_password, first_name, last_name, birthday, picture)
    VALUES 
      ('user1', 'user1@example.com', $1, 'First1', 'Last1', '1990-01-01', 'http://example.com/pic1.jpg'),
      ('user2', 'user2@example.com', $2, 'First2', 'Last2', '1991-02-02', 'http://example.com/pic2.jpg'),
      ('user3', 'user3@example.com', $3, 'First3', 'Last3', '1992-03-03', 'http://example.com/pic3.jpg'),
      ('user4', 'user4@example.com', $4, 'First4', 'Last4', '1993-04-04', 'http://example.com/pic4.jpg'),
      ('user5', 'user5@example.com', $5, 'First5', 'Last5', '1994-05-05', 'http://example.com/pic5.jpg')
  `, hashedPasswords);

  // Create some new follow relationships
  await db.query(`
    INSERT INTO follows (follower_username, followed_username)
    VALUES 
      ('user1', 'user2'),
      ('user1', 'user3'),
      ('user2', 'user3'),
      ('user3', 'user4'),
      ('user4', 'user5')
  `);

  // Create 3 movies entries
  await db.query(`
    INSERT INTO movies (imdb_id, title, year, actor1, actor2, actor3, country, director, genre1, genre2, genre3, plot, poster_url, rated, imdb_rating, rotten_tomatoes_rating, metacritic_rating, released, runtime, writer)
    VALUES 
      ('tt0111161', 'The Shawshank Redemption', 1994, 'Tim Robbins', 'Morgan Freeman', 'Bob Gunton', 'USA', 'Frank Darabont', 'Drama', NULL, NULL, 'Two imprisoned men bond over a number of years...', 'http://example.com/shawshank.jpg', 'R', '9.3', '91%', '80', '1994-10-14', '142 min', 'Stephen King'),
      ('tt0068646', 'The Godfather', 1972, 'Marlon Brando', 'Al Pacino', 'James Caan', 'USA', 'Francis Ford Coppola', 'Crime', 'Drama', NULL, 'The aging patriarch of an organized crime dynasty...', 'http://example.com/godfather.jpg', 'R', '9.2', '98%', '100', '1972-03-24', '175 min', 'Mario Puzo'),
      ('tt0071562', 'The Godfather: Part II', 1974, 'Al Pacino', 'Robert Duvall', 'Diane Keaton', 'USA', 'Francis Ford Coppola', 'Crime', 'Drama', NULL, 'The early life and career of Vito Corleone...', 'http://example.com/godfather2.jpg', 'R', '9.0', '96%', '90', '1974-12-20', '202 min', 'Francis Ford Coppola')
  `);

  // Create 10 movie reviews
  const reviewsResult = await db.query(`
    INSERT INTO reviews (id, rating, title, body, user_username, movie_imdb_id, poster)
    VALUES 
      (1, 5, 'Amazing movie', 'This is one of the best movies I have ever seen.', 'user1', 'tt0111161', 'http://example.com/poster1.jpg'),
      (2, 4, 'Great film', 'Really enjoyed this classic.', 'user2', 'tt0068646', 'http://example.com/poster2.jpg'),
      (3, 5, 'Masterpiece', 'Even better than the first one.', 'user3', 'tt0071562', 'http://example.com/poster3.jpg'),
      (4, 4, 'Solid sequel', 'A worthy follow-up to the original.', 'user4', 'tt0071562', 'http://example.com/poster4.jpg'),
      (5, 5, 'Classic', 'One of the greatest films ever made.', 'user5', 'tt0068646', 'http://example.com/poster5.jpg'),
      (6, 4, 'Memorable', 'A movie that stays with you.', 'user1', 'tt0068646', 'http://example.com/poster6.jpg'),
      (7, 5, 'Unforgettable', 'A true cinematic masterpiece.', 'user2', 'tt0111161', 'http://example.com/poster7.jpg'),
      (8, 4, 'Powerful', 'A moving and thought-provoking film.', 'user3', 'tt0111161', 'http://example.com/poster8.jpg'),
      (9, 5, 'Epic', 'A sprawling and ambitious sequel.', 'user4', 'tt0071562', 'http://example.com/poster9.jpg'),
      (10, 4, 'Gripping', 'Keeps you on the edge of your seat.', 'user5', 'tt0111161', 'http://example.com/poster10.jpg')
    RETURNING id
  `);

  const reviewIds = reviewsResult.rows.map(row => row.id);

  // Create 10 comments under the movie reviews
  await db.query(`
    INSERT INTO comments (user_username, review_id, body)
    VALUES 
      ('user2', $1, 'Totally agree!'),
      ('user3', $2, 'Nice review!'),
      ('user4', $3, 'Well said.'),
      ('user5', $4, 'Interesting perspective.'),
      ('user1', $5, 'Couldn''t agree more.'),
      ('user2', $6, 'Great points.'),
      ('user3', $7, 'Spot on review.'),
      ('user4', $8, 'Couldn''t have said it better myself.'),
      ('user5', $9, 'You nailed it.'),
      ('user1', $10, 'Excellent review!')
  `, reviewIds);

  // Create 10 likes
  await db.query(`
    INSERT INTO likes (user_username, review_id)
    VALUES 
      ('user1', $1),
      ('user2', $2),
      ('user3', $3),
      ('user4', $4),
      ('user5', $5),
      ('user1', $6),
      ('user2', $7),
      ('user3', $8),
      ('user4', $9),
      ('user5', $10)
  `, reviewIds);

  }
async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

// Create test tokens for each user in test database
const testTokens = {};
['user1', 'user2', 'user3', 'user4', 'user5'].forEach(username => {
  testTokens[username] = jwt.sign({ username }, JWT_SECRET);
});


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testTokens
};