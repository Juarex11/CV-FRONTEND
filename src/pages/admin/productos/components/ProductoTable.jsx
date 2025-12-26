import React, { useState, useEffect } from "react";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import ProductoForm from "./ProductoForm";
import swal from "sweetalert";
import { useParams } from "react-router-dom";

const API_URL = "https://apidemo.cartavirtual.shop/api/producto";

const ProductoTable = ({ search, refreshTrigger }) => {
  const { id_categoria } = useParams();
  const categoryId = id_categoria ? Number(id_categoria) : null;

  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const list = categoryId
        ? data.filter((p) => p.id_categoria === categoryId)
        : data;

      setProductos(list);
      setFilteredProducts(list);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [refreshTrigger, categoryId]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts(productos);
    } else {
      const filtered = productos.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [search, productos]);

  const handleEdit = (product) => {
    setSelectedProduct({
      id_producto: product.id_producto,
      name: product.nombre,
      description: product.descripcion,
      price: product.precio,
      imageUrl: `https://apidemo.cartavirtual.shop/${product.imagen_url}`,
    });
  };

  const handleDelete = async (id) => {
    const confirm = await swal({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    });

    if (!confirm) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        swal("Eliminado!", "El producto fue eliminado.", "success");
        fetchProductos();
      } else {
        swal("Error", "No se pudo eliminar el producto.", "error");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      swal("Error", "Error de conexión al eliminar.", "error");
    }
  };

  const handleSave = () => {
    fetchProductos();
    setSelectedProduct(null);
  };

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [selectedProduct]);

  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id_producto}
                className="bg-white rounded-xl flex flex-col overflow-hidden shadow-md border max-w-full min-h-0 h-[380px]"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-full h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={`https://apidemo.cartavirtual.shop/${product.imagen_url}`}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 min-h-0">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                      {product.nombre}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[36px]">
                      {product.descripcion || "Sin descripción"}
                    </p>

                    <p className="text-md font-bold text-green-700 mt-2">
                      S/ {product.precio}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end items-center pt-2 border-t border-gray-200 space-x-4">
                    <motion.button
                      onClick={() => handleEdit(product)}
                      whileHover={{ scale: 1.2 }}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <RiEditLine size={22} />
                    </motion.button>

                    <motion.button
                      onClick={() => handleDelete(product.id_producto)}
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
              No se encontraron productos
            </p>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
            />

            <motion.div
              className="
                fixed right-0 top-0 h-full 
                w-full 
                sm:w-[55%] 
                lg:w-[40%] 
                bg-white shadow-2xl z-50 
                p-6 overflow-y-auto
              "
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h3 className="text-xl font-bold text-gray-800">
                  Editar Producto
                </h3>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-red-500 text-2xl leading-none"
                >
                  ✕
                </button>
              </div>

              <ProductoForm
                initialData={selectedProduct}
                categoryId={categoryId}
                onCancel={() => setSelectedProduct(null)}
                onSuccess={handleSave}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductoTable;
