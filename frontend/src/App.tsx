import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Auth
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginScreen from './features/auth/LoginScreen';
import ChangePasswordScreen from './features/auth/ChangePasswordScreen';

// Dashboards & Principales
import DashboardScreen from './screens/DashboardScreen';

// Módulo: Hojas de Vida (Ruta actualizada a la nueva estructura modular)
import HojasDeVidaScreen from './screens/hojas-vida/HojasDeVidaScreen';

// Módulo: Configuración
import InsumosScreen from './screens/config/InsumosScreen';
import ProveedoresScreen from './screens/config/ProveedoresScreen';
import EspecialidadScreen from './screens/config/EspecialidadScreen';
import SubespecialidadScreen from './screens/config/SubespecialidadScreen';
import TipoSubespecialidadScreen from './screens/config/TipoSubespecialidadScreen';
import KitScreen from './screens/config/KitScreen';
import SedesScreen from './screens/config/SedesScreen';
import QuirofanoScreen from './screens/config/QuirofanoScreen';
import UsuariosScreen from './screens/config/UsuariosScreen';

// Módulo: Informes y Reportes
import InformesScreen from './screens/InformesScreen';
import ReportesScreen from './screens/ReportesScreen';
import IngresoInstrumentosScreen from './screens/informes/IngresoInstrumentosScreen';
import DevolucionInstrumentosScreen from './screens/informes/DevolucionInstrumentosScreen';

// Módulo: Ciclo de Esterilización
import SterilizationCycleScreen from './screens/SterilizationCycleScreen';
import TrazabilidadScreen from './screens/ciclo/TrazabilidadScreen';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas (Login) */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/cambio-password" element={<ChangePasswordScreen />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas Privadas (Requieren autenticación) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardScreen />} />
            
            {/* Hojas de Vida */}
            <Route path="/hojas-vida" element={<HojasDeVidaScreen />} />
            
            {/* Configuración */}
            <Route path="/config/insumos" element={<InsumosScreen />} />
            <Route path="/config/proveedores" element={<ProveedoresScreen />} />
            <Route path="/config/especialidad" element={<EspecialidadScreen />} />
            <Route path="/config/subespecialidad" element={<SubespecialidadScreen />} />
            <Route path="/config/tipo-subespecialidad" element={<TipoSubespecialidadScreen />} />
            <Route path="/config/kit" element={<KitScreen />} />
            <Route path="/config/sedes" element={<SedesScreen />} />
            <Route path="/config/quirofano" element={<QuirofanoScreen />} />
            <Route path="/config/usuarios" element={<UsuariosScreen />} />
            
            {/* Informes y Reportes */}
            <Route path="/informes" element={<InformesScreen />} />
            <Route path="/informes/ingreso" element={<IngresoInstrumentosScreen />} />
            <Route path="/informes/devolucion" element={<DevolucionInstrumentosScreen />} />
            <Route path="/reportes" element={<ReportesScreen />} />
            
            {/* Ciclo de Esterilización */}
            <Route path="/ciclo/trazabilidad" element={<TrazabilidadScreen />} />
            <Route path="/ciclo/instrumentos" element={<SterilizationCycleScreen />} />
            
          </Route>
        </Route>

        {/* Catch all: Si la URL no existe, redirigir al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;