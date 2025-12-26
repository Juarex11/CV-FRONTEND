import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const [empresa, setEmpresa] = useState({});
  const [logoUrl, setLogoUrl] = useState(null);
  const [correo, setCorreo] = useState(""); 
  const [showMapa, setShowMapa] = useState(false);

  const navigate = useNavigate(); // hook para redireccionar

  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/empresa")
      .then((res) => res.json())
      .then((data) => setEmpresa(data))
      .catch((err) => console.log("Error empresa:", err));

    fetch("https://apidemo.cartavirtual.shop/api/recursos-empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data.logo_url)
          setLogoUrl(`https://apidemo.cartavirtual.shop/${data.logo_url}`);
      })
      .catch((err) => console.log("Error recursos:", err));

    fetch("https://apidemo.cartavirtual.shop/api/administrador")
      .then((res) => res.json())
      .then((data) => {
        if (data?.email) setCorreo(data.email);
      })
      .catch((err) => console.log("Error administrador:", err));
  }, []);

  const toggleMapa = () => {
    setShowMapa(!showMapa);
  };

  const irHome = () => {
    navigate("/home");
  };

  return (
    <div className="md:hidden w-full min-h-screen bg-gray-100 flex flex-col items-center">

      {/* FILA SUPERIOR: FLECHA ATRAS + LOGO + WHATSAPP */}
      <div className="w-full relative flex items-center justify-center mt-8 px-4">
        {/* Flecha atrás */}
        <button
          onClick={irHome}
          className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 text-gray-700"
        >
          <IoIosArrowBack size={28} />
        </button>

        {/* Logo */}
        <div style={{ width: "230px", height: "auto" }}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="w-full h-auto object-contain"
            />
          )}
        </div>
      </div>

      {/* HORARIO */}
      <p className="text-center text-gray-700 mt-6 text-sm px-4">
        Atención de {empresa?.horario}
      </p>

      {/* CONTENEDOR PRINCIPAL */}
      <div
        className="
          w-full 
          flex-1 
          mt-6 
          bg-white 
          rounded-t-[60px]
          shadow-[0_-6px_10px_rgba(0,0,0,0.15)]
          relative
          flex 
          flex-col 
          items-start
          pt-6 px-6
        "
      >
        {/* Franja negra */}
        <div className="w-16 h-2 bg-black rounded-full self-center mb-6"></div>

        {/* ICONOS REDES NEGROS */}
        <div className="flex items-center justify-center gap-6 mb-8 w-full">
          <FaFacebookF className="text-black text-4xl" />
          <FaInstagram className="text-black text-4xl" />
          <FaTiktok className="text-black text-4xl" />
        </div>

        {/* TELEFONO */}
        <div className="relative w-full max-w-sm mb-6">
          <label className="absolute -top-3 left-4 bg-white px-2 text-gray-500 text-sm font-semibold">
            Teléfono
          </label>
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-4">
            <span className="text-gray-800 font-medium pl-3">{empresa?.telefono}</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg"
              alt="Peru"
              className="w-6 h-4 object-cover rounded-sm ml-2"
            />
          </div>
        </div>

        {/* CORREO */}
        <div className="relative w-full max-w-sm mb-6">
          <label className="absolute -top-3 left-4 bg-white px-2 text-gray-500 text-sm font-semibold">
            Correo Electrónico
          </label>
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-4">
            <span className="text-gray-800 font-medium pl-3">{correo}</span>
          </div>
        </div>

        {/* UBICACION */}
        <div className="relative w-full max-w-sm mb-2">
          <label className="absolute -top-3 left-4 bg-white px-2 text-gray-500 text-sm font-semibold">
            Ubicación
          </label>
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-4">
            <span className="text-gray-800 font-medium pl-3">{empresa?.ubicacion}</span>
          </div>
        </div>

        {/* BOTON VER/OCULTAR MAPA */}
        <button
          onClick={toggleMapa}
          className="flex items-center justify-center w-full max-w-sm bg-gray-200 rounded-lg py-2 mt-2 text-gray-700 font-medium"
        >
          {showMapa ? "Ocultar mapa" : "Ver mapa"}
          <IoIosArrowDown
            className={`ml-2 transition-transform duration-300 ${showMapa ? "rotate-180" : ""}`}
            size={20}
          />
        </button>

        {/* MAPA */}
        {showMapa && empresa?.ubicacion && (
          <div className="w-full max-w-sm mt-4 h-64 mb-8">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                empresa.ubicacion
              )}&output=embed`}
              width="100%"
              height="100%"
              className="rounded-lg"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
