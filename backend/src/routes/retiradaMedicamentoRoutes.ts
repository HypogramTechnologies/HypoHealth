import { Router } from "express";
import { RetiradaMedicamentoController } from "../controllers/RetiradaMedicamentoController";

const router = Router();
const retiradaMedicamentoController = new RetiradaMedicamentoController();

router.get("/alertas/:usuarioId", (req, res) =>
  retiradaMedicamentoController.recuperarAlertas(req, res),
);

router.get("/historico/:usuarioId", (req, res) =>
  retiradaMedicamentoController.recuperarHistorico(req, res),
);

export default router;