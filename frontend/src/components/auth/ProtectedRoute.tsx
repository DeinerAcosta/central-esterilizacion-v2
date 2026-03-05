import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.esPasswordProvisional) {
    return <Navigate to="/cambio-password" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;