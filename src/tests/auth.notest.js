const { createServer } = require("../server");

describe("POST /auth", () => {
  let server;
  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  test("create user", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        name: "test-user",
        email: `test-${Date.now()}@prisma.io`,
        password: "test-password",
      },
    });

    expect(response.statusCode).toEqual(201);
    const { message } = JSON.parse(response.payload);
    expect(typeof message === "string").toBeTruthy();
  });

  test("login user", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        name: "test-user",
        email: `testing@mail.com`,
        password: "password",
      },
    });

    expect(response.statusCode).toEqual(200);
    const { data } = JSON.parse(response.payload);
    expect(typeof data.stsTokenManager.accessToken === "string").toBeTruthy();
  });

  test("logout user", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/auth/logout",
    });

    expect(response.statusCode).toEqual(200);
    const { message } = JSON.parse(response.payload);
    expect(typeof message === "string").toBeTruthy();
  });
});
