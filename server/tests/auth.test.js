const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../src/config/db", () => ({ query: jest.fn() }));
const pool = require("../src/config/db");
const app = require("../src/app");

process.env.JWT_SECRET = "test-secret";

describe("Auth API", () => {
  beforeEach(() => {
    pool.query.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {});
    process.env.JWT_SECRET = "test-secret";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("register: password disimpan sebagai hash bcrypt", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ nama: "Mea", email: "mea@test.com", password: "password123" });

    expect(res.statusCode).toBe(201);
    const hashTersimpan = pool.query.mock.calls[1][1][2];
    expect(hashTersimpan).not.toBe("password123");
    expect(await bcrypt.compare("password123", hashTersimpan)).toBe(true);
  });

  test("register: field kosong mengembalikan 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "mea@test.com" });
    expect(res.statusCode).toBe(400);
  });

  test("register: email sudah terdaftar mengembalikan 409", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: "1" }] });
    const res = await request(app)
      .post("/api/auth/register")
      .send({ nama: "Mea", email: "mea@test.com", password: "password123" });
    expect(res.statusCode).toBe(409);
  });

  test("login: berhasil menerbitkan token JWT berlaku 24 jam", async () => {
    const hash = await bcrypt.hash("password123", 10);
    pool.query.mockResolvedValueOnce({
      rows: [{ id: "1", nama: "Mea", email: "mea@test.com", password_hash: hash }],
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "mea@test.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    const decoded = jwt.verify(res.body.token, "test-secret");
    expect(decoded.id).toBe("1");
    expect(decoded.exp - decoded.iat).toBe(24 * 60 * 60);
  });

  test("login: password salah mengembalikan 401", async () => {
    const hash = await bcrypt.hash("benar12345", 10);
    pool.query.mockResolvedValueOnce({
      rows: [{ id: "1", email: "mea@test.com", password_hash: hash }],
    });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "mea@test.com", password: "salah12345" });
    expect(res.statusCode).toBe(401);
  });

  test("login: email tidak terdaftar mengembalikan 401", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "x@test.com", password: "password123" });
    expect(res.statusCode).toBe(401);
  });

  test("login: JWT_SECRET tidak ada mengembalikan 500", async () => {
    const hash = await bcrypt.hash("password123", 10);
    pool.query.mockResolvedValueOnce({
      rows: [{ id: "1", email: "mea@test.com", password_hash: hash }],
    });
    delete process.env.JWT_SECRET;
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "mea@test.com", password: "password123" });
    expect(res.statusCode).toBe(500);
  });
});
