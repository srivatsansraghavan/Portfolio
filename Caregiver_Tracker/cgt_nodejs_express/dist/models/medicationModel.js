import mongoose, { model } from "mongoose";
import { connectToMongoDB, cgtdbEnv } from "../config.js";
async function getMedSchema() {
    const nodeEnv = process.env.NODE_ENV;
    if (!nodeEnv) {
        throw new Error('NODE_ENV not available.');
    }
    const medTable = await connectToMongoDB(cgtdbEnv[nodeEnv]);
    if (!medTable) {
        throw new Error('Medication table not returned');
    }
    const medSchema = new medTable.Schema({
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
async function getMedModel() {
    return mongoose.models['tbl_medication'] || model('tbl_medication', await getMedSchema());
}
export const saveTrackedMedModel = async function (query) {
    const medModel = await getMedModel();
    const addedMed = await new medModel(query).save();
    return JSON.parse(JSON.stringify(addedMed));
};
export const deleteMedicationModel = async function (finder) {
    const medModel = await getMedModel();
    const deleteMed = await medModel.deleteOne(finder).exec();
    return deleteMed;
};
export const getMedicationModel = async function (finder) {
    const medModel = await getMedModel();
    const getMedForId = await medModel.find(finder, null).exec();
    return getMedForId;
};
//# sourceMappingURL=medicationModel.js.map