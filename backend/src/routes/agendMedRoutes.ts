import { Router, Request, Response } from "express";
import { MedicAgendamentoController } from "../controllers/MedicAgendamentoController";

const router = Router();
const medicAgendamentoController = new MedicAgendamentoController();

router.post("/", (req: Request, res: Response) =>
  medicAgendamentoController.createSimultaneo(req, res),
);

router.put("/:id", (req, res) =>
  medicAgendamentoController.updateSimultaneo(req, res),
);

router.get("/:id", (req, res) => medicAgendamentoController.getById(req, res));

export default router;
