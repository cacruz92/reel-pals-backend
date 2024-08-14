const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Movie = require("./movie.js");
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

describe("Movie Model", () => {
    test("can add a movie", async () => {
      const newMovie = {
        imdb_id: "tt1234567",
        title: "Test Movie",
        year: 2023,
        actor1: "Test actor1", 
        actor2: "Test actor2", 
        actor3: "Test actor3", 
        country: "Test country", 
        director: "Test director", 
        genre1: "Test genre1", 
        genre2: "Test genre2", 
        genre3: "Test genre3", 
        plot: "Test plot", 
        poster_url: "Test poster_url", 
        rated: "Test rated", 
        imdb_rating: "TEST", 
        rotten_tomatoes_rating: "TEST", 
        metacritic_rating: "TEST", 
        released: "Test released", 
        runtime: "Test runtime", 
        writer: "Test writer"
      };
      const movie = await Movie.addMovie(newMovie);
      expect(movie.imdb_id).toEqual(newMovie.imdb_id);
      expect(movie.title).toEqual(newMovie.title);
      expect(movie.year).toEqual(newMovie.year);
      expect(movie.actor1).toEqual(newMovie.actor1);
      expect(movie.actor2).toEqual(newMovie.actor2);
      expect(movie.actor3).toEqual(newMovie.actor3);
      expect(movie.country).toEqual(newMovie.country);
      expect(movie.director).toEqual(newMovie.director);
      expect(movie.genre1).toEqual(newMovie.genre1);
      expect(movie.genre2).toEqual(newMovie.genre2);
      expect(movie.genre3).toEqual(newMovie.genre3);
      expect(movie.plot).toEqual(newMovie.plot);
      expect(movie.poster_url).toEqual(newMovie.poster_url);
      expect(movie.rated).toEqual(newMovie.rated);
      expect(movie.imdb_rating).toEqual(newMovie.imdb_rating);
      expect(movie.rotten_tomatoes_rating).toEqual(newMovie.rotten_tomatoes_rating);
      expect(movie.metacritic_rating).toEqual(newMovie.metacritic_rating);
      expect(movie.released).toEqual(newMovie.released);
      expect(movie.runtime).toEqual(newMovie.runtime);
      expect(movie.writer).toEqual(newMovie.writer);
      
    });
});