import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ContratosPage from './pages/ContratosPage';
import AseguradorasPage from './pages/AseguradorasPage';
import PolizasPage from './pages/PolizasPage';

// Componente para proteger rutas
const RutaPrivada = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Privadas */}
        <Route path="/dashboard" element={
          <RutaPrivada><Dashboard /></RutaPrivada>
        } />

        {/* 2. Añadimos la ruta de contratos */}
        <Route path="/contratos" element={
          <RutaPrivada><ContratosPage /></RutaPrivada>
        } />

        <Route path="/aseguradoras" element={
          <RutaPrivada><AseguradorasPage /></RutaPrivada>
        } />
        <Route path="/polizas" element={
          <RutaPrivada><PolizasPage /></RutaPrivada>
        } />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;