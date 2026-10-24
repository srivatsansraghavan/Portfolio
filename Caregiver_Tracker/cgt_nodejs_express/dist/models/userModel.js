import mongoose, { model, Mongoose } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { cgtdbEnv, connectToMongoDB } from "../config.js";
import "dotenv/config";
export async function getUserSchema() {
    const nodeEnv = process.env.NODE_ENV;
    if (!nodeEnv) {
        throw new Error('NODE_ENV not available.');
    }
    const userTable = await connectToMongoDB(cgtdbEnv[nodeEnv]);
    if (!userTable) {
        throw new Error('User table not returned');
    }
    const userSchema = new userTable.Schema({
        user_email: {
            type: String,
            required: [true, "Email id is required"],
            lowercase: true,
            unique: true,
        },
        user_fullname: { type: String, required: [true, "Full name is required"] },
        user_signup_time: { type: String },
        username: { type: String },
    });
    userSchema.plugin(passportLocalMongoose);
    return userSchema;
}
export const userModel = mongoose.models['tbl_users'] || model('tbl_users', await getUserSchema());
//# sourceMappingURL=userModel.js.map