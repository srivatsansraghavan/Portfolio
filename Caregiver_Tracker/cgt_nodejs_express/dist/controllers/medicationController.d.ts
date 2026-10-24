import type { Request, Response, NextFunction } from "express";
import type { IMedicationBody } from "../dto/requests.dto.js";
export declare function saveTrackedMedications(req: Request<unknown, unknown, IMedicationBody>, res: Response, next: NextFunction): Promise<void>;
export declare function getMedicationDetails(req: Request<unknown, unknown, unknown, {
    careTakenId: string;
}, Record<string, unknown>>, res: Response, next: NextFunction): Promise<void>;
export declare function deleteMedication(req: Request<{
    medId: string;
}>, res: Response, next: NextFunction): Promise<void>;
export declare function getMedForId(req: Request<{
    medId: string;
}>, res: Response, next: NextFunction): Promise<void>;
export declare function getMedForm(req: Request<{
    medId: string;
}>, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=medicationController.d.ts.map