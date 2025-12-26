import React, { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

const Car = ({ showOrder, setShowOrder, darkMode, cart, setCart }) => {
  const bgCard = darkMode ? "bg-[#1F1D2B]" : "bg-white";
  const bgProduct = darkMode ? "bg-[#262837]" : "bg-gray-100";
  const textDefault = darkMode ? "text-gray-300" : "text-gray-900";
  const textGray = darkMode ? "text-gray-500" : "text-gray-700";

  const [cupones, setCupones] = useState([]);
  const [couponCodes, setCouponCodes] = useState({});
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [tipoEntrega, setTipoEntrega] = useState("delivery");

  // Datos del cliente
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mesa, setMesa] = useState("");
  const [observacion, setObservacion] = useState("");

  // 📞 Teléfono de la empresa desde la API
  const [telefonoEmpresa, setTelefonoEmpresa] = useState("");

  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/cupon")
      .then((res) => res.json())
      .then((data) => setCupones(data))
      .catch((err) => console.error("Error al obtener cupones:", err));

    // Obtener teléfono de la empresa
    fetch("https://apidemo.cartavirtual.shop/api/empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.telefono) {
          setTelefonoEmpresa(data.telefono);
        }
      })
      .catch((err) => console.error("Error al obtener empresa:", err));
  }, []);

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id_producto === id ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id_producto === id && p.cantidad > 1
          ? { ...p, cantidad: p.cantidad - 1 }
          : p
      )
    );
  };

  const removeProduct = (id) => {
    setCart((prev) => prev.filter((p) => p.id_producto !== id));
  };

  const applyCoupon = (codigo, product) => {
    const cupon = cupones.find((c) => c.codigo === codigo && c.estado);

    if (!cupon) {
      alert("Cupón inválido o inactivo");
      return;
    }

    const hoy = new Date();
    const inicio = new Date(cupon.fecha_inicio);
    const fin = new Date(cupon.fecha_fin);
    if (hoy < inicio || hoy > fin) {
      alert("Cupón expirado o aún no disponible");
      return;
    }

    if (cupon.id_producto && cupon.id_producto !== product.id_producto) {
      alert("Cupón no aplica a este producto");
      return;
    }
    if (cupon.id_categoria && cupon.id_categoria !== product.id_categoria) {
      alert("Cupón no aplica a esta categoría");
      return;
    }

    let descuento = 0;
    if (cupon.tipo === "porcentaje") {
      descuento = (product.precio * cupon.valor) / 100;
    } else if (cupon.tipo === "monto") {
      descuento = parseFloat(cupon.valor);
    }

    setCart((prev) =>
      prev.map((p) =>
        p.id_producto === product.id_producto ? { ...p, cupon, descuento } : p
      )
    );

    alert(`Cupón aplicado: ${codigo}`);
  };

  const subtotal = cart
    .reduce((acc, p) => acc + (p.precio * p.cantidad - (p.descuento || 0)), 0)
    .toFixed(2);

  const enviarPedido = () => {
    if (!nombre || !telefono) {
      alert("Por favor complete nombre y teléfono.");
      return;
    }

    if (!telefonoEmpresa) {
      alert("No se encontró el número de la empresa.");
      return;
    }

    let mensaje = `*Nuevo Pedido*%0A%0A`;
    mensaje += `Nombre: ${nombre}%0A Teléfono: ${telefono}%0A`;
    mensaje += `Método de pago: ${metodoPago}%0A`;
    mensaje += `Entrega: ${tipoEntrega}%0A`;

    if (tipoEntrega === "delivery") {
      mensaje += `Dirección: ${direccion}%0A`;
    } else {
      mensaje += `Mesa: ${mesa}%0A`;
    }

    if (observacion) mensaje += `Observación: ${observacion}%0A`;

    mensaje += `%0A--- Productos --- %0A`;
    cart.forEach((p) => {
      mensaje += `• ${p.nombre} x${p.cantidad} - S/.${(
        p.precio * p.cantidad -
        (p.descuento || 0)
      ).toFixed(2)}%0A`;
      if (p.cupon) mensaje += `   Cupón: ${p.cupon.codigo}%0A`;
    });

    mensaje += `%0ATotal: S/. ${subtotal}`;

    // Usa el teléfono de la API
    const url = `https://wa.me/51${telefonoEmpresa}?text=${mensaje}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className={`lg:col-span-2 fixed top-0 ${bgCard} w-full lg:w-96 lg:right-0 h-full transition-all z-50 ${
        showOrder ? "right-0" : "-right-full"
      }`}
    >
      <div
        className={`relative pt-16 lg:pt-8 p-6 h-full flex flex-col ${textDefault}`}
      >
        <RiCloseLine
          onClick={() => setShowOrder(false)}
          className={`lg:hidden absolute left-4 top-4 p-3 box-content rounded-full text-xl ${textDefault}`}
        />
        <h1 className="text-2xl font-bold mb-4">Mi Carrito</h1>

        {/* Lista de productos con scroll */}
        <div
          className="flex-1 overflow-y-auto pr-2 mb-6"
          style={{ maxHeight: "260px" }}
        >
          {cart.map((product) => (
            <div
              key={product.id_producto}
              className={`${bgProduct} p-4 rounded-xl flex flex-col gap-3 mb-3`}
            >
              <div className="flex gap-4 items-center">
                <img
                  src={`https://apidemo.cartavirtual.shop/${product.imagen_url}`}
                  className="w-28 h-24 object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                  alt={product.nombre}
                />
                <div className="flex flex-col justify-between">
                  <h5 className="text-base font-semibold">{product.nombre}</h5>
                  <p className="font-bold">S/. {product.precio}</p>
                  {product.descuento ? (
                    <p className="text-green-500 text-sm">
                      Descuento: -S/. {product.descuento.toFixed(2)}
                    </p>
                  ) : null}
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

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Cupón"
                  value={couponCodes[product.id_producto] || ""}
                  onChange={(e) =>
                    setCouponCodes((prev) => ({
                      ...prev,
                      [product.id_producto]: e.target.value,
                    }))
                  }
                  className="flex-1 border rounded-lg px-2 py-1 text-sm"
                />
                <button
                  onClick={() =>
                    applyCoupon(couponCodes[product.id_producto], product)
                  }
                  className="bg-[#F0320C] text-white px-3 py-1 rounded-lg text-sm"
                >
                  Aplicar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Métodos de pago */}
        <div className={`${bgProduct} p-4 rounded-lg mb-4`}>
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
                className={`p-2 rounded-lg transition-transform transform hover:scale-120 ${
                  metodoPago === m.id ? "bg-[#ffff]" : "bg-gray-100"
                }`}
              >
                <img
                  src={m.img}
                  alt={m.id}
                  className="w-10 h-10 object-contain"
                />
              </button>
            ))}
          </div>

          <h2 className="font-semibold mb-2">Tipo de entrega</h2>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setTipoEntrega("delivery")}
              className={`px-3 py-1 rounded-lg ${
                tipoEntrega === "delivery"
                  ? "bg-[#ec7c6a] text-white"
                  : "bg-gray-200"
              }`}
            >
              Delivery
            </button>
            <button
              onClick={() => setTipoEntrega("recojo")}
              className={`px-3 py-1 rounded-lg ${
                tipoEntrega === "recojo"
                  ? "bg-[#ec7c6a] text-white"
                  : "bg-gray-200"
              }`}
            >
              Recojo en tienda
            </button>
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
              onChange={(e) => setTelefono(e.target.value)}
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
                type="text"
                placeholder="Número de mesa"
                value={mesa}
                onChange={(e) => setMesa(e.target.value)}
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

        {/* Resumen */}
        <div className={`${bgProduct} p-4 rounded-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${textGray}`}>Descuento total</span>
            <span>
              -S/.{" "}
              {cart
                .reduce((acc, p) => acc + (p.descuento || 0), 0)
                .toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className={`${textGray}`}>Subtotal</span>
            <span>S/. {subtotal}</span>
          </div>
          <button
            onClick={enviarPedido}
            className="bg-[#ec7c6a] w-full py-2 px-4 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Enviar pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Car;
