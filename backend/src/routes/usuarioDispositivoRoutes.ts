import { Router } from "express";

import { usuarioDispositivoController } from "../controllers/UsuarioDispositivoController";

const router = Router();

router.post("/", (req, res) =>
  usuarioDispositivoController.create(
    req,
    res,
  ),
);

router.get(
  "/usuario/:usuario_id",
  (req, res) =>
    usuarioDispositivoController.getByUsuario(
      req,
      res,
    ),
);

router.delete("/:id", (req, res) =>
  usuarioDispositivoController.delete(
    req,
    res,
  ),
);

export default router;