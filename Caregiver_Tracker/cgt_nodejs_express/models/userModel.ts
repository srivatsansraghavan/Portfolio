import mongoose, { model, Mongoose, type PassportLocalDocument, type PassportLocalModel, type PassportLocalSchema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"
import { cgtdbEnv, connectToMongoDB } from "../config.js";
import type { IUserSchema } from "../dto/schema.dto.js";
import "dotenv/config";

type UserSchema = IUserSchema & PassportLocalDocument;
type UserModel = PassportLocalModel<UserSchema>;
export async function getUserSchema(): Promise<PassportLocalSchema<UserSchema, UserModel>> {
  const nodeEnv = process.env.NODE_ENV as keyof typeof cgtdbEnv;
  if (!nodeEnv) {
    throw new Error('NODE_ENV not available.')
  }
  const userTable: Mongoose | undefined = await connectToMongoDB(cgtdbEnv[nodeEnv]);

  if (!userTable) {
    throw new Error('User table not returned');
  }
  const userSchema: PassportLocalSchema<UserSchema, UserModel> = new userTable.Schema({
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

export const userModel = mongoose.models['tbl_users'] as UserModel || model<UserSchema, UserModel>('tbl_users', await getUserSchema());