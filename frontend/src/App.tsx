import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Hammer } from 'lucide-react';

// Layout y Pantallas Principales
import MainLayout from './components/layout/MainLayout';
import DashboardScreen from './screens/DashboardScreen';
import SterilizationCycleScreen from './screens/SterilizationCycleScreen';
import InformesScreen from './screens/InformesScreen';
import ReportesScreen from './screens/ReportesScreen';
import HojasDeVidaScreen from './screens/HojasDeVidaScreen';

// Funcionalidad de Autenticación (Features)
import LoginScreen from './features/auth/LoginScreen';
import ChangePasswordScreen from './features/auth/ChangePasswordScreen';

// Configuración
import InsumosScreen from './screens/config/InsumosScreen';
import ProveedoresScreen from './screens/config/ProveedoresScreen';
import EspecialidadScreen from './screens/config/EspecialidadScreen';
import SubespecialidadScreen from './screens/config/SubespecialidadScreen';
import TipoSubespecialidadScreen from './screens/config/TipoSubespecialidadScreen';
import KitScreen from './screens/config/KitScreen';
import SedesScreen from './screens/config/SedesScreen';
import QuirofanoScreen from './screens/config/QuirofanoScreen';
import UsuariosScreen from './screens/config/UsuariosScreen';

// Informes y Ciclo
import IngresoInstrumentosScreen from './screens/informes/IngresoInstrumentosScreen';
import DevolucionInstrumentosScreen from './screens/informes/DevolucionInstrumentosScreen';
import TrazabilidadScreen from './screens/ciclo/TrazabilidadScreen';

// Componente Placeholder para rutas en construcción
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 space-y-4">
    <div className="p-6 bg-slate-100 rounded-full">
      <Hammer size={48} className="text-slate-300" />
    </div>
    <h2 className="text-2xl font-bold text-slate-600">{title}</h2>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* RUTA PÚBLICA: LOGIN */}
        <Route path="/login" element={<LoginScreen />} />
        
        {/* RUTA OBLIGATORIA SPRINT 1: CAMBIO DE CONTRASEÑA */}
        <Route path="/cambio-password" element={<ChangePasswordScreen />} />

        {/* REDIRECCIÓN INICIAL */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* RUTAS PROTEGIDAS CON LAYOUT */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/hojas-vida" element={<HojasDeVidaScreen />} />
          
          {/* Módulo de Kits (TM KIT del Excel) */}
          <Route path="/config/kit" element={<KitScreen />} />
          
          {/* Resto de rutas de configuración... */}
          <Route path="/config/especialidad" element={<EspecialidadScreen />} />
          <Route path="/config/subespecialidad" element={<SubespecialidadScreen />} />
          <Route path="/config/usuarios" element={<UsuariosScreen />} />
          
          {/* Ciclo y Trazabilidad */}
          <Route path="/ciclo/trazabilidad" element={<TrazabilidadScreen />} />
          <Route path="/ciclo/instrumentos" element={<SterilizationCycleScreen />} />
        </Route>

        {/* Captura de rutas no encontradas */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;