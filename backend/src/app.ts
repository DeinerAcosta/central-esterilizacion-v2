import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './features/auth/auth.routes';
import insumosRoutes from './features/insumos/insumos.routes'; 
import proveedoresRoutes from './features/proveedores/proveedores.routes';
import especialidadesRoutes from './features/especialidades/especialidades.routes';
import subespecialidadesRoutes from './features/subespecialidades/subespecialidades.routes';
import tipoSubespecialidadRoutes from './features/tipoSubespecialidades/tipoSubespecialidades.routes';
import sedesRoutes from './features/sedes/sedes.routes';
import quirofanosRoutes from './features/quirofanos/quirofanos.routes';
import kitsRoutes from './features/kits/kits.routes';
import usuariosRoutes from './features/usuarios/usuarios.routes';
import hojavidaRoutes from './features/hojavida/hojavida.routes';

const app = express();
const PORT = 4000;

app.use(cors()); 
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/insumos', insumosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/subespecialidades', subespecialidadesRoutes);
app.use('/api/tipos-subespecialidad', tipoSubespecialidadRoutes);
app.use('/api/sedes', sedesRoutes);
app.use('/api/quirofanos', quirofanosRoutes);
app.use('/api/kits', kitsRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/hoja-vida', hojavidaRoutes); 

app.get('/health', (req: Request, res: Response) => {
    res.json({ msg: 'Servidor Central de Esterilización en línea 🚀' });
});

app.listen(PORT, () => {
    console.log(`✅ Backend corriendo y escuchando en http://localhost:${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Rechazo no manejado en:', promise, 'razón:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
});