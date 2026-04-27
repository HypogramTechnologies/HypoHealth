import { Router } from 'express';
import dispositivoRoutes from './dispositivoRoutes';
import medicamentoRoutes from './medicamentoRoutes'; // Importe aqui

const routes = Router();

routes.use('/dispositivos', dispositivoRoutes);
routes.use('/medicamentos', medicamentoRoutes); // Registre aqui

export default routes;