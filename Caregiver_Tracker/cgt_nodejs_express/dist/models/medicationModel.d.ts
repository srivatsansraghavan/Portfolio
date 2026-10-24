import { type DeleteResult, type RootFilterQuery } from "mongoose";
import type { IMedicationSchema } from "../dto/schema.dto.js";
export interface IMedicationResponse extends IMedicationSchema {
    _id: string;
}
export declare const saveTrackedMedModel: (query: IMedicationSchema) => Promise<IMedicationResponse>;
export declare const deleteMedicationModel: (finder: RootFilterQuery<{
    _id: string;
}>) => Promise<DeleteResult>;
export declare const getMedicationModel: (finder: RootFilterQuery<{
    _id: string;
}>) => Promise<IMedicationSchema[]>;
//# sourceMappingURL=medicationModel.d.ts.map