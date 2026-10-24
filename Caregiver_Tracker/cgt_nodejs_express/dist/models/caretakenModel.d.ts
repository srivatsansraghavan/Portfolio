import { type PassportLocalDocument, type PassportLocalModel } from "mongoose";
import type { ICareTaken } from "../dto/schema.dto.js";
type CareTakenSchema = ICareTaken & PassportLocalDocument;
type CareTakenModel = PassportLocalModel<CareTakenSchema>;
export declare const careTakenModel: CareTakenModel;
export declare const firstLoginModel: (userEmail: string) => Promise<number>;
export declare const addCareTakenModel: (careTaken: any) => Promise<any>;
export declare const getCareTakenDetailsModel: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, CareTakenSchema, {}> & ICareTaken & PassportLocalDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
})[]>;
export declare const changeCareTakenModel: (careTakenId: string, userId: string) => Promise<(import("mongoose").Document<unknown, {}, CareTakenSchema, {}> & ICareTaken & PassportLocalDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | null | undefined>;
export {};
//# sourceMappingURL=caretakenModel.d.ts.map