import { Router } from "express";

import { dispositivoController } from "../controllers/DispositivoController";

const router = Router();

router.post("/", (req, res) => dispositivoController.create(req, res));

router.get("/", (req, res) => dispositivoController.getAll(req, res));

router.get("/verificar", (req, res) =>
  dispositivoController.verificarMac(req, res),
);

router.put("/:id", (req, res) => dispositivoController.update(req, res));

export default router;
