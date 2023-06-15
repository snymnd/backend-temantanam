/* eslint-disable camelcase */
const connectDb = require("../lib/dbConnection");

const getUserHandler = async (request, h) => {
  const id = request.params.userId;
  let response;

  let query = `SELECT * FROM users`;
  if (id) {
    query += ` WHERE id = '${id}'`;
  }

  const res = await connectDb(query);
  const user = res.rows[0];
  console.log(user);

  if (user !== undefined) {
    response = h
      .response({
        status: "success",
        message: "User found",
        data: user,
      })
      .code(200);
  } else {
    response = h
      .response({
        status: "fail",
        message: "User not found",
      })
      .code(404);
  }

  return response;
};

const updateUserHandler = async (request, h) => {
  const id = request.params.userId;
  const { name, email, image_url, phone } = request.payload;
  let response;

  console.log("name:", name);
  console.log("email:", email);
  console.log("image_url:", image_url);
  console.log("phone:", phone);
  console.log(id);

  let query = `UPDATE users SET`;
  if (name !== undefined) {
    query += ` name = '${name}',`;
  }
  if (email !== undefined) {
    query += ` email = '${email}',`;
  }
  if (image_url !== undefined) {
    query += ` image_url = '${image_url}',`;
  }
  if (phone !== undefined) {
    query += ` phone = '${phone}',`;
  }

  query += ` updated_at = NOW() WHERE id = '${id}'::uuid`;
  console.log("query:", query);
  const res = await connectDb(query);

  if (res && res.rowCount > 0) {
    const getUser = await connectDb(
      `SELECT * FROM users WHERE id = '${id}'::uuid`
    );
    const updatedUser = getUser.rows[0];
    response = h
      .response({
        status: "success",
        message: "User updated successfully",
        data: updatedUser,
      })
      .code(200);
  } else {
    response = h
      .response({
        status: "fail",
        message: "Failed to update user",
      })
      .code(400);
  }

  return response;
};

module.exports = { getUserHandler, updateUserHandler };
