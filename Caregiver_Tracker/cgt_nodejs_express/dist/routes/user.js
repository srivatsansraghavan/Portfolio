import { Router } from "express";
const router = Router();
import { loginUser, addUser, logoutUser, isLoggedInUser } from "../controllers/userController.js";
import { isAuthenticated } from "../utils.js";
router.post("/add-user", addUser);
router.post("/login-user", loginUser);
router.get("/is-user-loggedin", isLoggedInUser);
router.delete("/logout-user", isAuthenticated, logoutUser);
export default router;
//# sourceMappingURL=user.js.map