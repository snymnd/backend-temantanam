const welcomeHandler = (_, h) => {
  const response = h.response("<h1>Welcome to TemanTanam API</h1>");
  response.code(200);
  return response;
};

module.exports = welcomeHandler;
