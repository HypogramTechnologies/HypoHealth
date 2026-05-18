import { Router } from "express";
import { medicAgendamentoQueryController } from "../controllers/MedicAgendamentoQueryController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/completos", (req, res) =>
  medicAgendamentoQueryController.getAllMedicamentosComAgendamentos(req, res),
);

router.get("/:id/completo", (req, res) =>
  medicAgendamentoQueryController.getMedicamentoComAgendamentos(req, res),
);

router.get("/:id/hoje", authMiddleware, (req, res) =>
  medicAgendamentoQueryController.getMedicamentosDoDia(req, res),
);

export default router;
