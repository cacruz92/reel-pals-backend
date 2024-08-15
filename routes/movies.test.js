const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testTokens
} = require("../_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /movies/add", () => {
    test("works for adding a new movie", async () => {
      const resp = await request(app)
          .post("/movies/add")
          .send({
            imdbID: "tt1234567",
            Title: "Test Movie",
            Year: "2023",
            Actors: "Test actor1, Test actor2, Test actor3",
            Country: "Test country",
            Director: "Test director",
            Genre: "Test genre1, Test genre2, Test genre3",
            Plot: "Test plot",
            Poster: "Test poster_url",
            Rated: "Test rated",
            Ratings: [
              {Source: "Internet Movie Database", Value: "8.5"},
              {Source: "Rotten Tomatoes", Value: "85%"},
              {Source: "Metacritic", Value: "75"}
            ],
            Released: "Test released",
            Runtime: "Test runtime",
            Writer: "Test writer"
          });
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        movie: expect.objectContaining({
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
            imdb_rating: "8.5",
            rotten_tomatoes_rating: "85%",
            metacritic_rating: "75",
            released: "Test released",
            runtime: "Test runtime",
            writer: "Test writer"
        })
      });
    });

    test("fails with missing required fields", async () => {
      const resp = await request(app)
          .post("/movies/add")
          .send({
            Title: "Incomplete Movie",
            Year: "2023"
          });
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual(
        "Missing required fields: imdbID, Title, and Year are required"
      );
    });
});