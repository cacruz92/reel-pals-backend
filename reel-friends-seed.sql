CREATE DATABASE reel_pals;

\c reel_pals

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    birthday DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follows (
    following_username VARCHAR(255) REFERENCES users(username),
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
    user_username INTEGER REFERENCES users(username) NOT NULL,
    movie_id INTEGER REFERENCES movies(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
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
    tag_name VARCHAR(255) REFERENCES tags(name),
    review_id INTEGER REFERENCES reviews(id)
);

CREATE TABLE likes (
    user_id INTEGER REFERENCES users(id),
    review_id INTEGER REFERENCES reviews(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, review_id)
);
CREATE DATABASE reel_pals_test;


\c reel_pals_test

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
