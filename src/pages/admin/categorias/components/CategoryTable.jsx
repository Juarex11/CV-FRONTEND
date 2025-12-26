import React, { useState, useEffect } from "react";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import CategoryForm from "./CategoryForm";
import swal from "sweetalert";

const API_URL = "https://apidemo.cartavirtual.shop/api/categorias";

const CategoryTable = ({ search, refreshTrigger }) => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener categorías
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Cargar cuando inicia o cuando el refresh cambia
  useEffect(() => {
    fetchCategories();
  }, [refreshTrigger]);

  // 🔍 Filtro
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((c) =>
        c.nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [search, categories]);

  // ✏️ Editar (abre modal)
  const handleEdit = (category) => {
    setSelectedCategory({
      id_categoria: category.id_categoria,
      name: category.nombre,
      description: category.descripcion,
      imageUrl: `https://apidemo.cartavirtual.shop/${category.imagen_url}`,
    });
  };

  // 🗑️ Eliminar
  const handleDelete = async (id) => {
    const confirm = await swal({
      title: "¿Eliminar categoría?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    });
    if (!confirm) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        swal("Eliminado!", "La categoría fue eliminada.", "success");
        fetchCategories();
      } else {
        swal("Error", "No se pudo eliminar la categoría.", "error");
      }
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      swal("Error", "Error de conexión al eliminar.", "error");
    }
  };

  const handleSave = () => {
    fetchCategories();
    setSelectedCategory(null);
  };

  // 🚫 Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (selectedCategory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [selectedCategory]);

  return (
    <div className="relative">
      {loading ? (
        <p className="text-gray-500">Cargando categorías...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <motion.div
                key={category.id_categoria}
                className="bg-gray-50 rounded-xl flex flex-col overflow-hidden shadow-sm h-[340px]"
                whileHover={{ scale: 1.02 }}
              >
                {/* Imagen */}
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://apidemo.cartavirtual.shop/${category.imagen_url}`}
                    alt={category.nombre}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Contenido */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                      {category.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 min-h-[48px]">
                      {category.descripcion || "Sin descripción"}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="mt-4 flex justify-end items-center pt-3 border-t border-gray-200 space-x-4">
                    <motion.button
                      onClick={() => handleEdit(category)}
                      whileHover={{ scale: 1.2 }}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <RiEditLine size={22} />
                    </motion.button>

                    <motion.button
                      onClick={() => handleDelete(category.id_categoria)}
                      whileHover={{ scale: 1.2 }}
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <RiDeleteBin6Line size={22} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No se encontraron resultados
            </p>
          )}
        </div>
      )}

      {/* ✏️ Modal lateral de edición */}
      <AnimatePresence>
        {selectedCategory && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCategory(null)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full sm:w-2/5 bg-white shadow-2xl z-50 p-6 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h3 className="text-xl font-bold text-gray-800">Editar Categoría</h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-500 hover:text-red-500 text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
              <CategoryForm
                initialData={selectedCategory}
                onCancel={() => setSelectedCategory(null)}
                onSuccess={handleSave}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryTable;
