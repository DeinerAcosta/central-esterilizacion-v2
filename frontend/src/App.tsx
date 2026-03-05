import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import DashboardScreen from './screens/DashboardScreen';
import SterilizationCycleScreen from './screens/SterilizationCycleScreen';
import InformesScreen from './screens/InformesScreen';
import ReportesScreen from './screens/ReportesScreen';
import HojasDeVidaScreen from './screens/HojasDeVidaScreen';
import LoginScreen from './features/auth/LoginScreen';
import ChangePasswordScreen from './features/auth/ChangePasswordScreen';
import InsumosScreen from './screens/config/InsumosScreen';
import ProveedoresScreen from './screens/config/ProveedoresScreen';
import EspecialidadScreen from './screens/config/EspecialidadScreen';
import SubespecialidadScreen from './screens/config/SubespecialidadScreen';
import TipoSubespecialidadScreen from './screens/config/TipoSubespecialidadScreen';
import KitScreen from './screens/config/KitScreen';
import SedesScreen from './screens/config/SedesScreen';
import QuirofanoScreen from './screens/config/QuirofanoScreen';
import UsuariosScreen from './screens/config/UsuariosScreen';
import IngresoInstrumentosScreen from './screens/informes/IngresoInstrumentosScreen';
import DevolucionInstrumentosScreen from './screens/informes/DevolucionInstrumentosScreen';
import TrazabilidadScreen from './screens/ciclo/TrazabilidadScreen';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/cambio-password" element={<ChangePasswordScreen />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/hojas-vida" element={<HojasDeVidaScreen />} />
            <Route path="/config/insumos" element={<InsumosScreen />} />
            <Route path="/config/proveedores" element={<ProveedoresScreen />} />
            <Route path="/config/especialidad" element={<EspecialidadScreen />} />
            <Route path="/config/subespecialidad" element={<SubespecialidadScreen />} />
            <Route path="/config/tipo-subespecialidad" element={<TipoSubespecialidadScreen />} />
            <Route path="/config/kit" element={<KitScreen />} />
            <Route path="/config/sedes" element={<SedesScreen />} />
            <Route path="/config/quirofano" element={<QuirofanoScreen />} />
            <Route path="/config/usuarios" element={<UsuariosScreen />} />
            <Route path="/informes" element={<InformesScreen />} />
            <Route path="/informes/ingreso" element={<IngresoInstrumentosScreen />} />
            <Route path="/informes/devolucion" element={<DevolucionInstrumentosScreen />} />
            <Route path="/reportes" element={<ReportesScreen />} />
            <Route path="/ciclo/trazabilidad" element={<TrazabilidadScreen />} />
            <Route path="/ciclo/instrumentos" element={<SterilizationCycleScreen />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;