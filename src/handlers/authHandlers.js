const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase/auth");
const firebaseApp = require("../lib/firebaseApp");
const bcrypt = require("bcrypt");
const connectDb = require("../lib/dbConnection");
const { uuidv4 } = require("@firebase/util");

const auth = getAuth(firebaseApp);

const registerHandler = async (request, h) => {
  const { email, password, name } = request.payload;
  let response;
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // hash password
      const hashedPassword = bcrypt.hashSync(password, 10);
      console.log(hashedPassword);
      const userId = uuidv4();

      // save to db
      // TODO: make it to be in a transaction
      connectDb(
        `INSERT INTO users VALUES('${userId}', '${name}', '${email}', '${hashedPassword}', NULL, NULL, NOW());`
      ).then((res) => {
        console.log(res, "insert into users success");
      });

      // Signed in
      const user = userCredential.user;
      response = h.response({
        status: "success",
        message: "User created successfully",
        data: {
          id: userId,
          firebaseId: user.uid,
          email: user.email,
          name: name,
          token: user.accessToken,
          refreshToken: user.refreshToken,
          expirationTime: user.stsTokenManager.expirationTime,
        },
      });
      response.code(201);
    })
    .catch((error) => {
      let message;
      switch (error.code) {
        case "auth/email-already-in-use":
          message = `Email address already in use.`;
          break;
        case "auth/invalid-email":
          message = `Email address  is invalid.`;
          break;
        case "auth/operation-not-allowed":
          message = `Error during sign up.`;
          break;
        case "auth/weak-password":
          message =
            "Password is not strong enough. Add additional characters including special characters and numbers.";
          break;
        default:
          message = error.message;
          break;
      }
      response = h.response({
        status: "fail",
        message: message,
      });
      response.code(400);
    });
  return response;
};

const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  let response;
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // get user data from db
      const query = `SELECT * FROM users WHERE email = '${email}'`;
      let userId, userName;
      connectDb(query).then((res) => {
        console.log(res.rows[0], "res.row[0]");
        if (res.rows[0]) {
          userId = res.rows[0].id;
          userName = res.rows[0].name;
        } else {
          response = h.response({
            status: "fail",
            message: "User not found",
          });
          response.code(404);
        }
      });

      // Signed in
      const user = userCredential.user;
      response = h.response({
        status: "success",
        message: "User login successfully",
        data: {
          id: userId,
          firebaseId: user.uid,
          email: user.email,
          name: userName,
          token: user.stsTokenManager.accessToken,
          refreshToken: user.refreshToken,
          expirationTime: user.stsTokenManager.expirationTime,
        },
      });
      response.code(200);
    })
    .catch((error) => {
      let message;
      switch (error.code) {
        case "auth/invalid-email":
          message = `Email address  is invalid.`;
          break;
        case "auth/user-disabled":
          message = `User with this email has been disabled.`;
          break;
        case "auth/user-not-found":
          message = `There is no user with this email.`;
          break;
        case "auth/wrong-password":
          message = "Password is invalid for this email.";
          break;
        default:
          message = error.message;
          break;
      }
      response = h.response({
        status: "fail",
        message: message,
      });
      response.code(400);
    });
  return response;
};

const logoutHandler = async (_, h) => {
  // Does not invalidate the current token.
  await signOut(auth);
  return h
    .response({
      status: "success",
      message: "User logout successfully",
    })
    .code(200);
};

module.exports = { registerHandler, loginHandler, logoutHandler };
