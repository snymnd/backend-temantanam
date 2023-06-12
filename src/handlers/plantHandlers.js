const connectDb = require("../lib/dbConnection");

const getPlantHandler = async (request, h) => {
    const plantName = request.params.plantName;
    let response;

    let query = `SELECT * FROM plant`;
    if (plantName) {
        query += ` WHERE NAME = '${plantName}'`;
    }

    const res = await connectDb(query);
    const plant = res.rows[0];
    console.log(plant);

    if (plant !== undefined) {
        response = h.response({
            status: "success",
            message: "Plant found",
            data: plant,
        }).code(200);
    } else {
        response = h.response({
            status: "fail",
            message: "Plant not found"
        }).code(404);
    }

    return response;
};

module.exports = { getPlantHandler };