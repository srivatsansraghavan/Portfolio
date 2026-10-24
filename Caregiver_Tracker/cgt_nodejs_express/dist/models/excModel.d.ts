import mongoose, { type RootFilterQuery } from "mongoose";
import type { IExcSchema } from "../dto/schema.dto.js";
export declare const saveTrackedExcModel: (query: any) => Promise<any>;
export declare const getExcDetailsModel: (finder: RootFilterQuery<IExcSchema>) => Promise<{
    id: unknown;
    excretionType: string;
    napkinType: string;
    diaperCount: number;
    diaperBrand: string;
    excretionTime: Date;
}[]>;
export declare const deleteExcretionModel: (finder: RootFilterQuery<IExcSchema>) => Promise<mongoose.mongo.DeleteResult>;
export declare const getExcretionModel: (finder: RootFilterQuery<IExcSchema>) => Promise<IExcSchema | null>;
//# sourceMappingURL=excModel.d.ts.map