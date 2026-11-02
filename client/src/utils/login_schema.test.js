import { describe, it, expect } from "vitest";
import { validateLogin } from "./login_schema";

describe("validateLogin", () => {
  it("menerima username dan password yang valid", () => {
    const result = validateLogin({ username: "aryo", password: "rahasia123" });
    expect(result.success).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("menolak username kosong", () => {
    const result = validateLogin({ username: "", password: "rahasia123" });
    expect(result.success).toBe(false);
    expect(result.errors.username).toBe("Username wajib diisi");
  });

  it("menolak username yang hanya berisi spasi", () => {
    const result = validateLogin({ username: "   ", password: "rahasia123" });
    expect(result.success).toBe(false);
    expect(result.errors.username).toBe("Username wajib diisi");
  });

  it("menolak username kurang dari 3 karakter", () => {
    const result = validateLogin({ username: "ab", password: "rahasia123" });
    expect(result.errors.username).toBe("Username minimal 3 karakter");
  });

  it("menolak username lebih dari 30 karakter", () => {
    const result = validateLogin({
      username: "a".repeat(31),
      password: "rahasia123",
    });
    expect(result.errors.username).toBe("Username maksimal 30 karakter");
  });

  it("menolak password kosong", () => {
    const result = validateLogin({ username: "aryo", password: "" });
    expect(result.success).toBe(false);
    expect(result.errors.password).toBe("Password wajib diisi");
  });

  it("menolak password kurang dari 6 karakter", () => {
    const result = validateLogin({ username: "aryo", password: "12345" });
    expect(result.errors.password).toBe("Password minimal 6 karakter");
  });

  it("melaporkan error username dan password sekaligus", () => {
    const result = validateLogin({ username: "", password: "" });
    expect(result.errors.username).toBeDefined();
    expect(result.errors.password).toBeDefined();
  });

  it("merapikan spasi di sekitar username", () => {
    const result = validateLogin({
      username: " aryo ",
      password: "rahasia123",
    });
    expect(result.success).toBe(true);
    expect(result.data.username).toBe("aryo");
  });
});
