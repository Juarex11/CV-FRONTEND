import React, { useEffect, useState } from "react";
import { FaBox, FaTags, FaTicketAlt, FaClock } from "react-icons/fa";
import CountUp from "./js/CountUp";

const StatCard = () => {
  const [stats, setStats] = useState({
    productos: 0,
    categorias: 0,
    cupones: 0,
  });
  const [currentTime, setCurrentTime] = useState("");

  // 🕒 Actualizar hora en tiempo real
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 📦 Obtener datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, categoriasRes, cuponesRes] = await Promise.all([
          fetch("https://apidemo.cartavirtual.shop/api/producto"),
          fetch("https://apidemo.cartavirtual.shop/api/categorias"),
          fetch("https://apidemo.cartavirtual.shop/api/cupon"),
        ]);

        const productosData = await productosRes.json();
        const categoriasData = await categoriasRes.json();
        const cuponesData = await cuponesRes.json();

        setStats({
          productos: Array.isArray(productosData) ? productosData.length : 0,
          categorias: Array.isArray(categoriasData) ? categoriasData.length : 0,
          cupones: Array.isArray(cuponesData) ? cuponesData.length : 0,
        });
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  // 💡 Tarjetas
  const cards = [
    {
      title: "Productos",
      value: stats.productos,
      icon: <FaBox size={45} />,
      iconColor: "bg-gray-800",
    },
    {
      title: "Categorías",
      value: stats.categorias,
      icon: <FaTags size={45} />,
      iconColor: "bg-blue-500",
    },
    {
      title: "Cupones",
      value: stats.cupones,
      icon: <FaTicketAlt size={45} />,
      iconColor: "bg-green-500",
    },
    {
      title: "Hora actual",
      value: currentTime,
      icon: <FaClock size={45} />,
      iconColor: "bg-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((stat, index) => (
        <div
          key={index}
          className="relative bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-center h-[115px]"
        >
          <div className="flex items-center">
            <div
              className={`w-1/4 flex items-center justify-center p-3 rounded-lg text-white ${stat.iconColor} shadow-md`}
            >
              {stat.icon}
            </div>
            <div className="ml-4 flex flex-col justify-center">
              <span className="text-sm font-medium text-gray-500">{stat.title}</span>
              <span className="text-2xl font-bold text-gray-900">
                {typeof stat.value === "number" ? (
                  <CountUp
                    from={0}
                    to={stat.value}
                    separator=","
                    direction="up"
                    duration={1.2}
                    className="count-up-text"
                  />
                ) : (
                  stat.value
                )}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCard;
