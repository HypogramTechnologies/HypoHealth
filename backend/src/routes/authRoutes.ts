import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const authController = new AuthController();

router.post("/cadastro", authController.cadastrar);
router.post("/login", authController.login);

export default router;