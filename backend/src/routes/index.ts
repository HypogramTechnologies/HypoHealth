import { Router } from "express";
import medicamentoRoutes from "./medicamentoRoutes";
import agendamentoRoutes from "./agendamentoRoutes";
import usuarioRoutes from "./usuarioRoutes";
import agendMedRoutes from "./agendMedRoutes";
import medicamentoQueryRoutes from "./medicamentoQueryRoutes";
import agendamentoQueryRoutes from "./agendamentoQueryRoutes";
import authRoutes from "./authRoutes";
import { authMiddleware } from "../middlewares/authMiddleware";
import compartimentoRoutes from "./compartimentoRoutes";
import dispositivoRoutes from "./dispositivoRoutes";
import usuarioDispositivoRoutes from "./usuarioDispositivoRoutes";
const routes = Router();

routes.use("/completos", agendMedRoutes);

// Query routes ANTES dos CRUD para /:id não engolir "/completos"
routes.use("/medicamentos", medicamentoQueryRoutes);
routes.use("/agendamentos", agendamentoQueryRoutes);

// CRUD routes
routes.use("/medicamentos", medicamentoRoutes);
routes.use("/compartimentos", compartimentoRoutes);
routes.use("/agendamentos", agendamentoRoutes);
routes.use("/dispositivos", dispositivoRoutes);
routes.use("/usuarios", authMiddleware, usuarioRoutes);
routes.use("/usuario-dispositivo", authMiddleware, usuarioDispositivoRoutes);
routes.use("/auth", authRoutes);
routes.use("/usuario-dispositivos", usuarioDispositivoRoutes);

export default routes;
