# Proyecto Frontend - Carta Virtual

Sistema para un restaurante o cadena de comida rápida.  
Permite a los usuarios navegar entre diferentes categorías, ver productos, aplicar cupones, agregar al carrito y hacer pedidos de forma sencilla desde cualquier dispositivo.

---

## 🧱 Estructura del proyecto

```
├── public/             # Imágenes
├── src/                        # Código fuente principal de la aplicación
│   ├── assets/                 # Archivos multimedia: imágenes, íconos, fuentes, etc.
│   │
│   ├── components/             # Componentes reutilizables de la interfaz
│   │   ├── js/                 # Componentes funcionales en JSX
│   │   └── shared/             # Componentes compartidos (cabecera, sidebar, etc.)
│   │      ├── AdminHeader.jsx
│   │      ├── AdminSidebar.jsx
│   │      ├── BottomNav.jsx
│   │      ├── Car.jsx
│   │      ├── Car1.jsx
│   │      ├── Card.jsx
│   │      ├── CardMobile.jsx
│   │      ├── Header.jsx
│   │      └── Sidebar.jsx
│   │
│   ├── pages/                  # Páginas o vistas completas
│   │   ├── admin/              # Sección del área administrativa
│   │   │   ├── categorias
│   │   │   ├── productos
│   │   │   └── etc             # Más carpetas de las secciones de admin
│   │   ├── home/               # Vista principal
│   │   │   ├── home.jsx
│   │   │   ├── politica.jsx
│   │   │   └── terminos.jsx
│   │   └── login/              # Páginas de autenticación/login
│   │       └── ...             
│   │
│   ├── App.jsx                 # Componente raíz: define rutas y layout global
│   ├── index.css               # Estilos globales o base de la aplicación
│   └── main.jsx                # Punto de entrada: monta la app en el DOM
│
├── .gitignore                  # Archivos/carpetas ignorados por Git
├── package.json                # Dependencias y scripts del proyecto
├── package-lock.json           # Bloqueo de versiones exactas de dependencias
├── postcss.config.cjs          # Configuración de PostCSS (usado por Tailwind CSS)
├── tailwind.config.cjs         # Configuración de Tailwind CSS
├── vite.config.js              # Configuración de Vite (build y servidor dev)
├── yarn.lock                   # Bloqueo de dependencias (si se usa Yarn)
└── README.md                   # Documentación principal del proyecto
```

---

## ⚙️ Instalación y Configuración

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/AdrianMamani/Burger-frontend-.git
   ```

2. **Entra al proyecto:**
   ```bash
   cd frontend
   ```

3. **Instala las dependencias:**
   ```bash
   npm install
   ```
   o si prefieres Yarn:
   ```bash
   yarn
   ```

4. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 📦 Dependencias principales

| Dependencia | Descripción |
|--------------|-------------|
| **React** | Biblioteca para construir interfaces de usuario interactivas |
| **Vite** | Herramienta de desarrollo rápida para proyectos con React |
| **Tailwind CSS** | Framework de utilidades para estilos rápidos y responsivos |
| **React Icons** | Iconos personalizables para React |
| **Framer Motion** | Animaciones fluidas y declarativas para React |
| **React Router DOM** | Enrutamiento de vistas dentro de la aplicación |
| **Axios / Fetch API** | Comunicación con API backend |
| **Lucide React** | Íconos modernos y minimalistas para UI |

---

💡 *Este proyecto usa Vite + React + TailwindCSS para ofrecer una experiencia rápida, modular y responsive.*
