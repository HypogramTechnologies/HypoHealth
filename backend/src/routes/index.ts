import { Router } from "express";
import medicamentoRoutes from "./medicamentoRoutes";

const routes = Router();

routes.use("/medicamentos", medicamentoRoutes);

export default routes;
