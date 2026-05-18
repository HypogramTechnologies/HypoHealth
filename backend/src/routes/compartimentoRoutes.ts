import { Router } from "express";

import { compartimentoController } from "../controllers/CompartimentoController";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/dispositivo/:dispositivoId",
  authMiddleware,
  (req, res) => compartimentoController.getByDispositivo(req, res),
);

router.get(
  "/:id",
  authMiddleware,
  (req, res) => compartimentoController.getById(req, res),
);

export default router;