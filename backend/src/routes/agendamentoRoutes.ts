import { Router } from "express";
import { agendamentoController } from "../controllers/AgendamentoController";

const router = Router();

router.post("/", (req, res) => agendamentoController.create(req, res));
router.get("/", (req, res) => agendamentoController.getAll(req, res));
router.delete("/:id", (req, res) => agendamentoController.delete(req, res));
router.get("/:id", (req, res) => agendamentoController.getById(req, res));
router.put("/:id", (req, res) => agendamentoController.update(req, res));

export default router;
