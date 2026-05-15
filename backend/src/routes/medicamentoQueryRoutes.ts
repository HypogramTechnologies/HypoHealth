import { Router } from "express";
import { medicAgendamentoQueryController } from "../controllers/MedicAgendamentoQueryController";

const router = Router();

router.get("/completos", (req, res) =>
  medicAgendamentoQueryController.getAllMedicamentosComAgendamentos(req, res),
);

router.get("/:id/completo", (req, res) =>
  medicAgendamentoQueryController.getMedicamentoComAgendamentos(req, res),
);

export default router;
