import { RiHome6Line, RiShoppingBag3Line } from "react-icons/ri";
import { BsShieldCheck } from "react-icons/bs";
import { FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Car from "./Car";

export default function BottomNav({ cart = [], setShowOrder, showOrder, darkMode, setCart }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1F1D2B] shadow-lg z-50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center h-16">
          {/* Inicio */}
          <button 
            className="flex-1 flex flex-col items-center justify-center py-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            onClick={() => navigate('/')}
          >
            <RiHome6Line className="text-2xl" />
            <span className="text-xs mt-1">Inicio</span>
          </button>

          {/* Políticas */}
          <button 
            className="flex-1 flex flex-col items-center justify-center py-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            onClick={() => navigate('/politicas')}
          >
            <BsShieldCheck className="text-2xl" />
            <span className="text-xs mt-1">Políticas</span>
          </button>

          {/* Términos */}
          <button 
            className="flex-1 flex flex-col items-center justify-center py-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            onClick={() => navigate('/terminos')}
          >
            <FaBook className="text-2xl" />
            <span className="text-xs mt-1">Términos</span>
          </button>

          {/* Carrito */}
          <button 
            className="flex-1 flex flex-col items-center justify-center py-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors relative"
            onClick={() => setShowOrder(!showOrder)}
          >
            <RiShoppingBag3Line className="text-2xl" />
            {cart.length > 0 && (
              <span className="absolute -top-1 right-4 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cart.reduce((total, item) => total + (item.cantidad || 0), 0)}
              </span>
            )}
            <span className="text-xs mt-1">Carrito</span>
          </button>
        </div>
      </nav>

      {/* Car Component - Mobile */}
      <Car 
        showOrder={showOrder}
        setShowOrder={setShowOrder}
        cart={cart}
        setCart={setCart}
        darkMode={darkMode}
      />
    </>
  );
}
