import mongoose, { model, type Mongoose, type PassportLocalDocument, type PassportLocalModel, type PassportLocalSchema, type RootFilterQuery } from "mongoose";
import { connectToMongoDB, cgtdbEnv } from "../config.js";
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

type FeedSchema = IFeedSchema & PassportLocalDocument;
type FeedModel = PassportLocalModel<FeedSchema>;
async function getFeedSchema() {
    const nodeEnv = process.env.NODE_ENV as keyof typeof cgtdbEnv;
    if (!nodeEnv) {
      throw new Error('NODE_ENV not available.')
    }
    const feedTable: Mongoose | undefined = await connectToMongoDB(cgtdbEnv[nodeEnv]);
  
    if (!feedTable) {
      throw new Error('Feed table not returned');
    }
  

  const feedSchema: PassportLocalSchema<FeedSchema, FeedModel> = new feedTable.Schema({
    feed_giver: {
      type: String,
      required: [true, "Care Giver Id is required"],
    },
    feed_taker_name: {
      type: String,
      required: [true, "Care Taken Name is required"],
    },
    feed_taker_id: {
      type: String,
      required: [true, "Care Taken of Id is required"],
    },
    feed_taken_type: {
      type: String,
      required: [true, "Feed Type is required"],
    },
    feed_taken_mode: {
      type: String,
      required: [true, "Feed mode is required"],
    },
    feed_taken_side: {
      type: String,
    },
    feed_taken_time: {
      type: Number,
      required: [true, "Feed taken time is required"],
    },
    feed_quantity: {
      type: Number,
    },
    feed_start_time: {
      type: Date,
    },
    feed_end_time: {
      type: Date,
    },
    is_pumped_feed: {
      type: Boolean,
    },
    is_feed_given: {
      type: Boolean,
      default: true,
    },
  });

  return feedSchema;
}

async function getFeedModel(): Promise<FeedModel> {
  return mongoose.models['tbl_feeding'] as FeedModel || model<FeedSchema, FeedModel>('tbl_feeding', await getFeedSchema());
}

export const saveTrackedFeedModel = async function (query: IFeedSchema): Promise<IFeedResponse> {
  const feedModel = await getFeedModel();
  const addedFeed = await new feedModel(query).save();
  return JSON.parse(JSON.stringify(addedFeed));
};

export const saveFeedForPumpedModel = async function (finder: RootFilterQuery<{ _id: string}>, updated: IFeedSchema) {
  const feedModel = await getFeedModel();
  const updatedFeed = await feedModel.findOneAndUpdate(
    finder,
    { $set: updated },
    {
      new: true,
    }
  );
  return JSON.parse(JSON.stringify(updatedFeed));
};

export const getFeedDetailsModel = async function (
  care_giver: string,
  care_taken_of_id: string,
  feed_count: number
) {
  const feedModel = await getFeedModel();
  const getFeedDetails = await feedModel
    .find(
      {
        $or: [
          {
            $and: [
              {
                feed_giver: care_giver,
                feed_taker_id: care_taken_of_id,
              },
            ],
          },
          {
            $and: [
              {
                pumped_by: care_giver,
                pumped_for_id: care_taken_of_id,
              },
            ],
          },
        ],
      },
      null,
      { limit: feed_count }
    )
    .sort({ _id: -1 })
    .exec();
  return getFeedDetails;
};

export const deleteTrackedFeedModel = async function (feedId: string) {
  const feedModel = await getFeedModel();
  const deleteFeed = await feedModel
    .deleteOne({
      _id: feedId,
    })
    .exec();
  return deleteFeed;
};

export const getFeedByIdModel = async function (feedId: string) {
  const feedModel = await getFeedModel();
  const getFeedById = await feedModel
    .findOne({
      _id: feedId,
    })
    .exec();
  return getFeedById;
};

export const saveEditedFeedModel = async function (finder: RootFilterQuery<{ _id: string; }>, updated: { feed_quantity: number;
      feed_start_time: string; feed_end_time: string; feed_taken_time: number; }): Promise<IFeedResponse> {
  const feedModel = await getFeedModel();
  const editedFeed = await feedModel.findOneAndUpdate(
    finder,
    { $set: updated },
    {
      new: true,
    }
  );
  return JSON.parse(JSON.stringify(editedFeed));
};
