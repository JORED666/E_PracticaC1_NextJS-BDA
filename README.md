
Sistema de gestión y análisis de biblioteca desarrollado con Next.js, TypeScript y PostgreSQL. Implementa un dashboard interactivo con 5 reportes principales basados en vistas SQL optimizadas.

## 🎯 Características

- **5 Reportes interactivos** basados en SQL VIEWS
- **Seguridad** con usuario de solo lectura para la aplicación
- **Docker Compose** para despliegue completo
- **Índices optimizados** para consultas rápidas
- **TypeScript** para type-safety en toda la aplicación

---

## 🗄️ Estructura de la Base de Datos

### Tablas (5)
```sql
members      -- Socios de la biblioteca
books        -- Catálogo de libros
copies       -- Copias físicas de cada libro
loans        -- Registro de préstamos
fines        -- Multas por atrasos
```

---

## 🚀 Instalación y Uso

### Prerequisitos
- Docker y Docker Compose
- Node.js 20+ (solo para desarrollo local sin Docker)

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/JORED666/E_PracticaC1_NextJS-BDA.git
cd E_PracticaC1_NextJS-BDA
```

### Paso 2: Levantar con Docker
```bash
docker compose up --build
```

Esto iniciará:
- **PostgreSQL** en puerto `5433` (cambiado de 5432 para evitar conflictos)
- **Next.js** en puerto `3000`

### Paso 3: Acceder a la aplicación
```
http://localhost:3000
```

### Detener los servicios
```bash
# Ctrl+C en la terminal donde corre
# O en otra terminal:
docker compose down
```

### Limpiar todo (base de datos incluida)
```bash
docker compose down -v
```
---

## 🛠️ Tecnologías

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS
- **Iconos:** Lucide React
- **Base de datos:** PostgreSQL 16
- **ORM:** pg (node-postgres)
- **Contenedores:** Docker + Docker Compose

---
## 📁 Estructura del Proyecto
```
libreria-dashboard/
├── db/                          # scrips SQL
│   ├── schema.sql              # 5 tablas
│   ├── seed.sql                # Datos de prueba
│   ├── reports_vw.sql          # 5 VIEWS obligatorias
│   ├── indexes.sql             # 3 índices optimizados
│   └── roles.sql               # app_user con permisos
├── src/
│   ├── app/                    # Rutas de Next.js (App Router)
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── layout.tsx         # Layout global
│   │   ├── globals.css        # Estilos Tailwind
│   │   └── reports/           # 5 páginas de reportes
│   ├── lib/
│   │   └── db.ts              # conexión con Postgres
│   └── types/
│       └── index.ts
├── public/                     # Archivos estáticos
├── .env.example               # Template de variables de entorno
├── .gitignore                 # Archivos ignorados
├── docker-compose.yml          # orquestación de Postgres y Next.js
├── Dockerfile                  # imagen de Next.js
├── Dockerfile.postgres         # Imagen personalizada de PostgreSQL
├── docker-postgres-init.sh     # Script de inicialización con variables
├── package.json               # Dependencias
├── tsconfig.json              
└── README.md                  
```


