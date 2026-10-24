import mongoose, { model } from "mongoose";
import { connectToMongoDB, cgtdbEnv } from "../config.js";
async function getFeedSchema() {
    const nodeEnv = process.env.NODE_ENV;
    if (!nodeEnv) {
        throw new Error('NODE_ENV not available.');
    }
    const feedTable = await connectToMongoDB(cgtdbEnv[nodeEnv]);
    if (!feedTable) {
        throw new Error('Feed table not returned');
    }
    const feedSchema = new feedTable.Schema({
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
            required: [true, "Feed quantity is required"],
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
async function getPumpedSchema() {
    const nodeEnv = process.env.NODE_ENV;
    if (!nodeEnv) {
        throw new Error('NODE_ENV not available.');
    }
    const pumpedTable = await connectToMongoDB(cgtdbEnv[nodeEnv]);
    if (!pumpedTable) {
        throw new Error('Feed table not returned');
    }
    const pumpedSchema = new pumpedTable.Schema({
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
async function getFeedModel() {
    return mongoose.models['tbl_feeding'] || model('tbl_feeding', await getFeedSchema());
}
async function getPumpedModel() {
    return mongoose.models['tbl_feeding'] || model('tbl_feeding', await getPumpedSchema());
}
export const saveTrackedFeedModel = async function (query) {
    const feedModel = await getFeedModel();
    const addedFeed = await new feedModel(query).save();
    return JSON.parse(JSON.stringify(addedFeed));
};
export const savePumpedModel = async function (query) {
    const pumpedModel = await getPumpedModel();
    const pumpedFeed = await new pumpedModel(query).save();
    return JSON.parse(JSON.stringify(pumpedFeed));
};
export const saveFeedForPumpedModel = async function (finder, updated) {
    const feedModel = await getFeedModel();
    const updatedFeed = await feedModel.findOneAndUpdate(finder, { $set: updated }, {
        new: true,
    });
    return JSON.parse(JSON.stringify(updatedFeed));
};
export const getFeedDetailsModel = async function (care_giver, care_taken_of_id, feed_count) {
    const feedModel = await getFeedModel();
    const getFeedDetails = await feedModel
        .find({
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
    }, null, { limit: feed_count })
        .sort({ _id: -1 })
        .exec();
    return getFeedDetails;
};
export const getPumpedDetailsModel = async function (care_giver_email, care_taken_of_id) {
    const pumpedModel = await getPumpedModel();
    const getPumpedDetails = await pumpedModel
        .find({
        pumped_by: care_giver_email,
        pumped_for_id: care_taken_of_id,
        is_pumped_feed: true,
        is_feed_given: false,
    }, null)
        .sort({ _id: -1 })
        .exec();
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
export const deleteTrackedFeedModel = async function (feedId) {
    const feedModel = await getFeedModel();
    const deleteFeed = await feedModel
        .deleteOne({
        _id: feedId,
    })
        .exec();
    return deleteFeed;
};
export const getFeedByIdModel = async function (feedId) {
    const feedModel = await getFeedModel();
    const getFeedById = await feedModel
        .findOne({
        _id: feedId,
    })
        .exec();
    return getFeedById;
};
export const saveEditedFeedModel = async function (finder, updated) {
    const feedModel = await getFeedModel();
    const editedFeed = await feedModel.findOneAndUpdate(finder, { $set: updated }, {
        new: true,
    });
    return JSON.parse(JSON.stringify(editedFeed));
};
//# sourceMappingURL=feedModel.js.map