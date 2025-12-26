import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";

const DiscountToast = () => {
  const [cupones, setCupones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const colores = ["#38b6ff", "#f31b1b", "#773dff", "#6BCB77", "#FF9F1C"];

  const esColorClaro = (hex) => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminancia > 186;
  };

  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/cupon")
      .then((res) => res.json())
      .then((data) => setCupones(data));

    fetch("https://apidemo.cartavirtual.shop/api/producto")
      .then((res) => res.json())
      .then((data) => setProductos(data));

    fetch("https://apidemo.cartavirtual.shop/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data));
  }, []);

  // Auto cerrar cupones después de 15 segundos
  useEffect(() => {
    const timers = cupones.map((cup) =>
      setTimeout(() => {
        setCupones((prev) => prev.filter((c) => c.codigo !== cup.codigo));
      }, 15000)
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, [cupones]);

  const handleClose = (codigo) => {
    setCupones((prev) => prev.filter((c) => c.codigo !== codigo));
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  if (cupones.length === 0) return null;

  return (
    <div className="fixed top-2 right-0 z-[9999] flex flex-col space-y-2">
      <AnimatePresence>
        {cupones.map((cup) => {
          const valor =
            cup.tipo === "monto"
              ? `S/. ${parseFloat(cup.valor).toFixed(2)}`
              : `${parseFloat(cup.valor)}%`;

          let nombre = "CUALQUIER PRODUCTO";
          if (cup.id_producto) {
            const prod = productos.find((p) => p.id_producto === cup.id_producto);
            if (prod) nombre = prod.nombre.toUpperCase();
          } else if (cup.id_categoria) {
            const cat = categorias.find((c) => c.id_categoria === cup.id_categoria);
            if (cat) nombre = cat.nombre.toUpperCase();
          }

          const colorFondo =
            colores[Math.floor(Math.random() * colores.length)];
          const colorTexto = esColorClaro(colorFondo) ? "#222" : "#fff";

          return (
            <motion.div
              key={cup.codigo}
              initial={{ opacity: 0, y: -50, x: 100 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -50, x: 100 }}
              transition={{ duration: 0.3 }}
              className="flex items-stretch w-[260px] shadow-md rounded-l-xl overflow-hidden"
              style={{ backgroundColor: colorFondo, marginRight: 0 }}
            >
              {/* Contenido principal */}
              <div className="flex-1 flex flex-col justify-center items-center py-1.5 px-2 text-center">
                <p
                  className="font-extrabold text-xl notable-regular"
                  style={{ color: colorTexto }}
                >
                  DESCUENTO
                </p>
                <p
                  className="text-[10px] mt-0.5 font-semibold truncate whitespace-nowrap"
                  style={{ color: colorTexto }}
                >
                  EN {nombre}
                </p>

                {/* Código del cupón */}
                <div
                  className="mt-1 rounded-md px-3 py-1 font-extrabold text-base tracking-wide inline-block martian-mono"
                  style={{ color: "#fafafaff" }}
                >
                  {cup.codigo}
                </div>

                <p
                  className="text-[9px] mt-0.5 opacity-75 truncate whitespace-nowrap"
                  style={{ color: colorTexto }}
                >
                  Válido hasta {formatFecha(cup.fecha_fin)}
                </p>
              </div>

              {/* Franja blanca con bordes de cuadrados del mismo color que fondo */}
              <div
                className="bg-white w-8 flex items-center justify-center relative"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      to bottom,
                      ${colorFondo} 0,
                      ${colorFondo} 12px,
                      transparent 10px,
                      transparent 20px
                    ),
                    repeating-linear-gradient(
                      to bottom,
                      ${colorFondo} 0,
                      ${colorFondo} 12px,
                      transparent 10px,
                      transparent 20px
                    )
                  `,
                  backgroundPosition: "left, right",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "5px 100%, 5px 100%",
                }}
              >
                <p
                  className="font-extrabold text-xs tracking-widest"
                  style={{
                    color: "#111111",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    letterSpacing: "1.5px",
                  }}
                >
                  {valor}
                </p>
              </div>

              {/* Franja derecha para botón */}
              <div
                className="w-7 flex items-center justify-center relative"
                style={{ backgroundColor: colorFondo }}
              >
                <button
                  onClick={() => handleClose(cup.codigo)}
                  className="p-1 hover:brightness-90 rounded-full transition"
                >
                  <RiCloseLine className="text-white text-lg" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default DiscountToast;
