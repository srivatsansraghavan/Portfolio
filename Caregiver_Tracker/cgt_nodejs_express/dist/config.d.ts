import { Mongoose } from "mongoose";
import "dotenv/config";
export declare function connectToMongoDB(dbName: string): Promise<Mongoose | undefined>;
export declare function connectToMongoDBGetTable(dbName: string, tableName: string): Promise<import("mongoose").Collection<import("mongoose").AnyObject>>;
export declare const cgtdbEnv: {
    test: string;
    dev: string;
    local: string;
    production: string;
};
//# sourceMappingURL=config.d.ts.map