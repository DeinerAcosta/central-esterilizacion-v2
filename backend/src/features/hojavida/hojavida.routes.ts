import { Router } from 'express';
import { 
  createHojaVida, 
  getHojasVida, 
  getInventario, 
  getControlBajas, 
  registrarContable, 
  patchEstadoHojaVida,
  updateHojaVida
} from './hojavida.controller'; 
import { getInventarioPorSede, ejecutarTraslado } from './traslados.controller';
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

// Rutas de Hoja de Vida
router.get('/inventario', getInventario); 
router.get('/bajas', getControlBajas); 
router.get('/', getHojasVida);

// Crear hoja de vida
router.post('/', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'garantia', maxCount: 1 },
  { name: 'registroInvimaDoc', maxCount: 1 },
  { name: 'codigoInstrumentoDoc', maxCount: 1 }
]), createHojaVida);

// Editar hoja de vida
router.put('/:id', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'garantia', maxCount: 1 },
  { name: 'registroInvimaDoc', maxCount: 1 },
  { name: 'codigoInstrumentoDoc', maxCount: 1 }
]), updateHojaVida);

// Estado y registro contable
router.put('/:id/contable', upload.fields([{ name: 'facturaDoc', maxCount: 1 }]), registrarContable);
router.patch('/:id/estado', patchEstadoHojaVida);

// Rutas de Traslados
router.get('/inventario-sede', getInventarioPorSede);
router.post('/trasladar', ejecutarTraslado);

export default router;