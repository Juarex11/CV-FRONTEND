import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  RiDashboardLine,
  RiApps2Line,
  RiUser3Line,
  RiShareLine,
  RiLogoutCircleRLine,
} from "react-icons/ri";
import { FaTicket } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";

const SidebarAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [nombreEmpresa, setNombreEmpresa] = useState("");

  // --- Traer categorías ---
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("https://apidemo.cartavirtual.shop/api/categorias");
        const data = await res.json();
        setCategorias(data.filter((c) => c.estado === 1)); // solo activas
      } catch (error) {
        console.error("Error al traer categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  // --- Traer logo desde la API ---
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch("https://apidemo.cartavirtual.shop/api/recursos-empresa");
        const data = await res.json();
        if (data && data.logo_url) {
          setLogoUrl(`https://apidemo.cartavirtual.shop/${data.logo_url}`);
        }
      } catch (error) {
        console.error("Error al traer el logo:", error);
      }
    };
    fetchLogo();
  }, []);

  // --- Traer nombre de la empresa ---
  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch("https://apidemo.cartavirtual.shop/api/empresa");
        const data = await res.json();
        if (data && data.nombre) {
          setNombreEmpresa(data.nombre);
        }
      } catch (error) {
        console.error("Error al traer el nombre de la empresa:", error);
      }
    };
    fetchEmpresa();
  }, []);

  const sections = [
    {
      title: "Administrador",
      items: [
        { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
        { name: "Perfil", path: "/admin/profile", icon: <RiUser3Line /> },
        { name: "Cupon", path: "/admin/cupon", icon: <FaTicket /> },
        {
          name: "Categorías",
          path: "/admin/categorias",
          icon: <RiApps2Line />,
          subItems: categorias.map((cat) => ({
            name: cat.nombre,
            path: `/admin/categorias/${cat.id_categoria}`,
          })),
        },
      ],
    },
    {
      title: "Web",
      items: [
        { name: "Términos y Condiciones", path: "/admin/terminos", icon: <RiShareLine /> },
        { name: "Políticas de Privacidad", path: "/admin/politicas", icon: <BsShieldCheck /> },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#1F1F1F] text-white flex flex-col shadow-xl overflow-hidden">
      {/* Encabezado con logo desde API */}
      <div className="pt-5 pb-3 flex flex-col items-center justify-center border-b border-gray-700">
        <div className="w-40 h-28 flex items-center justify-center -mt-2">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo Admin"
              className="w-full h-full object-contain select-none bg-transparent border-none shadow-none"
              draggable="false"
            />
          ) : (
            <span className="text-gray-400 text-sm">Cargando logo...</span>
          )}
        </div>

        {/* Nombre de la empresa */}
        {nombreEmpresa && (
          <p className="mt-1 text-base font-semibold text-center text-white">
            {nombreEmpresa}
          </p>
        )}
      </div>

      {/* NAV PRINCIPAL */}
      <nav className="flex-1 p-4 overflow-y-auto custom-scroll">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-sm uppercase text-gray-400 mb-2 font-semibold tracking-wider">
              {section.title}
            </h3>

            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-[#FF6D24] text-white"
                        : "text-gray-300 hover:bg-[#FF6D24] hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>

                  {item.subItems && item.subItems.length > 0 && (
                    <ul className="ml-10 mt-2 space-y-1 pr-2">
                      {item.subItems.map((sub, j) => (
                        <li key={j}>
                          <Link
                            to={sub.path}
                            className={`block px-3 py-1 rounded-md text-sm transition-colors ${
                              location.pathname === sub.path
                                ? "bg-[#FF6D24] text-white"
                                : "text-gray-400 hover:bg-[#FF6D24] hover:text-white"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg w-full text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <RiLogoutCircleRLine className="text-xl" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>

      {/* Estilos personalizados */}
      <style>{`
        /* Quitar scroll vertical en todo el sidebar */
        aside::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        aside {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        /* Quitar scroll visible dentro de las sublistas */
        .custom-scroll::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .custom-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
};

export default SidebarAdmin;
