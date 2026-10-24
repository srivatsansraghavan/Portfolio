import { userModel } from "../models/userModel.js";
import { firstLoginModel } from "../models/caretakenModel.js";
import passport from "passport";
export async function addUser(req, res, next) {
    try {
        userModel.register(new userModel({
            username: req.body.email,
            user_email: req.body.email,
            user_fullname: req.body.fullname
        }), req.body.password, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: err });
            }
            res.status(200).json({ message: 'success' });
        });
    }
    catch (err) {
        return next(err);
    }
}
export async function loginUser(req, res, next) {
    passport.authenticate("local", async (err, user, info) => {
        if (err) {
            console.log("Auth error:", err);
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                message: info?.message
            });
        }
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }
            const hasUserCareTaken = await firstLoginModel(user.user_email);
            res.json({
                firstLogin: hasUserCareTaken === 0,
                user: {
                    userEmail: user.user_email,
                    userFullname: user.user_fullname,
                    userName: user.username,
                }
            });
        });
    })(req, res, next);
}
export async function logoutUser(req, res, next) {
    req.logout((err) => {
        if (err)
            return next(err);
        req.session.destroy((err) => {
            if (err)
                return next(err);
            res.clearCookie('sessionId');
            res.status(200).json({ message: 'Logged out' });
        });
    });
}
export async function isLoggedInUser(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            return res.status(200).json({ message: 'Session active' });
        }
        return res.status(401).json({ message: 'Session expired' });
    }
    catch (err) {
        return next(err);
    }
}
//# sourceMappingURL=userController.js.map