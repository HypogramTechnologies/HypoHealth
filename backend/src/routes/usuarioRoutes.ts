import { Router } from "express";
import { usuarioController } from "../controllers/UsuarioController";

const router = Router();

router.post("/", (req, res) => usuarioController.create(req, res));
router.get("/", (req, res) => usuarioController.getAll(req, res));
router.get("/:id", (req, res) => usuarioController.getByID(req, res));
router.put("/:id", (req, res) => usuarioController.update(req, res));
router.put("/:id/push-token", (req, res) => usuarioController.updatePushToken(req, res));
router.delete("/:id", (req, res) => usuarioController.delete(req, res));

export default router;
