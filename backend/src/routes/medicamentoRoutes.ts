import { Router } from "express";
import { medicamentoController } from "../controllers/MedicamentoController";

const router = Router();

router.post("/", (req, res) => medicamentoController.create(req, res));
router.get("/", (req, res) => medicamentoController.getAll(req, res));
router.get("/:id", (req, res) => medicamentoController.getById(req, res));
router.put("/:id", (req, res) => medicamentoController.update(req, res));
router.delete("/:id", (req, res) => medicamentoController.delete(req, res));

export default router;
