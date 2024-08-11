CREATE DATABASE reel_pals;

\c reel_pals

DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS review_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    birthday DATE,
    picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follows (
    follower_username VARCHAR(255) REFERENCES users(username),
    followed_username VARCHAR(255) REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (following_username, followed_username)
);

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    imdb_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    year INTEGER,
    actor1 VARCHAR(255),
    actor2 VARCHAR(255),
    actor3 VARCHAR(255),
    country VARCHAR(255),
    director VARCHAR(255),
    genre1 VARCHAR(100),
    genre2 VARCHAR(100),
    genre3 VARCHAR(100),
    plot TEXT,
    poster_url TEXT,
    rated VARCHAR(10),
    imdb_rating VARCHAR(10),
    rotten_tomatoes_rating VARCHAR(10),
    metacritic_rating VARCHAR(10),
    released VARCHAR(50),
    runtime VARCHAR(50),
    writer VARCHAR(255)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    user_username VARCHAR REFERENCES users(username) NOT NULL,
    movie_imdb_id VARCHAR REFERENCES movies(imdb_id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    poster VARCHAR
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_username VARCHAR REFERENCES users(user_username),
    review_id INTEGER REFERENCES reviews(id),
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE review_tags (
    id SERIAL PRIMARY KEY,
    tag_name VARCHAR(255) REFERENCES tags(name),
    review_id INTEGER REFERENCES reviews(id)
);

CREATE TABLE likes (
    user_username VARCHAR REFERENCES users(user_username),
    review_id INTEGER REFERENCES reviews(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_username, review_id)
);

INSERT INTO users (username, email, hashed_password, first_name, last_name, birthday, picture, created_at)
VALUES
('user1', 'user1@example.com', 'hashed_password1', 'John', 'Doe', '1990-01-01', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user2', 'user2@example.com', 'hashed_password2', 'Jane', 'Smith', '1985-02-15', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user3', 'user3@example.com', 'hashed_password3', 'Michael', 'Brown', '1992-03-23', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user4', 'user4@example.com', 'hashed_password4', 'Emily', 'Davis', '1988-04-30', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user5', 'user5@example.com', 'hashed_password5', 'David', 'Wilson', '1995-05-17', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user6', 'user6@example.com', 'hashed_password6', 'Sarah', 'Miller', '1991-06-22', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user7', 'user7@example.com', 'hashed_password7', 'Chris', 'Anderson', '1993-07-29', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user8', 'user8@example.com', 'hashed_password8', 'Jessica', 'Thomas', '1989-08-14', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user9', 'user9@example.com', 'hashed_password9', 'James', 'Jackson', '1994-09-19', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user10', 'user10@example.com', 'hashed_password10', 'Amanda', 'White', '1992-10-05', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user11', 'user11@example.com', 'hashed_password11', 'Matthew', 'Harris', '1987-11-12', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user12', 'user12@example.com', 'hashed_password12', 'Olivia', 'Martin', '1990-12-21', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user13', 'user13@example.com', 'hashed_password13', 'Daniel', 'Lee', '1986-01-30', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user14', 'user14@example.com', 'hashed_password14', 'Sophia', 'García', '1991-02-25', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user15', 'user15@example.com', 'hashed_password15', 'Ethan', 'Martinez', '1995-03-18', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user16', 'user16@example.com', 'hashed_password16', 'Ava', 'Rodriguez', '1989-04-14', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user17', 'user17@example.com', 'hashed_password17', 'Mason', 'Wilson', '1992-05-23', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user18', 'user18@example.com', 'hashed_password18', 'Isabella', 'Moore', '1994-06-29', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user19', 'user19@example.com', 'hashed_password19', 'Jacob', 'Taylor', '1993-07-16', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user20', 'user20@example.com', 'hashed_password20', 'Charlotte', 'Jackson', '1990-08-21', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user21', 'user21@example.com', 'hashed_password21', 'William', 'White', '1995-09-09', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user22', 'user22@example.com', 'hashed_password22', 'Ella', 'Harris', '1988-10-14', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user23', 'user23@example.com', 'hashed_password23', 'Alexander', 'Martin', '1994-11-17', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user24', 'user24@example.com', 'hashed_password24', 'Mia', 'Thompson', '1991-12-20', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user25', 'user25@example.com', 'hashed_password25', 'Benjamin', 'García', '1986-01-25', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user26', 'user26@example.com', 'hashed_password26', 'Harper', 'Wilson', '1992-02-18', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user27', 'user27@example.com', 'hashed_password27', 'James', 'Jackson', '1987-03-13', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user28', 'user28@example.com', 'hashed_password28', 'Evelyn', 'Taylor', '1993-04-22', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user29', 'user29@example.com', 'hashed_password29', 'Henry', 'Moore', '1994-05-15', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT),
('user30', 'user30@example.com', 'hashed_password30', 'Zoe', 'Harris', '1989-06-30', 'https://www.verywellfit.com/thmb/JkI3_s9taUJm1O5MG8foabEEB4U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/silhouette-profile-picture-5c458f84c9e77c000177b88a.jpg', DEFAULT);



-- User: user1
INSERT INTO reviews (rating, title, body, user_username, movie_imdb_id, created_at, poster)
VALUES
(4, 'Amazing Adventure', 'This film took me on a thrilling adventure. The plot was gripping, and the characters were well-developed. A must-watch!', 'user1', 'tt0121111', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BZDkzYmFmNWMtNjExNi00YTQ0LWFiNWEtYzJlZjllYjhmMjhiXkEyXkFqcGdeQXVyMTIxMzMzMzE@._V1_SX300.jpg'),
(5, 'Masterpiece!', 'An absolute masterpiece of cinema. The visuals were stunning, and the soundtrack was incredible. Highly recommended!', 'user1', 'tt0122222', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BMDM3MTkyZjktNmI3MS00OWExLWI0ZjYtZTgxYTYwYThjYWJhXkEyXkFqcGdeQXVyNjUzNzQ4NDQ@._V1_SX300.jpg'),
(3, 'Not Bad', 'The movie was decent but didn’t quite live up to the hype. Some interesting moments, but overall it felt lacking.', 'user1', 'tt0076759', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg'),
(2, 'Disappointing', 'I was disappointed with this film. The storyline was weak, and the characters were not engaging.', 'user1', 'tt0080684', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'),
(4, 'Great Fun!', 'A fun and enjoyable movie with great performances. It was a refreshing experience with lots of laughs and excitement.', 'user1', 'tt0086190', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BOWZlMjFiYzgtMTUzNC00Y2IzLTk1NTMtZmNhMTczNTk0ODk1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg'),
(3, 'Good But Forgettable', 'The film was good but nothing special. It’s one of those movies that you forget about soon after watching.', 'user2', 'tt2036416', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BMWU2OTAyMTktMTU5MC00MTNhLTg1NzAtOTZjNWFjMDRiZGUxXkEyXkFqcGdeQXVyNDY3MzUxOTI@._V1_SX300.jpg'),
(4, 'Solid Performance', 'A solid performance by the cast. The movie had its moments, and I enjoyed the overall experience.', 'user2', 'tt4649558', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BYTQ2ZWJlZTUtNWFlZC00YjBhLTlhOWEtNGQ4NDBhNjAzNGI0XkEyXkFqcGdeQXVyMjU3MzQ3NjE@._V1_SX300.jpg'),
(5, 'Highly Entertaining', 'Absolutely entertaining from start to finish. The plot twists kept me on the edge of my seat. Great movie!', 'user2', 'tt0222012', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BYzMxYzZjMDUtZjI3Ni00Y2M2LTllYWItNzJmZTJjMzkyYjlmXkEyXkFqcGdeQXVyODEzOTQwNTY@._V1_SX300.jpg'),
(2, 'Mediocre', 'The movie was mediocre at best. It didn’t have much substance and felt very predictable.', 'user2', 'tt1307068', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BMTk4MDQ1NzE3N15BMl5BanBnXkFtZTcwMjA0MDkzNw@@._V1_SX300.jpg'),
(3, 'Entertaining', 'An entertaining film but with some flaws. It was a decent watch but didn’t quite meet expectations.', 'user2', 'tt1392170', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BZWI1OWM3ZmEtNjQ2OS00NzI2LTgwNWMtZDAyMGI1OTM2MzJmXkEyXkFqcGdeQXVyNjc5NjEzNA@@._V1_SX300.jpg'),
(4, 'Impressive Drama', 'The drama was impressively executed, with strong performances and a compelling storyline. Worth watching.', 'user3', 'tt1951264', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BMTAyMjQ3OTAxMzNeQTJeQWpwZ15BbWU4MDU0NzA1MzAx._V1_SX300.jpg'),
(5, 'Incredible Journey', 'A breathtaking journey through an amazing story. The visuals and soundtrack were top-notch. A must-see!', 'user3', 'tt1951265', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BMTcxNDI2NDAzNl5BMl5BanBnXkFtZTgwODM3MTc2MjE@._V1_SX300.jpg'),
(3, 'Entertaining Yet Flawed', 'The movie was entertaining but had its flaws. Some parts dragged on, but overall it was an enjoyable experience.', 'user3', 'tt1951266', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BNjQzNDI2NTU1Ml5BMl5BanBnXkFtZTgwNTAyMDQ5NjE@._V1_SX300.jpg'),
(2, 'Underwhelming', 'The film did not meet my expectations. The plot was predictable, and the character development was lacking.', 'user3', 'tt1951267', CURRENT_TIMESTAMP, 'https://www.pngall.com/wp-content/uploads/2016/05/Film-Reel-Free-Download-PNG.png'),
(4, 'Great Watch', 'A great watch with a few memorable moments. The acting was solid, and the direction was commendable.', 'user3', 'tt1951268', CURRENT_TIMESTAMP, 'https://www.pngall.com/wp-content/uploads/2016/05/Film-Reel-Free-Download-PNG.png'),
(3, 'Decent Flick', 'A decent flick with some good moments, but it didn’t stand out as much as I hoped. Still, worth a watch.', 'user4', 'tt1951225', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BMTk4MDE1MTkwN15BMl5BanBnXkFtZTcwNTM3MjU4NQ@@._V1_SX300.jpg'),
(4, 'Well Done', 'The movie was well done with strong performances and a gripping storyline. It kept me engaged throughout.', 'user4', 'tt1951300', CURRENT_TIMESTAMP, 'https://www.pngall.com/wp-content/uploads/2016/05/Film-Reel-Free-Download-PNG.png'),
(5, 'Fantastic Film', 'A fantastic film with excellent direction and a compelling plot. The acting was superb. Highly recommend!', 'user4', 'tt1951205', CURRENT_TIMESTAMP, 'https://www.pngall.com/wp-content/uploads/2016/05/Film-Reel-Free-Download-PNG.png'),
(2, 'Not Worth It', 'The film didn’t live up to the hype. It was slow-paced and lacked depth. Not worth the time.', 'user4', 'tt1965489', CURRENT_TIMESTAMP, 'https://www.pngall.com/wp-content/uploads/2016/05/Film-Reel-Free-Download-PNG.png'),
(3, 'Okay Movie', 'An okay movie with some interesting elements, but overall it was just average. Nothing extraordinary.', 'user4', 'tt0120915', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BYTRhNjcwNWQtMGJmMi00NmQyLWE2YzItODVmMTdjNWI0ZDA2XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg'),
(4, 'Great Drama', 'A great drama with an engaging story and strong performances. The film was well-crafted and enjoyable.', 'user5', 'tt0120917', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BMjFkMzk2OWUtNjFmZC00ZTJhLTlkNGYtYjc2YWNkNmJmNzczXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'),
(5, 'Top Notch', 'Top-notch film with incredible direction and a captivating story. The performances were outstanding!', 'user5', 'tt0120919', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BM2YwZTI0ZGYtMmM2MC00NjkwLWE0OGQtMjE5Njc2NzNjODMyXkEyXkFqcGdeQXVyMTk0NjE5NzY@._V1_SX300.jpg'),
(3, 'Interesting but Flawed', 'An interesting movie with some flaws. The storyline had potential but didn’t fully deliver.', 'user5', 'tt0120920', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BMTY5MmMyNjUtMGZiZC00YjJiLTgxOWUtNzg4NTBlYmNiMTY3XkEyXkFqcGdeQXVyODU5ODY0ODc@._V1_SX300.jpg'),
(2, 'Disappointing Watch', 'Disappointing watch with a lackluster plot and weak characters. Not up to expectations.', 'user5', 'tt0122213', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BN2Q2NjVkOGYtMzhjNy00YTk5LTg2OWYtOGRiNTk3OTQ4YmVkXkEyXkFqcGdeQXVyMTAwNzIyMzAy._V1_SX300.jpg'),
(4, 'Highly Enjoyable', 'Highly enjoyable movie with great entertainment value. The cast did a fantastic job.', 'user5', 'tt0121111', CURRENT_TIMESTAMP, 'https://m.media-amazon.com/images/M/MV5BZDkzYmFmNWMtNjExNi00YTQ0LWFiNWEtYzJlZjllYjhmMjhiXkEyXkFqcGdeQXVyMTIxMzMzMzE@._V1_SX300.jpg');



CREATE DATABASE reel_pals_test;


\c reel_pals_test

DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS review_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    birthday DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follows (
    following_user_id INTEGER REFERENCES users(id),
    followed_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (following_user_id, followed_user_id)
);

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INTEGER,
    imdb_id VARCHAR(255) UNIQUE
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    body TEXT,
    user_id INTEGER REFERENCES users(id),
    movie_id INTEGER REFERENCES movies(id),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    review_id INTEGER REFERENCES reviews(id),
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE review_tags (
    id SERIAL PRIMARY KEY,
    tag_id INTEGER REFERENCES tags(id),
    review_id INTEGER REFERENCES reviews(id)
);

CREATE TABLE likes (
    user_id INTEGER REFERENCES users(id),
    review_id INTEGER REFERENCES reviews(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, review_id)
);