import React, { useState, useEffect, useMemo } from "react";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import CuponForm from "./CuponForm";
import swal from "sweetalert";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

const API_URL = "https://apidemo.cartavirtual.shop/api/cupon";
const API_CATEGORIAS = "https://apidemo.cartavirtual.shop/api/categorias";
const API_PRODUCTOS = "https://apidemo.cartavirtual.shop/api/producto";

const CuponTable = () => {
  const [cupones, setCupones] = useState([]);
  const [filteredCupones, setFilteredCupones] = useState([]);
  const [selectedCupon, setSelectedCupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const parseJsonSafe = async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Respuesta no es JSON válido:", text);
      throw new Error("Respuesta inválida del servidor");
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [cuponRes, catRes, prodRes] = await Promise.all([
        fetch(API_URL),
        fetch(API_CATEGORIAS),
        fetch(API_PRODUCTOS),
      ]);

      const [cuponData, catData, prodData] = await Promise.all([
        parseJsonSafe(cuponRes),
        parseJsonSafe(catRes),
        parseJsonSafe(prodRes),
      ]);

      setCategorias(catData);
      setProductos(prodData);

      const cuponesConNombres = cuponData.map((c) => ({
        ...c,
        nombre_categoria:
          catData.find((cat) => cat.id_categoria === c.id_categoria)?.nombre ||
          "—",
        nombre_producto:
          prodData.find((p) => p.id_producto === c.id_producto)?.nombre || "—",
      }));

      setCupones(cuponesConNombres);
      setFilteredCupones(cuponesConNombres);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      swal("Error", "No se pudo obtener datos del servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim() === "") {
        setFilteredCupones(cupones);
      } else {
        const filtered = cupones.filter((c) =>
          c.codigo.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCupones(filtered);
      }
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search, cupones]);

  const handleEdit = (cupon) => {
    setSelectedCupon(cupon);
  };

  const handleDelete = async (id) => {
    const confirm = await swal({
      title: "¿Eliminar cupón?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    });
    if (!confirm) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        swal("Eliminado!", "El cupón fue eliminado.", "success");
        fetchAllData();
      } else {
        swal("Error", "No se pudo eliminar el cupón.", "error");
      }
    } catch (error) {
      console.error("Error al eliminar cupón:", error);
      swal("Error", "Error de conexión al eliminar.", "error");
    }
  };

  const handleSave = () => {
    fetchAllData();
    setSelectedCupon(null);
  };

  const totalPages = Math.ceil(filteredCupones.length / pageSize);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCupones.slice(start, start + pageSize);
  }, [filteredCupones, currentPage, pageSize]);

  return (
    <div className="relative bg-white p-4 sm:p-6 rounded-2xl">
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <label className="text-gray-700 font-semibold">Mostrar:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando cupones...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full text-xs sm:text-sm divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-200 text-[10px] sm:text-xs">
              <tr>
                <th className="px-2 py-3 text-left font-semibold">ID</th>
                <th className="px-2 py-3 text-left font-semibold">Código</th>
                <th className="px-2 py-3 text-left font-semibold">Tipo</th>
                <th className="px-2 py-3 text-left font-semibold">Valor</th>
                <th className="px-2 py-3 text-left font-semibold hidden md:table-cell">Categoría</th>
                <th className="px-2 py-3 text-left font-semibold hidden lg:table-cell">Producto</th>
                <th className="px-2 py-3 text-left font-semibold">Inicio</th>
                <th className="px-2 py-3 text-left font-semibold">Fin</th>
                <th className="px-2 py-3 text-left font-semibold hidden sm:table-cell">Estado</th>
                <th className="px-2 py-3 text-left font-semibold hidden sm:table-cell">Usado/Total</th>
                <th className="px-2 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginated.map((cupon, pagIndex) => (
                <tr
                  key={cupon.id_cupon}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-2 py-3">{(currentPage - 1) * pageSize + pagIndex + 1}</td>
                  <td className="px-2 py-3 font-semibold">{cupon.codigo}</td>
                  <td className="px-2 py-3 capitalize">{cupon.tipo}</td>
                  <td className="px-2 py-3">
                    {cupon.tipo === "porcentaje"
                      ? `${cupon.valor}%`
                      : `S/ ${cupon.valor}`}
                  </td>

                  <td className="px-2 py-3 hidden md:table-cell">
                    {cupon.nombre_categoria}
                  </td>

                  <td className="px-2 py-3 hidden lg:table-cell">
                    {cupon.nombre_producto}
                  </td>

                  <td className="px-2 py-3">
                    {new Date(cupon.fecha_inicio).toLocaleDateString()}
                  </td>

                  <td className="px-2 py-3">
                    {new Date(cupon.fecha_fin).toLocaleDateString()}
                  </td>

                  <td className="px-2 py-3 hidden sm:table-cell">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        cupon.estado
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cupon.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-2 py-3 hidden sm:table-cell">
                    {cupon.cantidad_usada}/{cupon.cantidad_total}
                  </td>

                  <td className="px-2 py-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(cupon)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
                      >
                        <RiEditLine className="inline" /> Editar
                      </button>

                      <button
                        onClick={() => handleDelete(cupon.id_cupon)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200"
                      >
                        <RiDeleteBin6Line className="inline" /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-4 text-gray-500"
                  >
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINACIÓN */}
      <div className="flex justify-end mt-4 gap-2 items-center text-xs sm:text-sm">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
          disabled={currentPage === 1}
        >
          <HiArrowLeft /> Anterior
        </button>

        <span className="px-3 py-1 border rounded-lg bg-gray-50">
          {currentPage} / {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Siguiente <HiArrowRight />
        </button>
      </div>

      {/* MODAL RESPONSIVE */}
      <AnimatePresence>
        {selectedCupon && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCupon(null)}
            />

            <motion.div
              className="
                fixed right-0 top-0 h-full  
                w-full sm:w-2/3 lg:w-1/3 
                bg-white shadow-2xl z-50 p-6
                overflow-y-auto
              "
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-4">Editar Cupón</h3>

              <CuponForm
                initialData={selectedCupon}
                onCancel={() => setSelectedCupon(null)}
                onSuccess={handleSave}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CuponTable;
