import mongoose, { type PassportLocalDocument, type RootFilterQuery } from "mongoose";
import type { IFeedSchema, IPumpedSchema } from "../dto/schema.dto.js";
export interface IFeedResponse {
    _id: string;
    feedGiver: string;
    feedTakerName: string;
    feedTakerId: string;
    feedTakenType: string;
    feedTakenMode: string;
    feedTakenSide: string;
    feedTakenTime: number;
    feedQuantity: number;
    feedStartTime: string;
    feedEndTime: string;
    isPumpedFeed: boolean;
    isFeedGiven: boolean;
}
export interface IPumpedResponse {
    _id: string;
    feedGiver: string;
    feedTakerName: string;
    feedTakerId: string;
    feedTakenType: string;
    feedTakenMode: string;
    feedTakenSide: string;
    feedTakenTime: number;
    feedQuantity: number;
    feedStartTime: string;
    feedEndTime: string;
    isPumpedFeed: boolean;
    isFeedGiven: boolean;
}
type FeedSchema = IFeedSchema & PassportLocalDocument;
export declare const saveTrackedFeedModel: (query: IFeedSchema) => Promise<IFeedResponse>;
export declare const savePumpedModel: (query: IPumpedSchema) => Promise<IPumpedResponse>;
export declare const saveFeedForPumpedModel: (finder: RootFilterQuery<{
    _id: string;
}>, updated: IFeedSchema) => Promise<any>;
export declare const getFeedDetailsModel: (care_giver: string, care_taken_of_id: string, feed_count: number) => Promise<(mongoose.Document<unknown, {}, FeedSchema, {}> & IFeedSchema & mongoose.PassportLocalDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
})[]>;
export declare const getPumpedDetailsModel: (care_giver_email: string, care_taken_of_id: string) => Promise<{
    id: unknown;
    pumpedBy: string;
    pumpedForName: string;
    pumpedForId: string;
    pumpedMode: string;
    pumpedSide: string;
    pumpedTime: number;
    pumpedQuantity: number;
    pumpStartTime: string;
    pumpEndTime: string;
}[]>;
export declare const deleteTrackedFeedModel: (feedId: string) => Promise<mongoose.mongo.DeleteResult>;
export declare const getFeedByIdModel: (feedId: string) => Promise<(mongoose.Document<unknown, {}, FeedSchema, {}> & IFeedSchema & mongoose.PassportLocalDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | null>;
export declare const saveEditedFeedModel: (finder: RootFilterQuery<{
    _id: string;
}>, updated: {
    feed_quantity: number;
    feed_start_time: string;
    feed_end_time: string;
    feed_taken_time: number;
}) => Promise<IFeedResponse>;
export {};
//# sourceMappingURL=feedModel.d.ts.map