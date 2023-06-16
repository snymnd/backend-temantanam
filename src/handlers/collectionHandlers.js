const connectDb = require("../lib/dbConnection");
const { uuidv4 } = require("@firebase/util");

const getCollectionHandler = async (request, h) => {
    const userId = request.params.userId;
    let response;

    let query = `SELECT uc.id AS collection_id, p.id AS plant_id, p.name AS plant_name, p.species AS plant_species, p.image_url AS plant_image_url, p.classification AS plant_classification
                FROM user_plant_collection uc
                JOIN plant p ON uc.plant_id = p.id`
    if (userId) {
        query += ` WHERE uc.user_id = '${userId}'`;
    }

    const res = await connectDb(query);
    const collection = res.rows;
    console.log(collection);

    if (collection !== undefined) {
        response = h.response({
            status: "success",
            message: "User collection found",
            data: collection,
        }).code(200);
    } else {
        response = h.response({
            status: "fail",
            message: "User collection not found"
        }).code(404);
    }

    return response;
};


const addCollectionHandler = async (request, h) => {
    const userId  = request.params.userId;
    const { plantId } = request.payload;
    let response;

    const collectionId = uuidv4();
    console.log("plantId", plantId);

    const query = `INSERT INTO user_plant_collection VALUES('${collectionId}','${userId}','${plantId}', NOW(), NOW(), NULL);`;
    const res = await connectDb(query);

    if (res && res.rowCount > 0) {
        const getUserCollection = await connectDb(`SELECT uc.id AS collection_id, p.id AS plant_id, p.name AS plant_name, p.species AS plant_species, p.image_url AS plant_image_url, p.classification AS plant_classification
                                                    FROM user_plant_collection uc
                                                    JOIN plant p ON uc.plant_id = p.id
                                                    WHERE uc.user_id = '${userId}'`);
        const userCollection = getUserCollection.rows;
        response = h.response({
            status: "success",
            message: "Successfully add plant to collection",
            data: userCollection,
        }).code(200);
    } else {
        response = h.response({
            status: "fail",
            message: "Failed to add plant to collection",
        }).code(400);
    }

    return response;
};

const deleteCollectionHandler = async (request, h) => {
    const id  = request.params.collectionId;
    let response;

    const query = `DELETE FROM USER_PLANT_COLLECTION WHERE id = '${id}';`;
    const res = await connectDb(query);

    if (res && res.rowCount > 0) {
        response = h.response({
            status: "success",
            message: "Successfully delete plant from collection",
        }).code(200);
    } else {
        response = h.response({
            status: "fail",
            message: "Failed to delete plant from collection",
        }).code(400);
    }

    return response;
};

module.exports = { getCollectionHandler, addCollectionHandler, deleteCollectionHandler };