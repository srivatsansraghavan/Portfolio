import moment from "moment";
import {
  deleteTrackedFeedModel,
  getFeedByIdModel,
  saveEditedFeedModel,
} from "../models/feedModel.js";
import type { NextFunction, Request, Response } from "express";
import type { IUserSchema } from "../dto/schema.dto.js";
import type { IFeedBody, IUpdateFeedBody } from "../dto/requests.dto.js";
import { getPumpedDetailsModel, savePumpedModel } from "../models/pumpedModel.js";

export async function savePumping(req: Request<unknown, unknown, IFeedBody>, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUserSchema;
    const feedEndTime = moment().format("MM/DD/YYYY HH:mm:ss");
    const feedStartTime = moment(feedEndTime, "MM/DD/YYYY HH:mm:ss")
      .subtract(req.body.feedTime, "seconds")
      .format("MM/DD/YYYY HH:mm:ss");
    const insertQuery = {
      pumped_by: user.user_email,
      pumped_for_name: req.body.feedTaker.name,
      pumped_for_id: req.body.feedTaker.id,
      pumped_mode: req.body.feedMode,
      pumped_side: req.body.feedSide,
      pumped_time: req.body.feedTime,
      pumped_quantity: req.body.feedQuantity,
      pump_start_time: feedStartTime,
      pump_end_time: feedEndTime,
      is_pumped_feed: true,
      is_feed_given: false,
    };
    console.log("feedController", insertQuery)
    const addPumpedFeed = await savePumpedModel(insertQuery);
    if (addPumpedFeed._id) {
      res
        .status(200)
        .json({ message: `Pumping for ${req.body.feedTaker.name} completed!` });
    } else {
      res
        .status(404)
        .json({ message: "Unable to add tracked pumping. Please try later!" });
    }
  } catch (err) {
    return next(err);
  }
}

export async function getPumpedFeed(req: Request<unknown, unknown, unknown, { feed_taker: string;}>, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUserSchema;
    const getPumpedFeed = await getPumpedDetailsModel(
      user.user_email,
      req.query.feed_taker
    );
    res.status(200).json(getPumpedFeed);
  } catch (err) {
    return next(err);
  }
}

export async function deletePumped(req: Request<{ feedId: string;}>, res: Response, next: NextFunction) {
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

export async function getPumpedForId(req: Request<{ pumpedId: string;}>, res: Response, next: NextFunction) {
  try {
    const getFeedForId = await getFeedByIdModel(req.params.pumpedId);
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

export async function saveEditedPumped(req: Request<unknown, unknown, IUpdateFeedBody>, res: Response, next: NextFunction) {
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
