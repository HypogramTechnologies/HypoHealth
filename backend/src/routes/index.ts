import { Router } from "express";
import medicamentoRoutes from "./medicamentoRoutes";
import agendamentoRoutes from "./agendamentoRoutes";
import usuarioRoutes from "./usuarioRoutes";
import agendMedRoutes from "./agendMedRoutes";
import medicamentoQueryRoutes from "./medicamentoQueryRoutes";
import agendamentoQueryRoutes from "./agendamentoQueryRoutes";

const routes = Router();

routes.use("/completos", agendMedRoutes);

// Query routes ANTES dos CRUD para /:id não engolir "/completos"
routes.use("/medicamentos", medicamentoQueryRoutes);
routes.use("/agendamentos", agendamentoQueryRoutes);

// CRUD routes
routes.use("/medicamentos", medicamentoRoutes);
routes.use("/agendamentos", agendamentoRoutes);
routes.use("/usuarios", usuarioRoutes);

export default routes;
