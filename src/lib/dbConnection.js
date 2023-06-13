const { Client } = require("pg");
require("dotenv").config();

const connectDb = async (query) => {
  try {
    const client = new Client({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    });

    await client.connect();
    const res = await client.query(query);
    await client.end();
    return res;
  } catch (error) {
    console.log(error, "err");
    throw error;
  }
};

module.exports = connectDb;

/* How to use
  //1
  const func = async () => {
    const res = await connectDb("SELECT * FROM users WHERE id = 1");
    console.log(res.rows[0]);
  };
  func();
  
  //2
  connectDb("SELECT * FROM users WHERE id = 1").then((res) => {
    console.log(res.rows[0]);
  }) 
*/
