const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");

describe("Auth & Protected Routes", () => {

  test("Login should fail with invalid credentials", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "fake@test.com",
        password: "wrongpassword"
      });

    expect([400,401]).toContain(res.statusCode);

  });

  test("Login should fail without email", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        password: "password123"
      });

    expect([400,401]).toContain(res.statusCode);

  });

  test("Login should fail without password", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com"
      });

    expect([400,401]).toContain(res.statusCode);

  });

  test("Library route should require authentication", async () => {

    const res = await request(app)
      .get("/api/library");

    expect(res.statusCode).toBe(401);

  });

  test("Add favorite should fail without token", async () => {

    const res = await request(app)
      .post("/api/library/add")
      .send({
        movieId: 123,
        title: "Batman",
        category: "favorites"
      });

    expect(res.statusCode).toBe(401);

  });

});

afterAll(async () => {
  await mongoose.connection.close();
});