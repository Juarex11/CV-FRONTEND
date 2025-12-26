import React, { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { IoIosArrowBack } from "react-icons/io";
import { FaPlusCircle, FaMinusCircle, FaWhatsapp } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const Car = ({ showOrder, setShowOrder, darkMode, cart, setCart }) => {
  const bgCard = darkMode ? "bg-[#1F1D2B]" : "bg-white";
  const bgProduct = darkMode ? "bg-[#262837]" : "bg-gray-100";
  const textDefault = darkMode ? "text-gray-300" : "text-gray-900";

  const [paso, setPaso] = useState(1);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [tipoEntrega, setTipoEntrega] = useState("recojo");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mesa, setMesa] = useState("");
  const [observacion, setObservacion] = useState("");

  const increaseQty = (id) =>
    setCart((prev) =>
      prev.map((p) =>
        p.id_producto === id ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );

  const decreaseQty = (id) =>
    setCart((prev) =>
      prev.map((p) =>
        p.id_producto === id && p.cantidad > 1
          ? { ...p, cantidad: p.cantidad - 1 }
          : p
      )
    );

  const removeProduct = (id) =>
    setCart((prev) => prev.filter((p) => p.id_producto !== id));

  const subtotal = cart
    .reduce(
      (acc, p) =>
        acc + (Number(p.precio) - Number(p.descuento || 0)) * p.cantidad,
      0
    )
    .toFixed(2);

  const showToast = (icon, message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const enviarPedido = async () => {
    if (!nombre || !telefono)
      return showToast("error", "Complete nombre y teléfono");

    // Validación del teléfono (9 dígitos)
    if (!/^\d{9}$/.test(telefono)) {
      return showToast("error", "Ingrese un teléfono válido de 9 dígitos");
    }

    let mensaje = `*Nuevo Pedido*%0A%0A`;

    mensaje += `Nombre: ${nombre}%0A`;
    mensaje += `Teléfono: ${telefono}%0A`;
    mensaje += `Pago: ${metodoPago}%0A`;
    mensaje += `Entrega: ${tipoEntrega}%0A`;

    if (tipoEntrega === "delivery") mensaje += `Dirección: ${direccion}%0A`;
    else mensaje += `Mesa: ${mesa}%0A`;

    if (observacion) mensaje += `Obs: ${observacion}%0A`;

    mensaje += `%0A--- Productos --- %0A`;

    cart.forEach((p) => {
      const precioFinal = Number(p.precio) - Number(p.descuento || 0);
      mensaje += `• ${p.nombre} x${p.cantidad} - S/. ${(precioFinal * p.cantidad).toFixed(2)}%0A`;
    });

    mensaje += `%0ATotal: S/. ${subtotal}`;

    const res = await fetch(
      "https://apidemo.cartavirtual.shop/api/empresa"
    );
    const data = await res.json();
    let telefonoEmpresa = String(data.telefono || "").replace(/\D/g, "");

    if (!telefonoEmpresa.startsWith("51"))
      telefonoEmpresa = "51" + telefonoEmpresa;

    window.open(
      `https://wa.me/${telefonoEmpresa}?text=${mensaje}`,
      "_blank"
    );
  };

  return (
    <div
      className={`lg:col-span-2 fixed top-0 ${bgCard} w-full lg:w-96 lg:right-0 h-full transition-all z-50 ${
        showOrder ? "right-0" : "-right-full"
      }`}
    >
      <div
        className={`relative pt-16 lg:pt-8 p-6 h-full flex flex-col overflow-hidden ${textDefault}`}
      >
        <RiCloseLine
          onClick={() => setShowOrder(false)}
          className="lg:hidden absolute left-4 top-4 p-3 box-content rounded-full text-xl"
        />

        <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
          {paso === 2 && (
            <IoIosArrowBack
              onClick={() => setPaso(1)}
              size={26}
              className="cursor-pointer hover:scale-110 transition"
            />
          )}
          {paso === 1 ? "Mi Carrito" : "Método de pago y entrega"}
        </h1>

        <div
          className={`flex-1 ${
            cart.length === 0 ? "overflow-hidden" : "overflow-y-auto"
          } pr-2`}
          style={{ paddingBottom: cart.length === 0 ? "0px" : "140px" }}
        >
          {paso === 1 && cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src="/hamburguesa.gif"
                className="w-40 h-40 object-contain mb-4"
                alt="Carrito vacío"
              />
              <p className="text-lg font-semibold opacity-80">
                Tu Carro está vacío
              </p>
            </div>
          )}

          {paso === 1 && cart.length > 0 && (
            <>
              {cart.map((product) => {
                const precioUnidad = Number(product.precio) || 0;
                const precioConDescuentoUnidad =
                  Number(product.precio) - Number(product.descuento || 0);
                const totalProducto =
                  precioConDescuentoUnidad * product.cantidad;

                return (
                  <div
                    key={product.id_producto}
                    className={`${bgProduct} p-4 rounded-xl flex flex-col gap-3 mb-3`}
                  >
                    <div className="flex gap-4">
                      <img
                        src={`https://apidemo.cartavirtual.shop/${product.imagen_url}`}
                        className="w-28 h-24 object-cover rounded-lg"
                        alt={product.nombre}
                      />

                      <div className="flex flex-col justify-between">
                        <p className="font-bold text-lg">{product.nombre}</p>

                        {product.descuento ? (
                          <div className="flex flex-col">
                            <p className="font-bold text-green-500">
                              S/. {precioConDescuentoUnidad.toFixed(2)} x Und
                            </p>

                            <p className="font-bold mt-1">
                              Total: S/. {totalProducto.toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm opacity-80">
                              S/. {precioUnidad.toFixed(2)} x Und
                            </p>
                            <p className="font-bold">
                              Total: S/. {(precioUnidad * product.cantidad).toFixed(2)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button onClick={() => increaseQty(product.id_producto)}>
                        <FaPlusCircle size={22} />
                      </button>
                      <span className="px-3 py-1 bg-black text-white rounded-lg text-lg font-semibold">
                        {product.cantidad}
                      </span>
                      <button onClick={() => decreaseQty(product.id_producto)}>
                        <FaMinusCircle size={22} />
                      </button>

                      <button
                        onClick={() => removeProduct(product.id_producto)}
                        className="bg-red-600 text-white py-1 px-4 rounded-full ml-4 font-semibold hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {paso === 2 && (
            <div className={`${bgProduct} p-4 rounded-lg`}>
              <h2 className="font-semibold mb-2">Método de pago</h2>

              <div className="flex flex-wrap gap-3 mb-3">
                {[
                  { id: "efectivo", img: "/metodos/efectivo.png" },
                  { id: "yape", img: "/metodos/yape.webp" },
                  { id: "plin", img: "/metodos/plin.png" },
                  { id: "tarjeta", img: "/metodos/tarjeta.png" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMetodoPago(m.id)}
                    className={`p-2 rounded-lg transition ${
                      metodoPago === m.id
                        ? "bg-white border-2 border-orange-500"
                        : "bg-gray-100 border-2 border-transparent"
                    }`}
                  >
                    <img src={m.img} className="w-10 h-10" alt={m.id} />
                  </button>
                ))}
              </div>

              <h2 className="font-semibold mb-2">Tipo de entrega</h2>

              <div className="flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      tipoEntrega === "recojo"
                        ? "/tienda.png"
                        : "/delivery.png"
                    }
                    className="w-7 h-7"
                    alt=""
                  />
                  <span className="font-medium">
                    {tipoEntrega === "recojo"
                      ? "Recoger en tienda"
                      : "Enviar a domicilio"}
                  </span>
                </div>

                <div
                  onClick={() =>
                    setTipoEntrega(
                      tipoEntrega === "recojo" ? "delivery" : "recojo"
                    )
                  }
                  className={`relative w-12 h-6 rounded-full cursor-pointer ${
                    tipoEntrega === "delivery"
                      ? "bg-orange-500"
                      : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`absolute bg-white w-5 h-5 rounded-full shadow-md transform ${
                      tipoEntrega === "delivery"
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); 
                  if (value.length <= 9) setTelefono(value);
                }}

                  className="border rounded-lg px-3 py-2 text-sm"
                />

                {tipoEntrega === "delivery" ? (
                  <input
                    type="text"
                    placeholder="Dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <input
                    type="number" 
                    min="1"
                    placeholder="Mesa"
                    value={mesa}
                    onChange={(e) => {
                    const valor = e.target.value;
                    if (valor === "" || Number(valor) >= 1) {
                      setMesa(valor);
                    }
                    }}
                    onKeyDown={(e) => {
                      if (["-", "e", "+", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="border rounded-lg px-3 py-2 text-sm"
                  />
                )}

                <textarea
                  placeholder="Observación"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full p-4 bg-white shadow-2xl flex flex-col gap-3">
            {paso === 1 ? (
              <button
                onClick={() => setPaso(2)}
                className="bg-[#F0320C] w-full py-3 rounded-lg text-white font-semibold"
              >
                Seguir pedido
              </button>
            ) : (
              <button
                onClick={enviarPedido}
                className="bg-[#25D366] w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-3"
              >
                <FaWhatsapp size={24} />
                Enviar pedido (S/. {subtotal})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Car;
