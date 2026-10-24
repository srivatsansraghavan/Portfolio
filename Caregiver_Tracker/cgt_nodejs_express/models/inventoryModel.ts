import mongoose, { model, type Mongoose, type PassportLocalDocument, type PassportLocalModel, type PassportLocalSchema, type RootFilterQuery } from "mongoose";
import { connectToMongoDB, cgtdbEnv } from "../config.js";
import type { IInventorySchema } from "../dto/schema.dto.js";


export interface IInventoryResponse {
  id: string;
  careGiver: string;
  careTakenOfName: string;
  careTakenOfId: string;
  inventoryType: string;
  inventoryBrand: string;
  inventoryForm: string;
  inventoryTotal: number;
  inventoryUsed: number;
  addedTime: string;
}
type InventorySchema = IInventorySchema & PassportLocalDocument;
type InventoryModel = PassportLocalModel<InventorySchema>;

async function getInvSchema(): Promise<PassportLocalSchema<InventorySchema, InventoryModel>> {
  const nodeEnv = process.env.NODE_ENV as keyof typeof cgtdbEnv;
  if (!nodeEnv) {
    throw new Error('NODE_ENV not available.')
  }
  const invTable: Mongoose | undefined = await connectToMongoDB(cgtdbEnv[nodeEnv]);

  if (!invTable) {
    throw new Error('Inventory table not returned');
  }

  const invSchema: PassportLocalSchema<InventorySchema, InventoryModel> = new invTable.Schema({
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
    inventory_type: {
      type: String,
      required: [true, "Inventory Type is required"],
    },
    inventory_brand: {
      type: String,
      required: [true, "Inventory Brand is required"],
    },
    inventory_form: {
      type: String,
    },
    inventory_total: {
      type: Number,
    },
    inventory_used: {
      type: Number,
    },
    added_time: {
      type: Date,
    },
  });

  return invSchema;
}

async function getInvModel(): Promise<InventoryModel> {
  return mongoose.models['tbl_inventory'] as InventoryModel || model<InventorySchema, InventoryModel>('tbl_inventory', await getInvSchema());
}

export const saveTrackedInvModel = async function (query: IInventorySchema): Promise<IInventoryResponse> {
  const invModel = await getInvModel();
  const addedInv = await new invModel(query).save();
   return {
    id: addedInv._id as string,
    careGiver: addedInv.care_giver,
    careTakenOfName: addedInv.care_taken_of_name,
    careTakenOfId: addedInv.care_taken_of_id,
    inventoryType: addedInv.inventory_type,
    inventoryBrand: addedInv.inventory_brand,
    inventoryForm: addedInv.inventory_form,
    inventoryTotal: addedInv.inventory_total,
    inventoryUsed: addedInv.inventory_used,
    addedTime: addedInv.added_time,
  }
};

export const updateInventoryModel = async function (finder: RootFilterQuery<{ _id: string; }>, updated: RootFilterQuery<{ inventory_used: number; }>): Promise<IInventoryResponse> {
  const invModel = await getInvModel();
  const updatedInv = await invModel.findOneAndUpdate(
    finder,
    { $inc: updated },
    {
      new: true,
    }
  );
  if(!updatedInv) {
    throw new Error('No update to inventory');
  }
  return {
    id: updatedInv._id as string,
    careGiver: updatedInv.care_giver,
    careTakenOfName: updatedInv.care_taken_of_name,
    careTakenOfId: updatedInv.care_taken_of_id,
    inventoryType: updatedInv.inventory_type,
    inventoryBrand: updatedInv.inventory_brand,
    inventoryForm: updatedInv.inventory_form,
    inventoryTotal: updatedInv.inventory_total,
    inventoryUsed: updatedInv.inventory_used,
    addedTime: updatedInv.added_time,
  }
};

export const getInventoriesModel = async function (finder: RootFilterQuery<{ _id: string; }>): Promise<IInventoryResponse[]> {
  const invModel = await getInvModel();
  const getInvDetails = await invModel
    .find(finder, null)
    .sort({ _id: -1 })
    .exec();
  return getInvDetails.map((getInvDetail) => ({
      id: getInvDetail._id as string,
      careGiver: getInvDetail.care_giver,
      careTakenOfName: getInvDetail.care_taken_of_name,
      careTakenOfId: getInvDetail.care_taken_of_id,
      inventoryType: getInvDetail.inventory_type,
      inventoryBrand: getInvDetail.inventory_brand,
      inventoryForm: getInvDetail.inventory_form,
      inventoryTotal: getInvDetail.inventory_total,
      inventoryUsed: getInvDetail.inventory_used,
      addedTime: getInvDetail.added_time,
  }));
};

export const getAvailableInventoryModel = async function (finder: RootFilterQuery<{ _id: string; }>): Promise<IInventoryResponse[]> {
  const invModel = await getInvModel();
  const getAvailableInventoryDetails = await invModel
    .find(finder)
    .sort({ _id: -1 })
    .exec();
  return getAvailableInventoryDetails.map((getAvailableInventoryDetail) => ({
      id: getAvailableInventoryDetail._id as string,
      careGiver: getAvailableInventoryDetail.care_giver,
      careTakenOfName: getAvailableInventoryDetail.care_taken_of_name,
      careTakenOfId: getAvailableInventoryDetail.care_taken_of_id,
      inventoryType: getAvailableInventoryDetail.inventory_type,
      inventoryBrand: getAvailableInventoryDetail.inventory_brand,
      inventoryForm: getAvailableInventoryDetail.inventory_form,
      inventoryTotal: getAvailableInventoryDetail.inventory_total,
      inventoryUsed: getAvailableInventoryDetail.inventory_used,
      addedTime: getAvailableInventoryDetail.added_time,
  }));
};
