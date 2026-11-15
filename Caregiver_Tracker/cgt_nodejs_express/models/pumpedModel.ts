import mongoose, { model, type Mongoose, type PassportLocalDocument, type PassportLocalModel, type PassportLocalSchema, type RootFilterQuery } from "mongoose";
import { connectToMongoDB, cgtdbEnv } from "../config.js";
import type { IPumpedSchema } from "../dto/schema.dto.js";

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

type PumpedSchema = IPumpedSchema & PassportLocalDocument;
type PumpedModel = PassportLocalModel<PumpedSchema>;
async function getPumpedSchema() {
  const nodeEnv = process.env.NODE_ENV as keyof typeof cgtdbEnv;
  if (!nodeEnv) {
    throw new Error('NODE_ENV not available.')
  }
  const pumpedTable: Mongoose | undefined = await connectToMongoDB(cgtdbEnv[nodeEnv]);

  if (!pumpedTable) {
    throw new Error('Feed table not returned');
  }
  
  const pumpedSchema: PassportLocalSchema<PumpedSchema, PumpedModel> = new pumpedTable.Schema({
    pumped_by: {
      type: String,
      required: [true, "Care Giver Email is required"],
    },
    pumped_for_name: {
      type: String,
      required: [true, "Care Taken Name is required"],
    },
    pumped_for_id: {
      type: String,
      required: [true, "Care Taken of Id is required"],
    },
    pumped_mode: {
      type: String,
      required: [true, "Pumped mode is required"],
    },
    pumped_side: {
      type: String,
      required: [true, "Pumped side is required"],
    },
    pumped_time: {
      type: Number,
      required: [true, "Pumped taken time is required"],
    },
    pumped_quantity: {
      type: Number,
      required: [true, "Pumped quantity is required"],
    },
    pump_start_time: {
      type: Date,
    },
    pump_end_time: {
      type: Date,
    },
  });

  return pumpedSchema;
}

async function getPumpedModel(): Promise<PumpedModel> {
  return mongoose.models['tbl_pumping'] as PumpedModel || model<PumpedSchema, PumpedModel>('tbl_pumping', await getPumpedSchema());
}

export const savePumpedModel = async function (query: IPumpedSchema): Promise<IPumpedResponse> {
  const pumpedModel = await getPumpedModel();
  const pumpedFeed = await new pumpedModel(query).save();
  return JSON.parse(JSON.stringify(pumpedFeed));
};

export const getPumpedDetailsModel = async function (
  care_giver_email: string,
  care_taken_of_id: string
) {
  const pumpedModel = await getPumpedModel();
  console.log(care_giver_email, care_taken_of_id)
  const getPumpedDetails = await pumpedModel
    .find(
      {
        pumped_by: care_giver_email,
        pumped_for_id: care_taken_of_id,
      },
      null
    )
    .sort({ _id: -1 })
    .exec();
    console.log(getPumpedDetails);
  return getPumpedDetails.map((getPumpedDetail) => ({
      id: getPumpedDetail._id,
      pumpedBy: getPumpedDetail.pumped_by,
      pumpedForName: getPumpedDetail.pumped_for_name,
      pumpedForId: getPumpedDetail.pumped_for_id,
      pumpedMode: getPumpedDetail.pumped_mode,
      pumpedSide: getPumpedDetail.pumped_side,
      pumpedTime: getPumpedDetail.pumped_time,
      pumpedQuantity: getPumpedDetail.pumped_quantity,
      pumpStartTime: getPumpedDetail.pump_start_time,
      pumpEndTime: getPumpedDetail.pump_end_time,
    }));
};

export const deletePumpedModel = async function (feedId: string) {
  const pumpedModel = await getPumpedModel();
  const deleteFeed = await pumpedModel
    .deleteOne({
      _id: feedId,
    })
    .exec();
  return deleteFeed;
};

export const getPumpedByIdModel = async function (feedId: string) {
  const pumpedModel = await getPumpedModel();
  const getFeedById = await pumpedModel
    .findOne({
      _id: feedId,
    })
    .exec();
  return getFeedById;
};

export const saveEditedPumpedModel = async function (finder: RootFilterQuery<{ _id: string; }>, updated: { feed_quantity: number;
      feed_start_time: string; feed_end_time: string; feed_taken_time: number; }): Promise<IPumpedResponse> {
  const feedModel = await getPumpedModel();
  const editedFeed = await feedModel.findOneAndUpdate(
    finder,
    { $set: updated },
    {
      new: true,
    }
  );
  return JSON.parse(JSON.stringify(editedFeed));
};
