const { createServer } = require("../server")

describe('Home plugin', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('home endpoint returns 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/',
    })
    expect(res.statusCode).toEqual(200)
    const response = res.payload
    expect(response).toEqual("<h1>Welcome to TemanTanam API</h1>")
  })
})
