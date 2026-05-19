import { Router } from "express";

import { compartimentoController } from "../controllers/CompartimentoController";

const router = Router();

router.get("/dispositivo/:dispositivoId", (req, res) =>
  compartimentoController.getByDispositivo(req, res),
);

router.get("/:id", (req, res) => compartimentoController.getById(req, res));

export default router;
