import { Router } from "express";

import { usuarioDispositivoController } from "../controllers/UsuarioDispositivoController";

const router = Router();

router.post("/responsavel", (req, res) =>
  usuarioDispositivoController.createResponsavel(req, res),
);

router.post("/", (req, res) => usuarioDispositivoController.create(req, res));

router.get("/dispositivo/:dispositivo_id", (req, res) =>
  usuarioDispositivoController.getByDispositivo(req, res),
);

router.get("/usuario/:usuario_id", (req, res) =>
  usuarioDispositivoController.getByUsuario(req, res),
);

router.delete("/:id", (req, res) =>
  usuarioDispositivoController.delete(req, res),
);

export default router;
