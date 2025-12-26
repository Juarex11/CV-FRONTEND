import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/shared/AdminSidebar";
import HeaderAdmin from "../../../../components/shared/AdminHeader";
import ProductoTable from "../components/ProductoTable";
import NewProducto from "../components/NewProducto";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("Bembos");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [categoriaNombre, setCategoriaNombre] = useState("");

  const { id_categoria } = useParams();

  // Obtener nombre de categoría actual
  useEffect(() => {
    const fetchCategoriaNombre = async () => {
      try {
        const res = await fetch("https://apidemo.cartavirtual.shop/api/categorias");
        const data = await res.json();

        const categoria = data.find((c) => c.id_categoria == id_categoria);
        if (categoria) setCategoriaNombre(categoria.nombre);
      } catch (error) {
        console.error("Error al obtener categoría:", error);
      }
    };
    fetchCategoriaNombre();
  }, [id_categoria]);

  // Nombre empresa
  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch("https://apidemo.cartavirtual.shop/api/empresa");
        const data = await res.json();
        if (data && data.nombre) setEmpresaNombre(data.nombre);
      } catch (error) {
        console.error("Error al obtener nombre de empresa:", error);
      }
    };
    fetchEmpresa();
  }, []);

  // Título navegador
  useEffect(() => {
    document.title = `${empresaNombre} - Administrador/Productos`;
  }, [empresaNombre]);

  // Favicon
  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "/menu.png";
  }, []);

  // Refrescar tabla
  const handleSaveProduct = () => {
    setRefreshKey((prev) => prev + 1);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR — ahora colapsa en tablet */}
      <div className="hidden md:block w-64 bg-gray-800 text-white flex-shrink-0">
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-grow flex flex-col">
        <HeaderAdmin />

        <main className="flex-grow p-4 md:p-8 overflow-y-auto relative">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              {categoriaNombre || "Productos"}
            </h1>

            {/* 🔍 BUSCADOR + BOTÓN RESPONSIVE */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-8">

              <div className="w-full md:w-[85%]">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full shadow-sm 
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="w-full md:w-[15%] mt-4 md:mt-0">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 
                             rounded-lg shadow-md transition w-full"
                >
                  + Nuevo producto
                </button>
              </div>
            </div>

            {/* 🗂 TABLA */}
            <ProductoTable
              search={searchTerm}
              refreshTrigger={refreshKey}
              categoryId={id_categoria}
              onEdit={(product) => {
                setEditingProduct(product);
                setIsModalOpen(true);
              }}
            />
          </div>

          {/* MODAL LATERAL */}
          <NewProducto
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={editingProduct}
            categoryId={id_categoria}
            onSuccess={handleSaveProduct}
          />
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
