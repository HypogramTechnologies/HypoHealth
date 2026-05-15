import { Router } from "express";
import { medicAgendamentoQueryController } from "../controllers/MedicAgendamentoQueryController";

const router = Router();

router.get("/completos", (req, res) =>
  medicAgendamentoQueryController.getAllAgendamentosCompletos(req, res),
);

router.get("/:id/completo", (req, res) =>
  medicAgendamentoQueryController.getAgendamentoCompleto(req, res),
);

export default router;
