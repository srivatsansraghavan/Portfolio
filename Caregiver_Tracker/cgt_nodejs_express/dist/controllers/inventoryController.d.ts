import type { Request, Response, NextFunction } from "express";
export declare function addToInventory(req: Request<unknown, unknown, {
    careTakenOf: {
        name: string;
        id: string;
    };
    inventoryType: string;
    inventoryBrand: string;
    inventoryForm: string;
    inventoryCount: number;
    inventoryEachContains: number;
}>, res: Response, next: NextFunction): Promise<void>;
export declare function getInventories(req: Request<unknown, unknown, unknown, {
    careTakenId: string;
}>, res: Response, next: NextFunction): Promise<void>;
export declare function getAvailableInventory(req: Request<unknown, unknown, unknown, {
    careTakenId: string;
    inventoryType: string;
}>, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=inventoryController.d.ts.map