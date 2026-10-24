import type { NextFunction, Request, Response } from "express";
import type { IFeedBody, IUpdateFeedBody } from "../dto/requests.dto.js";
export declare function saveTrackingFeed(req: Request<unknown, unknown, IFeedBody, unknown>, res: Response, next: NextFunction): Promise<void>;
export declare function savePumpingFeed(req: Request<unknown, unknown, IFeedBody>, res: Response, next: NextFunction): Promise<void>;
export declare function getFeedDetails(req: Request<unknown, unknown, unknown, {
    feed_taker?: string;
    feed_count?: number;
}>, res: Response, next: NextFunction): Promise<void>;
export declare function getPumpedFeed(req: Request<unknown, unknown, unknown, {
    feed_giver: string;
    feed_taker: string;
}>, res: Response, next: NextFunction): Promise<void>;
export declare function deleteTrackedFeed(req: Request<{
    feedId: string;
}>, res: Response, next: NextFunction): Promise<void>;
export declare function getFeedForId(req: Request<{
    feedId: string;
}>, res: Response, next: NextFunction): Promise<void>;
export declare function saveEditedFeed(req: Request<unknown, unknown, IUpdateFeedBody>, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=feedController.d.ts.map