import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { RiHome6Line } from "react-icons/ri";
import { BsShieldCheck } from "react-icons/bs";
import { FaBook } from "react-icons/fa";

// ICONOS REDES
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const Sidebar = ({ showMenu, darkMode }) => {
  const location = useLocation();
  const [active, setActive] = useState("/home");

  // URLs redes desde API
  const [redes, setRedes] = useState({
    tiktok_url: "#",
    facebook_url: "#",
    instagram_url: "#",
  });

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  // 📌 Obtener datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://apidemo.cartavirtual.shop/api/empresa");
        const data = await res.json();
        setRedes({
          tiktok_url: data.tiktok_url ?? "#",
          facebook_url: data.facebook_url ?? "#",
          instagram_url: data.instagram_url ?? "#",
        });
      } catch (error) {
        console.log("Error cargando redes sociales", error);
      }
    };

    fetchData();
  }, []);

  const bgSidebar = "bg-[#141414]";
  const bgItemHover = darkMode ? "hover:bg-[#262837]" : "hover:bg-white";
  const iconColor = "text-[#F0320C]";
  const bgActive = darkMode ? "bg-[#262837]" : "bg-white";
  const bgButtonActive = "bg-[#F0320C] text-white";

  const menuItems = [
    { path: "/home", icon: <RiHome6Line className="text-2xl" />, label: "Inicio" },
    { path: "/politicas", icon: <BsShieldCheck className="text-2xl" />, label: "Políticas" },
    { path: "/terminos", icon: <FaBook className="text-2xl" />, label: "Términos" },
  ];

  return (
    <div
      className={`${bgSidebar} fixed lg:left-0 top-0 w-28 h-full flex flex-col justify-between py-16 z-50 transition-all ${
        showMenu ? "left-0" : "-left-full"
      }`}
    >
      {/* MENU PRINCIPAL */}
      <div>
        <ul className="pl-4 flex flex-col gap-6">
          {menuItems.map((item, index) => {
            const isActive = active === item.path;
            return (
              <li
                key={index}
                className={`relative p-4 rounded-tl-xl rounded-bl-xl group transition-colors cursor-pointer ${
                  isActive ? bgActive : bgItemHover
                }`}
                onClick={() => setActive(item.path)}
              >
                <div className="relative flex justify-center">
                  <Link
                    to={item.path}
                    className={`flex justify-center items-center p-4 rounded-xl transition-colors ${
                      isActive
                        ? `${bgButtonActive}`
                        : `group-hover:bg-[#F0320C] ${iconColor} group-hover:text-white`
                    }`}
                  >
                    {item.icon}
                  </Link>

                  <span
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100
                    bg-[#F0320C] text-white text-xs px-2 py-1 rounded-md transition-all duration-200
                    translate-y-2 group-hover:translate-y-0 whitespace-nowrap"
                  >
                    {item.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* REDES SOCIALES – DEBAJO DEL TODO */}
      <div className="flex flex-col items-center gap-4 mb-4">
        {/* TikTok */}
        <a
          href={redes.tiktok_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition"
        >
          <SiTiktok className="text-black text-xl" />
        </a>

        {/* Facebook */}
        <a
          href={redes.facebook_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition"
        >
          <FaFacebookF className="text-blue-600 text-xl" />
        </a>

        {/* Instagram */}
        <a
          href={redes.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition"
        >
          <FaInstagram className="text-pink-600 text-xl" />
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
