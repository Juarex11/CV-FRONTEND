import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

const CartMobile = ({ show, onClose, cart, setCart, darkMode }) => {
  const bgCard = darkMode ? "bg-[#1F1D2B]" : "bg-white";
  const bgProduct = darkMode ? "bg-[#262837]" : "bg-gray-100";
  const textDefault = darkMode ? "text-gray-300" : "text-gray-900";
  const textGray = darkMode ? "text-gray-500" : "text-gray-700";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";

  const [cupones, setCupones] = useState([]);
  const [couponCodes, setCouponCodes] = useState({});
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [tipoEntrega, setTipoEntrega] = useState("delivery");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mesa, setMesa] = useState("");
  const [observacion, setObservacion] = useState("");
  const [telefonoEmpresa, setTelefonoEmpresa] = useState("");

  useEffect(() => {
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
      prev
        .map((p) =>
          p.id_producto === id
            ? { ...p, cantidad: p.cantidad > 1 ? p.cantidad - 1 : 1 }
            : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id_producto !== id));
  };

  const getTotal = () => {
    return cart
      .reduce((total, item) => total + item.precio * item.cantidad, 0)
      .toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar datos del formulario
    if (!nombre || !telefono || (tipoEntrega === 'delivery' && !direccion) || (tipoEntrega === 'mesa' && !mesa)) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }
    
    // Aquí iría la lógica para enviar el pedido
    const pedido = {
      productos: cart.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio: item.precio,
        nombre: item.nombre
      })),
      total: getTotal(),
      metodo_pago: metodoPago,
      tipo_entrega: tipoEntrega,
      cliente: {
        nombre,
        telefono,
        direccion: tipoEntrega === 'delivery' ? direccion : '',
        mesa: tipoEntrega === 'mesa' ? mesa : ''
      },
      observacion
    };

    console.log('Enviando pedido:', pedido);
    alert('Pedido enviado con éxito. Nos pondremos en contacto contigo pronto.');
    setCart([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween' }}
          className="fixed inset-0 bg-black bg-opacity-50 z-[9999] lg:hidden"
          onClick={onClose}
        >
          <motion.div 
            className={`absolute right-0 top-0 h-full w-full max-w-sm ${bgCard} shadow-xl overflow-y-auto z-[10000]`}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-inherit z-10">
              <h2 className="text-xl font-bold">Tu Pedido</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <RiCloseLine className="text-2xl" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center py-8">Tu carrito está vacío</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Lista de productos */}
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                    {cart.map((item) => (
                      <div 
                        key={item.id_producto} 
                        className={`flex items-center p-3 rounded-lg ${bgProduct}`}
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{item.nombre}</h3>
                          <p className="text-sm text-gray-500">S/ {item.precio.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              decreaseQty(item.id_producto);
                            }}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <FaMinusCircle />
                          </button>
                          <span className="w-8 text-center">{item.cantidad}</span>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              increaseQty(item.id_producto);
                            }}
                            className="text-gray-500 hover:text-green-500"
                          >
                            <FaPlusCircle />
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFromCart(item.id_producto);
                            }}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <RiCloseLine />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Información del cliente */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre *</label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Teléfono *</label>
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de entrega</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="tipoEntrega"
                            checked={tipoEntrega === 'delivery'}
                            onChange={() => setTipoEntrega('delivery')}
                            className="mr-2"
                          />
                          Delivery
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="tipoEntrega"
                            checked={tipoEntrega === 'mesa'}
                            onChange={() => setTipoEntrega('mesa')}
                            className="mr-2"
                          />
                          Recoger en tienda
                        </label>
                      </div>
                    </div>

                    {tipoEntrega === 'delivery' ? (
                      <div>
                        <label className="block text-sm font-medium mb-1">Dirección *</label>
                        <input
                          type="text"
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                          required={tipoEntrega === 'delivery'}
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium mb-1">Número de mesa *</label>
                        <input
                          type="text"
                          value={mesa}
                          onChange={(e) => setMesa(e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                          required={tipoEntrega === 'mesa'}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1">Método de pago</label>
                      <select
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Observaciones</label>
                      <textarea
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                        rows="2"
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                      ></textarea>
                    </div>
                  </div>

                  {/* Resumen y botón de pago */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-lg">S/ {getTotal()}</span>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Realizar Pedido
                    </button>
                    
                    {telefonoEmpresa && (
                      <div className="mt-4 text-center text-sm text-gray-500">
                        ¿Necesitas ayuda? Llámanos: {telefonoEmpresa}
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartMobile;
