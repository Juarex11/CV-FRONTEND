import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import bcrypt from "bcryptjs";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empresaRes, recursosRes] = await Promise.all([
          fetch("https://apidemo.cartavirtual.shop/api/empresa"),
          fetch("https://apidemo.cartavirtual.shop/api/recursos-empresa"),
        ]);

        const empresaData = await empresaRes.json();
        const recursosData = await recursosRes.json();

        setEmpresaNombre(empresaData.nombre || "Empresa");
        setLogoUrl(`https://apidemo.cartavirtual.shop/${recursosData.logo_url}`);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (empresaNombre) document.title = `${empresaNombre} / Login`;

    if (logoUrl) {
      const favicon =
        document.querySelector("link[rel='icon']") || document.createElement("link");
      favicon.rel = "icon";
      favicon.href = logoUrl;
      document.head.appendChild(favicon);
    }
  }, [empresaNombre, logoUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      // 🔹 Obtener administrador
      const response = await fetch("https://apidemo.cartavirtual.shop/api/administrador");
      if (!response.ok) throw new Error("Error al conectar con el servidor");
      const admin = await response.json();

      if (email !== admin.email) {
        setError("Correo electrónico incorrecto");
        return;
      }

      const match = await bcrypt.compare(password, admin.contrasena);
      if (!match) {
        setError("Contraseña incorrecta");
        return;
      }

      // 🔹 Guardar sesión en localStorage (opcional)
      localStorage.setItem("admin", JSON.stringify({ id: admin.id_admin, nombre: admin.nombre, email: admin.email }));

      // 🔹 Redirigir a dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión");
    }
  };

  if (showSplash) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        {logoUrl && (
          <motion.img
            src={logoUrl}
            alt="Logo"
            className="w-40 h-40 object-contain"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-6">
      {logoUrl && (
        <motion.img
          src={logoUrl}
          alt="Logo"
          className="w-36 h-36 mb-5 object-contain"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      )}
      {empresaNombre && (
        <motion.h1
          className="text-xl font-semibold text-gray-800 mb-6 tracking-wide"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {empresaNombre}
        </motion.h1>
      )}

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col space-y-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {error && (
          <p className="bg-red-100 text-red-600 text-center py-2 rounded-md text-sm">
            {error}
          </p>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 transition"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 pr-10 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-all duration-300"
        >
          Entrar
        </button>
      </motion.form>

      <motion.p
        className="mt-10 text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        © {new Date().getFullYear()} - {empresaNombre || "Empresa"}
      </motion.p>
    </div>
  );
};

export default Login;
