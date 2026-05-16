import { Router, Request, Response } from "express";
import { MedicAgendamentoController } from "../controllers/MedicAgendamentoController";

const router = Router();
const medicAgendamentoController = new MedicAgendamentoController();

router.post("/", (req: Request, res: Response) =>
  medicAgendamentoController.createSimultaneo(req, res),
);

export default router;
