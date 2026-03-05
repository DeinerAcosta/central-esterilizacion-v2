import { Router } from 'express';
import { getUsuarios, createUsuario, updateUsuario, toggleEstadoUsuario } from './usuarios.controller';

const router = Router();

router.get('/', getUsuarios);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.patch('/:id/estado', toggleEstadoUsuario); 

export default router;