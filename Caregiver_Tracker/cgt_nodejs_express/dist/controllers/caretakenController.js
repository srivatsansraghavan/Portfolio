import moment from "moment";
import { addCareTakenModel, getCareTakenDetailsModel, changeCareTakenModel, } from "../models/caretakenModel.js";
export async function addCareTaken(req, res, next) {
    try {
        const user = req.user;
        const addCareTaken = await addCareTakenModel({
            care_giver: user.user_email,
            care_taken_of: req.body.care_taken_of,
            care_taken_name: req.body.care_taken_name,
            care_taken_dob: moment(req.body.care_taken_dob, "DD/MM/YYYY HH:mm:ss").format("MM/DD/YYYY HH:mm:ss"),
            care_taken_gender: req.body.care_taken_gender,
            care_taken_added_time: moment().format("MM/DD/YYYY HH:mm:ss"),
            care_last_accessed: true,
        });
        if (addCareTaken.hasOwnProperty("_id")) {
            res.status(200).json({
                message: `Care can now be provided to ${req.body.care_taken_name}`,
                addedCareTaken: addCareTaken,
            });
        }
        else {
            res
                .status(404)
                .json({ message: "Unable to add details. Please try later!" });
        }
    }
    catch (err) {
        return next(err);
    }
}
export async function getCareTakenDetails(req, res, next) {
    try {
        const user = req.user;
        const careTakenDetails = await getCareTakenDetailsModel(user.user_email);
        res.status(200).json(careTakenDetails);
    }
    catch (err) {
        return next(err);
    }
}
export async function changeCareTaken(req, res, next) {
    try {
        const user = req.user;
        const changeCareTaken = await changeCareTakenModel(req.body.care_taken_id, user.user_email);
        res.status(200).json(changeCareTaken);
    }
    catch (err) {
        return next(err);
    }
}
//# sourceMappingURL=caretakenController.js.map