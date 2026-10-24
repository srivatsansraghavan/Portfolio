import moment from "moment";
import {
  saveTrackedInvModel,
  getInventoriesModel,
  getAvailableInventoryModel,
} from "../models/inventoryModel.js";
import type { Request, Response, NextFunction } from "express";
import type { IInventorySchema, IUserSchema } from "../dto/schema.dto.js";

export async function addToInventory(req: Request<unknown, unknown, { careTakenOf: { name: string; id: string}; inventoryType: string; inventoryBrand: string; inventoryForm: string; inventoryCount: number; inventoryEachContains: number;}>, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUserSchema;
    const addedTime = moment().format("MM/DD/YYYY HH:mm:ss");
    const inventoryTotal =
      req.body.inventoryCount * req.body.inventoryEachContains;
    const insertQuery: IInventorySchema = {
      care_giver: user.user_email,
      care_taken_of_name: req.body.careTakenOf.name,
      care_taken_of_id: req.body.careTakenOf.id,
      inventory_type: req.body.inventoryType,
      inventory_brand: req.body.inventoryBrand,
      inventory_form: req.body.inventoryForm,
      added_time: addedTime,
      inventory_total: inventoryTotal,
      inventory_used: 0,
    };
    await saveTrackedInvModel(insertQuery);
    res
      .status(200)
      .json({ message: `Inventory of ${req.body.careTakenOf.name} noted!` });
  } catch (err) {
    return next(err);
  }
}

export async function getInventories(req: Request<unknown, unknown, unknown, { careTakenId: string; }>, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUserSchema;
    const getInventories = await getInventoriesModel({
      care_giver: user.user_email,
      care_taken_of_id: req.query.careTakenId,
    });
    res.status(200).json(getInventories);
  } catch (err) {
    return next(err);
  }
}

export async function getAvailableInventory(req: Request<unknown, unknown, unknown, { careTakenId: string; inventoryType: string; }>, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUserSchema;
    const getAvlInventory = await getAvailableInventoryModel({
      care_giver: user.user_email,
      care_taken_of_id: req.query.careTakenId,
      inventory_type: req.query.inventoryType,
      $expr: { $gt: ["$inventory_total", "$inventory_used"] },
    });
    res.status(200).json(getAvlInventory);
  } catch (err) {
    return next(err);
  }
}
