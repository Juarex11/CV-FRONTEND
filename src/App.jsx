import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/home/home";
import Terminos from "./pages/home/terminos";
import Politica from "./pages/home/politica";
import Login from "./pages/login/login";

// celular
import Profile_empresa from "./pages/home/profile_empresa";

// Panel administrador
import Dashboard from "./pages/admin/dashboard/pages/dashboard";
import CategoriaAdmin from "./pages/admin/categorias/pages/categoria";
import ProductoAdmin from "./pages/admin/productos/pages/producto";
import Profile from "./pages/admin/perfil/pages/Profile";
import Cupon from "./pages/admin/cupon/pages/cupon";
import PoliticaAdmin from "./pages/admin/politica/pages/PoliticaAdmin";
import TerminosAdmin from "./pages/admin/terminos/pages/TerminosAdmin";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [cart, setCart] = useState([]);
  const isSmallScreen = window.innerWidth <= 768;

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id_producto === product.id_producto);
      if (exist) {
        return prev.map((item) =>
          item.id_producto === product.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Sitio público */}
        <Route
          path="/home"
          element={<Home addToCart={addToCart} cart={cart} setCart={setCart} />}
        />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/politicas" element={<Politica />} />
        <Route path="/profile_empresa" element={<Profile_empresa />} />

        {/* Login – prohibido en pantallas pequeñas */}
        <Route
          path="/login"
          element={ isSmallScreen ? <Navigate to="/home" replace /> : <Login /> }
        />

        {/* ADMIN – todas redirigen a home en móviles */}
        <Route
          path="/admin/dashboard"
          element={
            isSmallScreen ? (
              <Navigate to="/home" replace />
            ) : (
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            )
          }
        />

        <Route
          path="/admin/categorias"
          element={
            isSmallScreen ? (
              <Navigate to="/home" replace />
            ) : (
              <PrivateRoute>
                <CategoriaAdmin />
              </PrivateRoute>
            )
          }
        />

        <Route
          path="/admin/categorias/:id_categoria"
          element={
            isSmallScreen ? (
              <Navigate to="/home" replace />
            ) : (
              <PrivateRoute>
                <ProductoAdmin />
              </PrivateRoute>
            )
          }
        />

        <Route
          path="/admin/profile"
          element={
            isSmallScreen ? (
              <Navigate to="/home" replace />
            ) : (
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            )
          }
        />

        <Route
          path="/admin/cupon"
          element={
            isSmallScreen ? (
              <Navigate to="/home" replace />
            ) : (
              <PrivateRoute>
                <Cupon />
              </PrivateRoute>
            )
          }
        />

        <Route
          path="/admin/politicas"
          element={
            isSmallScreen ? (
              <Navigate to="/home" replace />
            ) : (
              <PrivateRoute>
                <PoliticaAdmin />
              </PrivateRoute>
            )
          }
        />

        <Route
          path="/admin/terminos"
          element={
            isSmallScreen ? (
              <Navigate to="/home" replace />
            ) : (
              <PrivateRoute>
                <TerminosAdmin />
              </PrivateRoute>
            )
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
