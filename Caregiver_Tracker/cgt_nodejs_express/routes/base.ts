import { Router, type NextFunction, type Request, type Response } from "express";
const router = Router();
import { connectToMongoDB, cgtdbEnv } from "../config.js";

router.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Caregiver Tracker Express server running!" });
});

router.get("/clean-env-db/:env", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params.env === "dev") {
      res.status(401).json({ message: "Not allowed to perform DB clean" });
    } else {
      const db = await connectToMongoDB(cgtdbEnv[req.params.env as keyof typeof cgtdbEnv]);
      if (!db) {
        throw new Error('No DB returned');
      }
      db.connection.collection("tbl_users").deleteMany();
      db.connection.collection("tbl_roles").deleteMany();
      db.connection.collection("tbl_feeding").deleteMany();
      db.connection.collection("tbl_excretion").deleteMany();
      db.connection.collection("tbl_inventory").deleteMany();
      db.connection.collection("tbl_medication").deleteMany();
      res.sendStatus(200);
    }
  } catch (err) {
    return next(err);
  }
});

export default router;
