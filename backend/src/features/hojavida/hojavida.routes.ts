import { Router } from 'express';
import { createHojaVida, getHojasVida, getInventario, getControlBajas, registrarContable, patchEstadoHojaVida } from './hojavida.controller'; 
import { getInventarioPorSede, ejecutarTraslado } from './traslados.controller';
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

// Rutas de Hoja de Vida
router.get('/inventario', getInventario); 
router.get('/bajas', getControlBajas); 
router.get('/', getHojasVida);

router.post('/', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'garantia', maxCount: 1 },
  { name: 'registroInvimaDoc', maxCount: 1 },
  { name: 'codigoInstrumentoDoc', maxCount: 1 }
]), createHojaVida);

// NUEVAS RUTAS DE ESTADO Y CONTABLE
router.put('/:id/contable', upload.fields([{ name: 'facturaDoc', maxCount: 1 }]), registrarContable);
router.patch('/:id/estado', patchEstadoHojaVida);

// Rutas de Traslados
router.get('/inventario-sede', getInventarioPorSede);
router.post('/trasladar', ejecutarTraslado);

export default router;