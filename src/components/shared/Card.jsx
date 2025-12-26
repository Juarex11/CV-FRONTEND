import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { TbDiscount2 } from "react-icons/tb";
import { RiCloseLine } from "react-icons/ri";

const Card = ({ darkMode, products, addToCart, selectedCategory }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [error, setError] = useState(null);
  const [cupones, setCupones] = useState([]);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  useEffect(() => {
    const fetchCupones = async () => {
      try {
        const res = await fetch("https://apidemo.cartavirtual.shop/api/cupon");
        const data = await res.json();
        setCupones(data);
      } catch (err) {
        console.error("Error al obtener cupones:", err);
      }
    };
    fetchCupones();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!selectedCategory || selectedCategory === "Todos") {
        setCategoryInfo(null);
        return;
      }

      try {
        const response = await fetch("https://apidemo.cartavirtual.shop/api/categorias");
        const allCategories = await response.json();

        const found = allCategories.find((cat) => {
          if (typeof selectedCategory === "number")
            return cat.id_categoria === selectedCategory;
          if (typeof selectedCategory === "string")
            return cat.nombre.toLowerCase() === selectedCategory.toLowerCase();
        });

        if (!found) throw new Error("Categoría no encontrada");
        setCategoryInfo(found);
      } catch (err) {
        setError(`Error al obtener categoría: ${err.message}`);
        setCategoryInfo(null);
      }
    };

    fetchCategory();
  }, [selectedCategory]);

  const obtenerDescuento = (product) => {
    const hoy = new Date();
    return (
      cupones.find(
        (c) =>
          c.estado === true &&
          new Date(c.fecha_inicio) <= hoy &&
          new Date(c.fecha_fin) >= hoy &&
          (c.id_producto === product.id_producto ||
            c.id_categoria === product.id_categoria)
      ) || null
    );
  };

  const calcularPrecioConDescuento = (precio, cup) => {
    if (!cup) return precio;
    if (cup.tipo === "porcentaje")
      return (precio - precio * (cup.valor / 100)).toFixed(2);
    return (precio - cup.valor).toFixed(2);
  };

  return (
    <div className="w-full md:mt-12">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3 text-center font-semibold">
          {error}
        </div>
      )}

      {categoryInfo?.imagen_url && (
        <div className="w-full mb-6 block md:hidden">
          <img
            src={`https://apidemo.cartavirtual.shop/${categoryInfo.imagen_url}`}
            className="w-full h-48 object-cover rounded-xl"
            alt={categoryInfo.nombre}
          />
        </div>
      )}

      {categoryInfo && (
        <div className="px-4 mb-6">
          <h2 className="text-2xl md:text-4xl font-extrabold">
            {categoryInfo.nombre}
          </h2>

          {categoryInfo.descripcion && (
            <p className="text-base md:text-lg mt-2 opacity-80">
              {categoryInfo.descripcion}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 px-2 sm:px-3">
        {products.map((product) => {
          const cup = obtenerDescuento(product);
          const nuevoPrecio = calcularPrecioConDescuento(product.precio, cup);

          return (
            <div
              key={product.id_producto}
              className={`relative flex flex-col justify-between p-3 w-full rounded-xl border cursor-pointer transition-all ${
                darkMode
                  ? "bg-[#262837] border-gray-700 text-gray-300"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
              onClick={() => openModal(product)}
            >
              {cup && (
                <div className="absolute top-2 right-2 z-20">
                  <div className="bg-white backdrop-blur-sm p-0.5 rounded-full">
                    <TbDiscount2 size={32} className="text-red-600" />
                  </div>
                </div>
              )}

              <img
                src={`https://apidemo.cartavirtual.shop/${product.imagen_url}`}
                alt={product.nombre}
                className="w-36 h-36 md:w-44 md:h-44 object-cover rounded-lg mx-auto"
              />

              <div className="flex flex-col mt-3 flex-grow text-left">
                <h4 className="font-semibold text-base md:text-lg">
                  {product.nombre}
                </h4>

                {cup ? (
                  <div className="mt-1">
                    <p className="text-xs line-through opacity-70">
                      S/ {product.precio}
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-red-500 font-bold">S/ {nuevoPrecio}</p>
                      <span className="text-[10px] text-red-600 font-semibold">
                        ({cup.tipo === "porcentaje" ? `${cup.valor}%` : `-S/ ${cup.valor}`})
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm mt-1">Precio: S/ {product.precio}</p>
                )}
              </div>

              <button
                className="mt-3 w-full py-2 rounded-lg flex justify-center items-center bg-[#F0320C] hover:bg-[#d42c0b] text-white"
                onClick={(e) => {
                  e.stopPropagation();

                  const cup = obtenerDescuento(product);

                  let descuento = 0;
                  if (cup) {
                    descuento =
                      cup.tipo === "porcentaje"
                        ? product.precio * (cup.valor / 100)
                        : parseFloat(cup.valor);
                  }

                  addToCart({
                    ...product,
                    descuento,
                    cupon: cup || null,
                    precioFinal: product.precio - descuento,
                  });
                }}
              >
                <FaShoppingCart size={18} className="mr-2" /> Añadir
              </button>
            </div>
          );
        })}
      </div>

      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={closeModal}
          ></div>

          <div
            className={`fixed right-0 top-0 h-full z-50 overflow-y-auto flex flex-col justify-between ${
              darkMode ? "bg-[#1F1D2B] text-gray-300" : "bg-white text-gray-900"
            } w-full max-w-[420px]`}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 left-4 z-[999] text-black"
            >
              <RiCloseLine size={32} />
            </button>

            <div className="flex flex-col items-center px-6 pt-14">
              <div className="w-full flex justify-center items-center mt-4">
                <img
                  src={`https://apidemo.cartavirtual.shop/${selectedProduct.imagen_url}`}
                  className="max-w-full max-h-[420px] object-contain rounded-2xl"
                />
              </div>

              <div className="w-full mt-5">
                <h4 className="text-2xl font-bold">
                  {selectedProduct.nombre}
                </h4>

                {(() => {
                  const cup = obtenerDescuento(selectedProduct);
                  const nuevoPrecio = calcularPrecioConDescuento(
                    selectedProduct.precio,
                    cup
                  );

                  return cup ? (
                    <div className="mt-4">
                      <p className="line-through text-gray-400 text-sm">
                        S/ {selectedProduct.precio}
                      </p>

                      <div className="flex items-center gap-2">
                        <p className="text-red-600 font-bold text-2xl">
                          S/ {nuevoPrecio}
                        </p>
                        <span className="text-sm text-red-500 font-semibold">
                          ({cup.tipo === "porcentaje"
                            ? `${cup.valor}%`
                            : `-S/ ${cup.valor}`})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xl font-semibold mt-4">
                      S/ {selectedProduct.precio}
                    </p>
                  );
                })()}

                <p className="text-base mt-4 mb-6">
                  {selectedProduct.descripcion}
                </p>
              </div>
            </div>

            <div className="p-5 flex gap-4">
              <button
                className="w-full py-3 rounded-2xl font-medium bg-black text-white"
                onClick={() => {
                  const cup = obtenerDescuento(selectedProduct);

                  let descuento = 0;
                  if (cup) {
                    descuento =
                      cup.tipo === "porcentaje"
                        ? selectedProduct.precio * (cup.valor / 100)
                        : parseFloat(cup.valor);
                  }

                  addToCart({
                    ...selectedProduct,
                    descuento,
                    cupon: cup || null,
                    precioFinal: selectedProduct.precio - descuento,
                  });

                  closeModal();
                }}
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
