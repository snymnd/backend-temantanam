const connectDb = require("../lib/dbConnection");
const { uuidv4 } = require("@firebase/util");

const getHistoryHandler = async (request, h) => {
    const userId = request.params.userId;
    let response;

    let query = `SELECT h.id AS history_id, h.created_at AS created_at, p.id AS plant_id, p.name AS plant_name, p.species AS plant_species, p.image_url AS plant_image_url
                FROM history h
                JOIN plant p ON h.plant_id = p.id`
    if (userId) {
        query += ` WHERE h.user_id = '${userId}'`;
    }

    const res = await connectDb(query);
    const history = res.rows;
    console.log(history);

    if (history !== undefined) {
        response = h.response({
            status: "success",
            message: "User history found",
            data: history,
        }).code(200);
    } else {
        response = h.response({
            status: "fail",
            message: "User history not found"
        }).code(404);
    }

    return response;
};

module.exports = { getHistoryHandler };