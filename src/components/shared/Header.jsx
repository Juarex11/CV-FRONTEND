import React, { useEffect, useState, useRef } from "react";
import { RiSearch2Line, RiWhatsappFill } from "react-icons/ri";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PiHamburgerFill } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { LuFileAudio } from "react-icons/lu";

const Header = ({
  darkMode,
  selectedCategory,
  onSelectCategory,
  onSearch,
  showOrder,
}) => {
  const [categories, setCategories] = useState([]);
  const [empresa, setEmpresa] = useState({ nombre: "", horario: "", telefono: "" });
  const [openModal, setOpenModal] = useState(false);
  const categoryRef = useRef(null);
  const [showDots, setShowDots] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data)
          setEmpresa({
            nombre: data.nombre || "",
            horario: data.horario || "",
            telefono: data.telefono || "",
          });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const container = categoryRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      setScrollPosition(maxScroll > 0 ? container.scrollLeft / maxScroll : 0);
    };

    const checkScroll = () => setShowDots(container.scrollWidth > container.clientWidth);

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScroll);
    checkScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  return (
    <header>
      {!showOrder && (
        <div
          className={`md:hidden absolute top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center
            ${darkMode ? "text-gray-300" : "text-white"} rounded-b-full py-3 w-[95%] transition-colors duration-300 ease-in-out`}
          style={{
            background: scrolled
              ? "linear-gradient(90deg, #fd5d00ff, #e90404ff)"
              : darkMode
              ? "#1F1D2B"
              : "linear-gradient(90deg, #fd5d00ff, #e90404ff)",
          }}
        >
          <h1
            className="text-center uppercase special-gothic-expanded-one-regular"
            style={{ fontSize: "28px" }}
          >
            {empresa.nombre}
          </h1>
        </div>
      )}

      <div className="md:hidden h-16" />

      <div
        className={`flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6 
          md:bg-transparent md:rounded-none ${darkMode ? "text-gray-300" : "text-black"}`}
      >
        <div className="pt-2 hidden md:block">
          <h1
            className={`uppercase martian-mono whitespace-nowrap truncate max-w-[600px] ${
              darkMode ? "text-gray-200" : "text-black"
            }`}
            style={{ fontSize: "26px", lineHeight: "32px" }}
          >
            Bienvenidos a {empresa.nombre}
          </h1>

          {empresa.horario && (
            <p
              className={`mt-2 whitespace-nowrap truncate max-w-[600px] ${
                darkMode ? "text-gray-400" : "text-gray-700"
              }`}
              style={{ fontSize: "18px" }}
            >
              Atendemos de {empresa.horario}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 px-2 md:px-0">
          <button
            onClick={() => setOpenModal(true)}
            className="md:hidden p-3 rounded-lg bg-gray-200"
          >
            <FaBars className={`${darkMode ? "text-black" : "text-black"}`} size={20} />
          </button>

          <form className="flex-1">
            <div className="w-full md:w-96 lg:w-[400px] relative">
              <RiSearch2Line
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                onChange={(e) => onSearch(e.target.value)}
                className={`w-full py-3 pl-10 pr-4 rounded-lg outline-none ${
                  darkMode
                    ? "bg-[#2B2A3A] text-gray-300"
                    : "bg-white text-black border border-gray-200"
                }`}
                placeholder="Buscar producto..."
              />
            </div>
          </form>
        </div>
      </div>

      {openModal && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-[999]">
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl p-6 flex flex-col justify-between animate-slide-right">

            <div className="flex flex-col gap-4">
              <button className="self-end text-black text-xl" onClick={() => setOpenModal(false)}>
                ✕
              </button>

              <Link
                to="/home"
                onClick={() => setOpenModal(false)}
                className="font-bold text-orange-500 text-lg flex items-center gap-2 leading-none mb-3"
              >
                <PiHamburgerFill size={20} />
                Inicio
              </Link>

              <Link
                to="/terminos"
                onClick={() => setOpenModal(false)}
                className="text-black text-lg flex items-center gap-2 leading-none mb-3"
              >
                <LuFileAudio size={20} />
                Términos y Condiciones
              </Link>

              <Link
                to="/politicas"
                onClick={() => setOpenModal(false)}
                className="text-black text-lg flex items-center gap-2 leading-none mb-3"
              >
                <RiGitRepositoryPrivateFill size={20} />
                Políticas de Privacidad
              </Link>

              <Link
                to="/profile_empresa"
                onClick={() => setOpenModal(false)}
                className="text-black text-lg flex items-center gap-2 leading-none mb-3"
              >
                <FaUserCircle size={20} />
                Perfil Empresa
              </Link>
            </div>

            <div className="text-center mt-6 mb-2">
              <p className="text-black font-semibold text-sm mb-2">¿Tienes alguna queja?</p>

              <a
                href={`https://wa.me/51${empresa.telefono}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg font-semibold"
              >
                <RiWhatsappFill className="text-xl" />
                WhatsApp
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
