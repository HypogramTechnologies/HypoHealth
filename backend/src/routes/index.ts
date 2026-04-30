import { Router } from "express";
import medicamentoRoutes from "./medicamentoRoutes";
import agendamentoRoutes from "./agendamentoRoutes";
import usuarioRoutes from "./usuarioRoutes";

const routes = Router();

routes.use("/medicamentos", medicamentoRoutes);
routes.use("/agendamentos", agendamentoRoutes);
routes.use("/usuarios", usuarioRoutes)

export default routes;
