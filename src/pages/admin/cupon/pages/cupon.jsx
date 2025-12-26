import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/shared/AdminSidebar";
import HeaderAdmin from "../../../../components/shared/AdminHeader";
import CuponTable from "../components/CuponTable";
import NewCupon from "../components/NewCupon";

const CuponPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCupon, setEditingCupon] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("Bembos");
  const [cupones, setCupones] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Traer nombre de empresa ---
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

  // --- Cargar cupones ---
  const fetchCupones = async () => {
    try {
      const res = await fetch("https://apidemo.cartavirtual.shop/api/cupon");
      const data = await res.json();
      setCupones(data);
    } catch (error) {
      console.error("Error al cargar cupones:", error);
    }
  };

  useEffect(() => {
    fetchCupones();
  }, []);

  // --- Cambiar título ---
  useEffect(() => {
    document.title = `${empresaNombre} - Administrador/Cupones`;
  }, [empresaNombre]);

  // --- Cambiar favicon ---
  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "/menu.png";
  }, []);

  // --- Crear nuevo cupón ---
  const handleCreateCupon = (nuevoCupon) => {
    setCupones((prev) => [nuevoCupon, ...prev]);
    setIsModalOpen(false);
    setTimeout(() => window.location.reload(), 2000);
  };

  // --- Editar cupón ---
  const handleEditCupon = (cuponEditado) => {
    setCupones((prev) =>
      prev.map((c) => (c.id_cupon === cuponEditado.id_cupon ? cuponEditado : c))
    );
    setIsModalOpen(false);
    setTimeout(() => window.location.reload(), 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* --- SIDEBAR PC --- */}
      <div className="hidden lg:block w-64 bg-gray-800 text-white flex-shrink-0">
        <Sidebar />
      </div>

      {/* --- SIDEBAR MOBILE --- */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="absolute left-0 top-0 h-full w-64 bg-gray-800 shadow-2xl">
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="flex-grow flex flex-col w-full">

        {/* HEADER */}
        <HeaderAdmin openSidebar={() => setSidebarOpen(true)} />

        {/* MAIN */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto relative">

          {/* Header de página */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Cupones
            </h1>

            <button
              onClick={() => {
                setEditingCupon(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition w-full sm:w-auto"
            >
              + Crear Cupón
            </button>
          </div>

          {/* Tabla */}
          <div className="w-full overflow-x-auto rounded-lg">
  <CuponTable
    cupones={cupones}
    onEdit={(cupon) => {
      setEditingCupon(cupon);
      setIsModalOpen(true);
    }}
  />
</div>

          {/* Modal */}
          <NewCupon
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={editingCupon}
            onSuccess={(nuevoCupon, isEditMode) => {
              if (isEditMode) handleEditCupon(nuevoCupon);
              else handleCreateCupon(nuevoCupon);
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default CuponPage;
