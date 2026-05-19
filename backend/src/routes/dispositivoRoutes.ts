import { Router } from "express";

import { dispositivoController } from "../controllers/DispositivoController";

const router = Router();

router.get("/primeiro", (req, res) =>
  dispositivoController.getPrimeiro(req, res),
);

export default router;
