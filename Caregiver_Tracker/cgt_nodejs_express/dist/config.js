import { connect, Mongoose, pluralize } from "mongoose";
import "dotenv/config";
export async function connectToMongoDB(dbName) {
    try {
        pluralize(null);
        return await connect(`${process.env.MONGO_URL}/${dbName}?authMechanism=DEFAULT&authSource=admin&directConnection=true`);
    }
    catch (err) {
        console.error(err);
    }
}
export async function connectToMongoDBGetTable(dbName, tableName) {
    const db = await connectToMongoDB(dbName);
    if (!db) {
        throw new Error("Mongoose DB not available.");
    }
    const collection = db.connection.collection(tableName);
    return collection;
}
export const cgtdbEnv = {
    test: "db_cgt_test",
    dev: "db_cgt_dev",
    local: "db_cgt_local",
    production: "db_cgt"
};
//# sourceMappingURL=config.js.map