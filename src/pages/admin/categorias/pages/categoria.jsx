import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/shared/AdminSidebar";
import HeaderAdmin from "../../../../components/shared/AdminHeader";
import ProductoTable from "../components/CategoryTable";
import NewProducto from "../components/NewCategory";

const CategoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("Bembos");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // 👈 para recargar tabla

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

  useEffect(() => {
    document.title = `${empresaNombre} - Administrador/Categorías`;
  }, [empresaNombre]);

  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "/menu.png";
  }, []);

  // ✅ Al guardar o editar: refrescamos la tabla
  const handleSaveCategory = (data) => {
    setRefreshKey((prev) => prev + 1);
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-grow flex flex-col">
        <HeaderAdmin />

        <main className="flex-grow p-8 overflow-y-auto relative">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Categorías
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mb-8">
              <div className="w-full sm:w-[85%]">
                <input
                  type="text"
                  placeholder="Buscar categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="w-full sm:w-[15%]">
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-green-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition w-full"
                >
                  + Nueva categoría
                </button>
              </div>
            </div>

            {/* 🗂 Tabla de categorías */}
            <ProductoTable search={searchTerm} refreshTrigger={refreshKey} />
          </div>

          {/* Modal lateral */}
          <NewProducto
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={editingCategory}
            onSubmit={handleSaveCategory} // 👈 refresca automáticamente
          />
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
