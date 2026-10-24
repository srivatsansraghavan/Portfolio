import moment from "moment";
import {
  getExcDetailsModel,
  saveTrackedExcModel,
  deleteExcretionModel,
  getExcretionModel,
} from "../models/excModel.js";
import { updateInventoryModel } from "../models/inventoryModel.js";
import type { Request, Response, NextFunction } from "express";
import type { IUserSchema } from "../dto/schema.dto.js";

export async function saveTrackedExcretion(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUserSchema;
    const excTime = moment().format("MM/DD/YYYY HH:mm:ss");
    const insertQuery = {
      care_giver: user.user_email,
      care_taken_of_name: req.body.careTakenOf.name,
      care_taken_of_id: req.body.careTakenOf.id,
      excretion_type: req.body.excretionType,
      napkin_type: req.body.napkinType,
      diaper_count: req.body.diaperCount,
      diaper_brand: req.body.diaperBrand,
      excretion_time: excTime,
    };
    await saveTrackedExcModel(insertQuery);
    if(req.body.diaperBrand && req.body.diaperCount) {
      await updateInventoryModel(
        { _id: req.body.diaperBrand },
        { inventory_used: req.body.diaperCount }
      );
    }
    res
      .status(200)
      .json({ message: `Excretion of ${req.body.careTakenOf.name} noted!` });
  } catch (err) {
    return next(err);
  }
}

export async function getExcretionDetails(req: Request, res: Response, next: NextFunction) {
  const user = req.user as IUserSchema;
  try {
    const getTrackedExcretion = await getExcDetailsModel({
      care_giver: user.user_email,
      care_taken_of_id: req.query.careTakenId,
    });
    res.status(200).json(getTrackedExcretion);
  } catch (err) {
    return next(err);
  }
}

export async function deleteExcretion(req: Request, res: Response, next: NextFunction) {
  try {
    const getDiaperDetails = await getExcretionModel({
      _id: req.params.excId,
    });
    if (getDiaperDetails && getDiaperDetails.napkin_type === "Diaper") {
      const diaperCount = getDiaperDetails.diaper_count;
      const diaperBrand = getDiaperDetails.diaper_brand;
      await updateInventoryModel(
        { _id: diaperBrand },
        { inventory_used: -diaperCount }
      );
    }
    await deleteExcretionModel({
      _id: req.params.excId,
    });
    res
      .status(200)
      .json({ message: "Tracked excretion deleted successfully" });
  } catch (err) {
    return next(err);
  }
}

export async function getExcretionForId(req: Request, res: Response, next: NextFunction) {
  try {
    const getExcForId = await getExcretionModel({
      _id: req.params.excId,
    });
    if (getExcForId && Object.keys(getExcForId).length > 0) {
      res.status(200).json(getExcForId);
    } else {
      res.status(404).json({
        message: "Unable to get tracked excretion. Please try again later!",
      });
    }
  } catch (err) {
    return next(err);
  }
}
