const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const saltRounds = 10;
  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      return hash;
    })
    .catch((err) => console.error(err.message));
};

const comparePassword = async (password, hash) => {
  bcrypt
    .compare(password, hash)
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err.message));
};

module.exports = { hashPassword, comparePassword };
