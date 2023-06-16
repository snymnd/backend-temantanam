const connectDb = require("../lib/dbConnection");
const { uuidv4 } = require("@firebase/util");

const getPlantByClassificationHandler = async (request, h) => {
    const classification = request.params.classification;
    const userId = request.params.userId;
    let response;

    let query = `SELECT * FROM plant`;
    if (classification) {
        query += ` WHERE CLASSIFICATION = '${classification}'`;
    }

    const res = await connectDb(query);
    const plant = res.rows[0];
    console.log(plant);
    console.log("userId", userId);

    if (plant !== undefined) {
        response = h.response({
            status: "success",
            message: "Plant found",
            data: plant,
        }).code(200);
        const historyId = uuidv4();
        query = `INSERT INTO history VALUES('${historyId}','${userId}','${plant.id}', NOW(), NOW(), NULL);`
        const add = await connectDb(query);
        if (add && add.rowCount > 0) {
            console.log("Success add to history");
        } else {
            console.log("Failed to add history");
        }
    } else {
        response = h.response({
            status: "fail",
            message: "Plant not found"
        }).code(404);
    }

    return response;
};

const getPlantByNameHandler = async (request, h) => {
    const name = request.params.plantName;
    let response;
  
    let query = `SELECT * FROM plant`;
    if (name) {
      query += ` WHERE name = '${name}'`;
    }
  
    const res = await connectDb(query);
    const plant = res.rows[0];
    console.log(plant);
  
    if (plant !== undefined) {
      response = h
        .response({
          status: "success",
          message: "Plant found",
          data: plant,
        })
        .code(200);
    } else {
      response = h
        .response({
          status: "fail",
          message: "Plant not found",
        })
        .code(404);
    }
  
    return response;
  };

module.exports = { getPlantByClassificationHandler, getPlantByNameHandler };