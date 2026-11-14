import moment from "moment";
import {
  saveTrackedFeedModel,
  saveFeedForPumpedModel,
  getFeedDetailsModel,
  deleteTrackedFeedModel,
  getFeedByIdModel,
  saveEditedFeedModel,
} from "../models/feedModel.js";
import type { NextFunction, Request, Response } from "express";
import type { IUserSchema } from "../dto/schema.dto.js";
import type { IFeedBody, IUpdateFeedBody } from "../dto/requests.dto.js";

export async function saveTrackingFeed(req: Request<unknown, unknown, IFeedBody, unknown>, res: Response, next: NextFunction) {
  try {
    let addTrackedFeed;
    const user = req.user as IUserSchema;
    const feedEndTime = moment().format("MM/DD/YYYY HH:mm:ss");
    const feedStartTime = moment(feedEndTime, "MM/DD/YYYY HH:mm:ss")
      .subtract(req.body.feedTime, "seconds")
      .format("MM/DD/YYYY HH:mm:ss");
    const insertQuery = {
      feed_giver: user.user_email,
      feed_taker_name: req.body.feedTaker.name,
      feed_taker_id: req.body.feedTaker.id,
      feed_taken_type: req.body.feedType,
      feed_taken_mode: req.body.feedMode,
      feed_taken_side: req.body.feedSide,
      feed_taken_time: req.body.feedTime,
      feed_quantity: req.body.feedQuantity,
      feed_start_time: feedStartTime,
      feed_end_time: feedEndTime,
      is_pumped_feed: false,
      is_feed_given: true,
    };
    if (
      req.body.feedType === "Breast Milk" &&
      req.body.feedMode === "Pumped Milk"
    ) {
      insertQuery.is_pumped_feed = true;
      addTrackedFeed = await saveFeedForPumpedModel(
        { _id: req.body.pumpedFeedId },
        insertQuery
      );
    } else {
      addTrackedFeed = await saveTrackedFeedModel(insertQuery);
    }
    if (addTrackedFeed._id) {
      res.status(200).json({
        message: `Feed of type ${req.body.feedType} given to ${req.body.feedTaker.name} added!`,
      });
    } else {
      res
        .status(404)
        .json({ message: "Unable to add tracked feed. Please try later!" });
    }
  } catch (err) {
    return next(err);
  }
}

export async function getFeedDetails(req: Request<unknown, unknown, unknown, { feed_taker?: string; feed_count?: number; }>, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUserSchema;
    if(!req.query.feed_count && !req.query.feed_taker){
      res.status(402);
    }
    const getFeedDetails = await getFeedDetailsModel(
      user.user_email,
      req.query.feed_taker!,
      req.query.feed_count!
    );
    res.status(200).json(getFeedDetails);
  } catch (err) {
    return next(err);
  }
}

export async function deleteTrackedFeed(req: Request<{ feedId: string;}>, res: Response, next: NextFunction) {
  try {
    const deleteFeed = await deleteTrackedFeedModel(req.params.feedId);
    if (deleteFeed.acknowledged && deleteFeed.deletedCount === 1) {
      res.status(200).json({ message: "Feed deleted successfully" });
    } else {
      res
        .status(404)
        .json({ message: "Unable to delete feed. Please try again later!" });
    }
  } catch (err) {
    return next(err);
  }
}

export async function getFeedForId(req: Request<{ feedId: string;}>, res: Response, next: NextFunction) {
  try {
    const getFeedForId = await getFeedByIdModel(req.params.feedId);
    if (getFeedForId && Object.keys(getFeedForId).length > 0) {
      res.status(200).json(getFeedForId);
    } else {
      res
        .status(404)
        .json({ message: "Unable to get feed. Please try again later!" });
    }
  } catch (err) {
    return next(err);
  }
}

export async function saveEditedFeed(req: Request<unknown, unknown, IUpdateFeedBody>, res: Response, next: NextFunction) {
  try {
    const feedTimeTaken = moment(req.body.feedEnd).diff(
      moment(req.body.feedStart),
      "seconds"
    );
    const updateQuery = {
      feed_quantity: req.body.feedQuantity,
      feed_start_time: req.body.feedStart,
      feed_end_time: req.body.feedEnd,
      feed_taken_time: feedTimeTaken,
    };
    const saveEditedFeed = await saveEditedFeedModel(
      { _id: req.body.feedId },
      updateQuery
    );
    if (saveEditedFeed._id) {
      res.status(200).json({ message: `Feed edited!` });
    } else {
      res
        .status(404)
        .json({ message: "Unable to edit feed. Please try later!" });
    }
  } catch (err) {
    return next(err);
  }
}
