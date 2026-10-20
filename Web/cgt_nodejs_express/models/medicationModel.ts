import { model, type DeleteResult, type Mongoose, type PassportLocalDocument, type PassportLocalModel, type PassportLocalSchema, type RootFilterQuery } from "mongoose";
import { connectToMongoDB, cgtdbEnv } from "../config.js";

export interface IMedication {
  care_giver: string;
  care_taken_of_name: string;
  care_taken_of_id: string;
  medicine_name: string;
  medicine_form: string;
  medicine_quantity: string;
  medicine_id: string;
  medication_time: string;
}
export interface IMedicationResponse extends IMedication {
  _id: string;
}
type MedicationSchema = IMedication & PassportLocalDocument;
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

export const saveTrackedMedModel = async function (query: IMedication): Promise<IMedicationResponse> {
  const medModel = model<MedicationSchema, MedicationModel>('tbl_medication', await getMedSchema());
  const addedMed = await new medModel(query).save();
  return JSON.parse(JSON.stringify(addedMed));
};

export const deleteMedicationModel = async function (finder: RootFilterQuery<{ _id: string}>): Promise<DeleteResult> {
  const medModel = model<MedicationSchema, MedicationModel>('tbl_medication', await getMedSchema());
  const deleteMed = await medModel.deleteOne(finder).exec();
  return deleteMed;
};

export const getMedicationModel = async function (finder: RootFilterQuery<{ _id: string }>): Promise<IMedication[]> {
  const medModel = model<MedicationSchema, MedicationModel>('tbl_medication', await getMedSchema());
  const getMedForId = await medModel.find(finder, null).exec();
  return getMedForId;
};
