import {} from "express";
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Session not available. Please login." });
};
//# sourceMappingURL=utils.js.map