import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/shared/AdminSidebar";
import HeaderAdmin from "../../../../components/shared/AdminHeader";
import ProfileForm from "../components/ProfileForm";

const ProfilePage = () => {
  const [empresaNombre, setEmpresaNombre] = useState("Bembos"); // valor por defecto
  
    // --- Traer nombre de la empresa ---
    useEffect(() => {
      const fetchEmpresa = async () => {
        try {
          const res = await fetch("https://apidemo.cartavirtual.shop/api/empresa");
          const data = await res.json();
          if (data && data.nombre) setEmpresaNombre(data.nombre);
        } catch (error) {
          console.error("Error al obtener el nombre de la empresa:", error);
        }
      };
      fetchEmpresa();
    }, []);
  
    // --- Actualizar título de la pestaña ---
    useEffect(() => {
      document.title = `${empresaNombre} - Administrador/Perfil`;
    }, [empresaNombre]);
  
    // --- Poner favicon de la imagen admin.png ---
    useEffect(() => {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = "/menu.png"; // ruta relativa a public
    }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex-shrink-0">
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <div className="flex-grow flex flex-col">
        <HeaderAdmin />
        <main className="flex-grow p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Perfil</h1>
          <ProfileForm />
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
