const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");

describe("MovieMate API", () => {

    test("Home route should work", async () => {

        const res = await request(app)
            .get("/");

        expect(res.statusCode).toBe(200);

    });

});
afterAll(async () => {
  await mongoose.connection.close();
});