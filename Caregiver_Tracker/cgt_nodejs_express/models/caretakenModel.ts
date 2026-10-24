import { model, type PassportLocalDocument, type PassportLocalModel, type PassportLocalSchema } from "mongoose";
import { connectToMongoDB, cgtdbEnv } from "../config.js";
import type { ICareTaken } from "../dto/schema.dto.js";


type CareTakenSchema = ICareTaken & PassportLocalDocument;
type CareTakenModel = PassportLocalModel<CareTakenSchema>;
async function getCareTakenSchema() {
  const nodeEnv = process.env.NODE_ENV as keyof typeof cgtdbEnv;
  if (!nodeEnv) {
    throw new Error('No Node Env');
  }
  const mongoDB = await connectToMongoDB(cgtdbEnv[nodeEnv]);
  if (!mongoDB) {
    throw new Error('No Care taken table');
  }
  const caretakenSchema: PassportLocalSchema<CareTakenSchema, CareTakenModel> = new mongoDB.Schema({
    care_giver: {
      type: String,
      required: [true, "Care Giver Email is required"],
    },
    care_taken_of: {
      type: String,
      required: [true, "Care Taken of is required"],
    },
    care_taken_name: {
      type: String,
      required: [true, "Care Taken name is required"],
    },
    care_taken_dob: {
      type: String,
      required: [true, "Care Taken Date of Birth is required"],
    },
    care_taken_gender: {
      type: String,
      required: [true, "Care Taken Gender is required"],
    },
    care_taken_added_time: { type: Date },
    care_last_accessed: {
      type: Boolean,
    },
  });

  caretakenSchema.index({ care_giver: 1, care_taken_of: 1 }, { unique: true })

  return caretakenSchema;
}

export const careTakenModel = model<CareTakenSchema, CareTakenModel>('tbl_caretaken', await getCareTakenSchema());

export const firstLoginModel = async function (userEmail: string) {
  const firstTimeLogin = await careTakenModel
    .countDocuments({
      care_giver: userEmail,
    })
    .exec();
  return firstTimeLogin;
};

export const addCareTakenModel = async function (careTaken: any) {
  try {
    const addedCareTaken = await new careTakenModel(careTaken).save();
    return JSON.parse(JSON.stringify(addedCareTaken));
  } catch (err) {
    throw err;
  }
};

export const getCareTakenDetailsModel = async function (userId: string) {
  const getCareTakenDetails = await careTakenModel
    .find({
      care_giver: userId,
    })
    .exec();
  return getCareTakenDetails;
};

export const changeCareTakenModel = async function (careTakenId: string, userId: string) {
  let changedCareTakenDetail = await careTakenModel
    .findOne({
      _id: careTakenId,
    })
    .exec();
  if (changedCareTakenDetail?.care_last_accessed) {
    return;
  }
  await careTakenModel.updateMany(
    { care_giver: userId },
    { $set: { care_last_accessed: false } }
  );
  await careTakenModel.updateOne(
    { _id: careTakenId },
    { $set: { care_last_accessed: true } }
  );
  changedCareTakenDetail = await careTakenModel
    .findOne({
      _id: careTakenId,
    })
    .exec();
  return changedCareTakenDetail;
};
