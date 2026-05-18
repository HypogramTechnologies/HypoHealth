import { Router } from "express";
import { homeController } from "../controllers/HomeController";

const router = Router();

router.get("/header", (req, res) =>
  homeController.header(req, res),
);

export default router;