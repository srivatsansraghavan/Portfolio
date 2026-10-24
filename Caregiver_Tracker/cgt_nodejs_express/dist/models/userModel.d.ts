import { type PassportLocalDocument, type PassportLocalModel, type PassportLocalSchema } from "mongoose";
import type { IUserSchema } from "../dto/schema.dto.js";
import "dotenv/config";
type UserSchema = IUserSchema & PassportLocalDocument;
type UserModel = PassportLocalModel<UserSchema>;
export declare function getUserSchema(): Promise<PassportLocalSchema<UserSchema, UserModel>>;
export declare const userModel: UserModel;
export {};
//# sourceMappingURL=userModel.d.ts.map