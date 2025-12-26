import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Sidebar from "../../components/shared/Sidebar";

const Terminos = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [data, setData] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/recursos-empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data?.logo_url) {
          setLogoUrl(`https://apidemo.cartavirtual.shop/${data.logo_url}`);
        }
      });
  }, []);

  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/terminos")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(() => setError("No se pudieron cargar los términos y condiciones."));
  }, []);

  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/empresa")
      .then((res) => res.json())
      .then((empresaData) => {
        setEmpresa(empresaData);
        document.title = `${empresaData.nombre} / Términos y Condiciones`;
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#262837] text-white" : "bg-gray-100 text-[#111]"}`}>
      <Sidebar showMenu={showMenu} darkMode={darkMode} />

      <div className="lg:ml-28 lg:px-8 pb-24 lg:pb-10">
        <div className="p-4 md:p-6">

          {/* Título con flecha solo en móviles */}
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => navigate("/home")} 
              className="block lg:hidden"
            >
              <IoIosArrowBack size={28} color="black" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-[#ec7c6a]">
              {data?.titulo || "Términos y Condiciones"}
            </h1>
          </div>

          {/* Contenedor de la información */}
          <div className={`p-6 rounded-xl ${darkMode ? "bg-[#1F1D2B] border border-gray-700" : "bg-white border border-gray-200 shadow-sm"}`}>
            {data && !error && (
              <div
                className="text-[15.5px] leading-relaxed pb-12"
                dangerouslySetInnerHTML={{
                  __html: data.descripcion
                    .replace(/\n/g, "<br />")
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                }}
              />
            )}
            {error && <p className="text-center text-red-500 font-semibold">{error}</p>}
          </div>

          {/* Footer */}
          <footer className="py-6 text-center text-sm mt-10">
            <p>© {new Date().getFullYear()} {empresa?.nombre || "Cargando..."}. Todos los derechos reservados.</p>
            {empresa && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-xs max-w-xl mx-auto">{empresa.ubicacion}</p>
            )}
            <div className="flex justify-center gap-4 mt-2">
              <a href="/terminos" className="text-amber-500 font-medium">Términos de Servicio</a>
              <span>•</span>
              <a href="/politicas" className="hover:text-amber-500 transition-colors">Política de Privacidad</a>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default Terminos;
