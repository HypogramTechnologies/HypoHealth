import { Router } from "express";
import medicamentoRoutes from "./medicamentoRoutes";
import agendamentoRoutes from "./agendamentoRoutes";

const routes = Router();

routes.use("/medicamentos", medicamentoRoutes);
routes.use("/agendamentos", agendamentoRoutes);

export default routes;
