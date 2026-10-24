import { type RootFilterQuery } from "mongoose";
import type { IInventorySchema } from "../dto/schema.dto.js";
export interface IInventoryResponse {
    id: string;
    careGiver: string;
    careTakenOfName: string;
    careTakenOfId: string;
    inventoryType: string;
    inventoryBrand: string;
    inventoryForm: string;
    inventoryTotal: number;
    inventoryUsed: number;
    addedTime: string;
}
export declare const saveTrackedInvModel: (query: IInventorySchema) => Promise<IInventoryResponse>;
export declare const updateInventoryModel: (finder: RootFilterQuery<{
    _id: string;
}>, updated: RootFilterQuery<{
    inventory_used: number;
}>) => Promise<IInventoryResponse>;
export declare const getInventoriesModel: (finder: RootFilterQuery<{
    _id: string;
}>) => Promise<IInventoryResponse[]>;
export declare const getAvailableInventoryModel: (finder: RootFilterQuery<{
    _id: string;
}>) => Promise<IInventoryResponse[]>;
//# sourceMappingURL=inventoryModel.d.ts.map