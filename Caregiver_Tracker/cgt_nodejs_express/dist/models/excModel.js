import mongoose, { model } from "mongoose";
import { connectToMongoDB, cgtdbEnv } from "../config.js";
async function getExcSchema() {
    const nodeEnv = process.env.NODE_ENV;
    if (!nodeEnv) {
        throw new Error('No Node Env');
    }
    const mongoDB = await connectToMongoDB(cgtdbEnv[nodeEnv]);
    if (!mongoDB) {
        throw new Error('No Care taken table');
    }
    const excSchema = new mongoDB.Schema({
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
        excretion_type: {
            type: String,
            required: [true, "Excretion Type is required"],
        },
        napkin_type: {
            type: String,
            required: [true, "Napkin Type is required"],
        },
        diaper_count: {
            type: Number,
        },
        diaper_brand: {
            type: String,
        },
        excretion_time: {
            type: Date,
        },
    });
    return excSchema;
}
async function getExcModel() {
    return mongoose.models['tbl_excretion'] || model('tbl_excretion', await getExcSchema());
}
export const saveTrackedExcModel = async function (query) {
    const excModel = await getExcModel();
    const addedExc = await new excModel(query).save();
    return JSON.parse(JSON.stringify(addedExc));
};
export const getExcDetailsModel = async function (finder) {
    const excModel = await getExcModel();
    const getExcDetails = await excModel
        .find(finder, null)
        .sort({ _id: -1 })
        .exec();
    return getExcDetails.map((exc) => ({
        id: exc._id,
        excretionType: exc.excretion_type,
        napkinType: exc.napkin_type,
        diaperCount: exc.diaper_count,
        diaperBrand: exc.diaper_brand,
        excretionTime: exc.excretion_time,
    }));
};
export const deleteExcretionModel = async function (finder) {
    const excModel = await getExcModel();
    const deleteExc = await excModel.deleteOne(finder);
    return deleteExc;
};
export const getExcretionModel = async function (finder) {
    const excModel = await getExcModel();
    const getExcForId = await excModel.findOne(finder, null).exec();
    return getExcForId;
};
//# sourceMappingURL=excModel.js.map