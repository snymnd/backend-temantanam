// Load required modules
const admin = require("firebase-admin");
const Package = require("../../package.json");
const Unauthorized = require("boom").unauthorized;
const dotenv = require("dotenv");
dotenv.config();

const serviceAccount = require("../../" + process.env.FIREBASE_ADMIN_SDK);

function firebaseAuthScheme(_, options) {
  return {
    /**
     * Hapi's authenticate method. This is where the magic happens
     *
     * @param {*} request Request object created by the server
     * @param {*} h Standard hapi response toolkit
     */
    authenticate(request, h) {
      // Get token from header
      const token = getToken(request);

      // If token not found, return an 'unauthorized' response
      if (token === null) {
        throw Unauthorized("Token not provided");
      }

      // This variable will hold Firebase's instance
      let firebaseInstance;

      try {
        if (options.instance) {
          // Great! We can just use this instance ready to go
          firebaseInstance = options.instance;
        } else {
          // Initialize Firebase instance
          firebaseInstance = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });

          // Cache Firebase instance
          options.instance = firebaseInstance;
        }
      } catch (error) {
        // Firebase not initialized
        throw Unauthorized("Auth provider not initialized");
      }

      // Validate token
      return validateToken(token, firebaseInstance, h);
    },
  };
}

/**
 * Gets the token from the request header
 * This function looks for the property 'authorization' in the
 * header and gets whatever is appended after the word 'Bearer'
 *
 * @param {*} request Request object created by the server
 */
function getToken(request) {
  // Get authorization property from request header
  const requestAuthorization = request.headers.authorization;
  if (!requestAuthorization) return null;

  // Define a regular expression to match the case we want and test it
  const matchRegex = new RegExp(/(bearer)[ ]+(.*)/i);
  const resultMatch = requestAuthorization.match(matchRegex);

  // If no matches found, there is no token available
  if (!resultMatch) return null;

  // Match found! Return token
  return resultMatch[2] || null;
}

/**
 * Validate the provided token using Firebase Admin SDK
 *
 * @param {*} token Access token provided by Firebase Auth
 * @param {*} firebaseInstance Initialized Firebase App instance
 * @param {*} h Standard hapi response toolkit
 */
function validateToken(token, firebaseInstance, h) {
  // Verify token using Firebase's credentials
  return firebaseInstance
    .auth()
    .verifyIdToken(token)
    .then(function (credentials) {
      // Valid token!
      return h.authenticated({ credentials });
    })
    .catch(function (error) {
      console.log(error);
      let message;
      switch (error.code) {
        case "auth/id-token-expired":
          message = `Token is already expired.`;
          break;
        case "auth/id-token-revoked":
          message = `Token already being revoke.`;
          break;
        case "auth/invalid-credential":
          message = `Credetioal is invalid.`;
          break;
        default:
          message = error.code;
          break;
      }
      // Invalid token
      throw Unauthorized(message);
    });
}

function register(server) {
  server.auth.scheme("firebase", firebaseAuthScheme);

  // decorate the request with a "user" property
  // this passes responsibility to hapi that
  // no other plugin uses "request.user"
  server.decorate("request", "user", undefined);

  server.ext("onPostAuth", (request, h) => {
    // user successfully authenticated?
    if (request.auth.credentials) {
      // assign user object to request by using its credentials
      request.user = {
        email: request.auth.credentials.email || null,
        id: request.auth.credentials.uid || null,
        name: request.auth.credentials.name || null,
        user_id: request.auth.credentials.user_id || null,
        username: request.auth.credentials.email || null,
      };
    }

    // continue request lifecycle
    return h.continue;
  });
}

// Export plugin
exports.plugin = {
  name: Package.name,
  version: Package.version,
  Package,
  register,
};
