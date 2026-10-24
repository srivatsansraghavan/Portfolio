import mongoose, { model, type DeleteResult, type Mongoose, type PassportLocalDocument, type PassportLocalModel, type PassportLocalSchema, type RootFilterQuery } from "mongoose";
import { connectToMongoDB, cgtdbEnv } from "../config.js";
import type { IMedicationSchema } from "../dto/schema.dto.js";


export interface IMedicationResponse extends IMedicationSchema {
  _id: string;
}
type MedicationSchema = IMedicationSchema & PassportLocalDocument;
type MedicationModel = PassportLocalModel<MedicationSchema>;
async function getMedSchema(): Promise<PassportLocalSchema<MedicationSchema, MedicationModel>> {
   const nodeEnv = process.env.NODE_ENV as keyof typeof cgtdbEnv;
    if (!nodeEnv) {
      throw new Error('NODE_ENV not available.')
    }
    const medTable: Mongoose | undefined = await connectToMongoDB(cgtdbEnv[nodeEnv]);
  
    if (!medTable) {
      throw new Error('Medication table not returned');
    }

  const medSchema: PassportLocalSchema<MedicationSchema, MedicationModel> = new medTable.Schema({
    care_giver: {
      type: String,
      required: [true, "Care Giver Id is required"],
    },
    care_taken_of_name: {
      type: String,
      required: [true, "Care Taken Name is required"],
    },
    care_taken_of_id: {
      type: String,
      required: [true, "Care Taken of Id is required"],
    },
    medicine_name: {
      type: String,
      required: [true, "Medicine Name is required"],
    },
    medicine_form: {
      type: String,
      required: [true, "Medicine Form is required"],
    },
    medicine_quantity: {
      type: String,
      required: [true, "Medicine Quantity is required"],
    },
    medicine_id: {
      type: String,
    },
    medication_time: {
      type: Date,
    },
  });

  return medSchema;
}

async function getMedModel(): Promise<MedicationModel> {
  return mongoose.models['tbl_medication'] as MedicationModel || model<MedicationSchema, MedicationModel>('tbl_medication', await getMedSchema());
}

export const saveTrackedMedModel = async function (query: IMedicationSchema): Promise<IMedicationResponse> {
  const medModel = await getMedModel();
  const addedMed = await new medModel(query).save();
  return JSON.parse(JSON.stringify(addedMed));
};

export const deleteMedicationModel = async function (finder: RootFilterQuery<{ _id: string}>): Promise<DeleteResult> {
  const medModel = await getMedModel();
  const deleteMed = await medModel.deleteOne(finder).exec();
  return deleteMed;
};

export const getMedicationModel = async function (finder: RootFilterQuery<{ _id: string }>): Promise<IMedicationSchema[]> {
  const medModel = await getMedModel();
  const getMedForId = await medModel.find(finder, null).exec();
  return getMedForId;
};
