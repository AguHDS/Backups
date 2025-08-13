import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { getProfileMiddleware } from "@/interfaces/http/middlewares/getProfileMiddleware.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";
import { User } from "@/domain/entities/User.js";
import { getMockReq, getMockRes } from "vitest-mock-express";

describe("getProfileMiddleware", () => {
  let req: any;
  let res: any;
  let next: any;
  let clearResMocks: () => void;
  let fakeFindByUsername: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    req = getMockReq({ params: { username: "agustin" } });
    const mocks = getMockRes();
    res = mocks.res;
    next = mocks.next;
    clearResMocks = mocks.mockClear;
    clearResMocks();

    fakeFindByUsername = vi
      .spyOn(MysqlUserRepository.prototype, "findByUsername")
      .mockResolvedValue(
        new User(123, "Agustin", "agus@email.com", "hashed123", "user")
      );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call next() if user exist", async () => {
    await getProfileMiddleware(req, res, next);

    expect(fakeFindByUsername).toHaveBeenCalledWith("agustin");
    expect(req.baseUserData).toEqual({
      id: 123,
      name: "Agustin",
      email: "agus@email.com",
      role: "user",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should respond 404 if user doesn't exist", async () => {
    fakeFindByUsername.mockResolvedValueOnce(null);

    await getProfileMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: "Profile data for agustin not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should respond 500 if there is an unexpected error", async () => {
    fakeFindByUsername.mockRejectedValueOnce(new Error("DB down"));

    await getProfileMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: "Internal server error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
