import React, { useEffect, useState } from "react";
import { RiUpload2Line, RiCloseCircleLine, RiSave3Line } from "react-icons/ri";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const API_URL = "https://apidemo.cartavirtual.shop/api/recursos-empresa";
const ID_RECURSO = 1;

const UploadImagesCard = () => {
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingBanner, setLoadingBanner] = useState(false);

  useEffect(() => {
    fetchRecursos();
    // ✅ Inyectar estilo global para botón SweetAlert verde permanente
    if (!document.getElementById("swal-ok-style")) {
      const style = document.createElement("style");
      style.id = "swal-ok-style";
      style.innerHTML = `
        .swal2-confirm {
          background-color: #16a34a !important;
          color: white !important;
          border: none !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
          padding: 8px 25px !important;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
        }
        .swal2-confirm:hover {
          background-color: #16a34a !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const fetchRecursos = async () => {
    try {
      const { data } = await axios.get(API_URL);
      if (data.logo_url)
        setLogo(`https://apidemo.cartavirtual.shop/${data.logo_url}?t=${Date.now()}`);
      if (data.portada_url)
        setBanner(`https://apidemo.cartavirtual.shop/${data.portada_url}?t=${Date.now()}`);
    } catch (error) {
      console.error("Error al cargar los recursos:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar",
        text: "No se pudieron obtener las imágenes.",
      });
    }
  };

  const handleUpload = async (file, type) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("id_recurso", ID_RECURSO);
    if (type === "logo") formData.append("logo_url", file);
    else if (type === "portada") formData.append("portada_url", file);

    try {
      if (type === "logo") setLoadingLogo(true);
      else setLoadingBanner(true);

      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Solo actualizar vista, sin SweetAlert
      fetchRecursos();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al subir imagen",
        text: "No se pudo subir la imagen. Inténtalo nuevamente.",
      });
    } finally {
      if (type === "logo") setLoadingLogo(false);
      else setLoadingBanner(false);
    }
  };

  const handleCancel = (type) => {
    fetchRecursos();
    Swal.fire({
      icon: "info",
      title: "Cambios cancelados",
      text: `Se restauró la imagen original del ${type}.`,
    });
  };

  const handleSave = (type) => {
    Swal.fire({
      icon: "success",
      title: "Cambios guardados",
      text: `Se guardaron los cambios en el ${type}.`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-10">
      {/* 🔹 LOGO */}
      <div className="bg-white rounded-2xl p-6 shadow-md h-[500px] flex flex-col justify-between relative">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-left">Logo</h2>

          <div className="relative group w-full flex items-center justify-center">
            {logo ? (
              <div className="relative w-64 h-64 border border-gray-300 rounded-xl overflow-hidden">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-contain transition-all duration-300 group-hover:opacity-90"
                />
                {/* 🔸 Botón centrado gris semitransparente */}
                <label
                  htmlFor="logo-upload"
                  className="absolute inset-0 flex items-center justify-center 
                             bg-gray-600/40 opacity-0 group-hover:opacity-100 
                             hover:bg-gray-800/60 text-white font-medium text-sm 
                             rounded-xl cursor-pointer transition-all duration-300"
                >
                  <RiUpload2Line className="mr-2 text-lg" />
                  {loadingLogo ? "Cargando..." : "Cambiar"}
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e.target.files[0], "logo")}
                  className="hidden"
                  disabled={loadingLogo}
                />
              </div>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
                Vista previa del logo
              </div>
            )}
          </div>
        </div>

        {/* 🔸 Botones Logo */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => handleCancel("logo")}
            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-5 py-2.5 rounded-lg transition-all duration-200"
          >
            <RiCloseCircleLine className="text-lg" />
            Cancelar
          </button>

          <button
            onClick={() => handleSave("logo")}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg transition-all duration-200"
          >
            <RiSave3Line className="text-lg" />
            Guardar
          </button>
        </div>
      </div>

      {/* 🔹 BANNER */}
      <div className="bg-white rounded-2xl p-6 shadow-md lg:col-span-2 h-[500px] flex flex-col justify-between relative">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-left">Banner</h2>

          <div className="relative group w-full flex items-center justify-center">
            {banner ? (
              <div className="relative w-full h-72 border border-gray-300 rounded-xl overflow-hidden">
                <img
                  src={banner}
                  alt="Banner"
                  className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-90"
                />
                {/* 🔸 Botón centrado gris semitransparente */}
                <label
                  htmlFor="banner-upload"
                  className="absolute inset-0 flex items-center justify-center 
                             bg-gray-600/40 opacity-0 group-hover:opacity-100 
                             hover:bg-gray-800/60 text-white font-medium text-sm 
                             rounded-xl cursor-pointer transition-all duration-300"
                >
                  <RiUpload2Line className="mr-2 text-lg" />
                  {loadingBanner ? "Cargando..." : "Cambiar"}
                </label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e.target.files[0], "portada")}
                  className="hidden"
                  disabled={loadingBanner}
                />
              </div>
            ) : (
              <div className="w-full h-72 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
                Vista previa del banner
              </div>
            )}
          </div>
        </div>

        {/* 🔸 Botones Banner */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => handleCancel("banner")}
            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-5 py-2.5 rounded-lg transition-all duration-200"
          >
            <RiCloseCircleLine className="text-lg" />
            Cancelar
          </button>

          <button
            onClick={() => handleSave("banner")}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg transition-all duration-200"
          >
            <RiSave3Line className="text-lg" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadImagesCard;
