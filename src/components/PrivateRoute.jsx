import { Navigate } from "react-router-dom";

// Este componente recibe un children y solo lo muestra si el admin está logueado
const PrivateRoute = ({ children }) => {
  const admin = localStorage.getItem("admin"); // Verifica si hay sesión

  if (!admin) {
    // Si no hay sesión, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si hay sesión, muestra el componente protegido
  return children;
};

export default PrivateRoute;
