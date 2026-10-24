import moment from "moment";
import {
  saveTrackedMedModel,
  getMedicationModel,
  deleteMedicationModel,
} from "../models/medicationModel.js";
import {
  getInventoriesModel,
  updateInventoryModel,
} from "../models/inventoryModel.js";
import type { Request, Response, NextFunction } from "express";
import type { IMedicationSchema, IUserSchema } from "../dto/schema.dto.js";
import type { IMedicationBody } from "../dto/requests.dto.js";

export async function saveTrackedMedications(req: Request<unknown, unknown, IMedicationBody>, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUserSchema;
    const medTime = moment().format("MM/DD/YYYY HH:mm:ss");
    const invMedDetails = await getInventoriesModel({
      _id: req.body.medicineId,
    });
    const insertQuery: IMedicationSchema = {
      care_giver: user.user_email,
      care_taken_of_name: req.body.careTakenOf.name,
      care_taken_of_id: req.body.careTakenOf.id,
      medicine_name: invMedDetails[0]?.inventoryBrand as string,
      medicine_form: invMedDetails[0]?.inventoryForm as string,
      medicine_quantity: req.body.medicineQuantity,
      medicine_id: req.body.medicineId,
      medication_time: medTime,
    };
    const saveTrackedMed = await saveTrackedMedModel(insertQuery);
    if (saveTrackedMed._id) {
      await updateInventoryModel(
        { _id: req.body.medicineId },
        { $inc: { inventory_used: req.body.medicineQuantity } }
      );
      res
        .status(200)
        .json({ message: `Medication of ${req.body.careTakenOf.name} noted!` });
    } else {
      res.status(404).json({
        message: "Unable to add tracked medication. Please try later!",
      });
    }
  } catch (err) {
    return next(err);
  }
}

export async function getMedicationDetails(req: Request<unknown, unknown, unknown, { careTakenId: string; }, Record<string, unknown>>, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUserSchema;
    const getTrackedMedication = await getMedicationModel({
      care_giver: user.user_email,
      care_taken_of_id: req.query.careTakenId,
    });
    res.status(200).json(getTrackedMedication);
  } catch (err) {
    return next(err);
  }
}

export async function deleteMedication(req: Request<{ medId: string; }>, res: Response, next: NextFunction) {
  try {
    const getMedDetails = await getMedicationModel({ _id: req.params.medId });
    if (getMedDetails && getMedDetails.length) {
      const medDetail = getMedDetails.find((medDetail) => medDetail.medicine_id === req.params.medId);
      if(!medDetail) {
        throw new Error('No Medicine entry available');
      }
      const medQuantity = medDetail.medicine_quantity;
      const medId = medDetail.medicine_id;
      await updateInventoryModel(
        { _id: medId },
        { $inc: { inventory_used: -medQuantity } }
      );
    }
    const deleteMed = await deleteMedicationModel({
      _id: req.params.medId,
    });
    if (deleteMed.acknowledged && deleteMed.deletedCount === 1) {
      res
        .status(200)
        .json({ message: "Tracked medication deleted successfully" });
    } else {
      res.status(404).json({
        message: "Unable to delete tracked medication. Please try again later!",
      });
    }
  } catch (err) {
    return next(err);
  }
}

export async function getMedForId(req: Request<{ medId: string; }>, res: Response, next: NextFunction) {
  try {
    const getMedForId = await getMedicationModel({
      _id: req.params.medId,
    });
    res.status(200).json(getMedForId);
  } catch (err) {
    return next(err);
  }
}

export async function getMedForm(req: Request<{ medId: string; }>, res: Response, next: NextFunction) {
  try {
    const getInvForMed = await getInventoriesModel({
      _id: req.params.medId,
    });
    if (getInvForMed.length) {
      res.status(200).send(getInvForMed[0]?.inventoryForm);
    } else {
      res.status(404).send({
        message: "Unable to get inventory form. Please try again later!",
      });
    }
  } catch (err) {
    return next(err);
  }
}
