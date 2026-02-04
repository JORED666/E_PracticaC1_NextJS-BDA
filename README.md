# 📚 Sistema de Biblioteca - Dashboard de Reportes

Sistema de gestión y análisis de biblioteca desarrollado con Next.js, TypeScript y PostgreSQL. Implementa un dashboard interactivo con 5 reportes principales basados en vistas SQL optimizadas.

## 🎯 Características

- **5 Reportes interactivos** basados en SQL VIEWS
- **Seguridad** con usuario de solo lectura para la aplicación
- **Docker Compose** para despliegue completo
- **Índices optimizados** para consultas rápidas
- **TypeScript** para type-safety en toda la aplicación

---

## 📊 Reportes Disponibles

### 1. Libros más prestados
- Ranking de popularidad con Window Functions 
- Muestra libros actualmente prestados vs completados

### 2. Préstamos vencidos
- Lista de libros no devueltos a tiempo
- Calcula días de atraso y multa sugerida con 
- Usa CTE para cálculos complejos

### 3. Resumen de multas
- Análisis mensual de multas pagadas vs pendientes
- Agrupa con `DATE_TRUNC` y `GROUP BY`
- Calcula tasa de pago con porcentajes
- **VIEW:** `vw_fines_summary`

### 4. Actividad de socios
- Estadísticas de préstamos por usuario
- Categorización con `CASE` (Excelente, Bueno, Regular)
- Usa `COALESCE` para valores nulos
- **VIEW:** `vw_member_activity`

### 5. Salud del inventario
- Estado de disponibilidad por categoría
- Porcentajes de libros disponibles, prestados, dañados y perdidos
- Indicadores de salud con `CASE`
- **VIEW:** `vw_inventory_health`

## 🗄️ Estructura de la Base de Datos

### Tablas (5)
```sql
members      -- Socios de la biblioteca
books        -- Catálogo de libros
copies       -- Copias físicas de cada libro
loans        -- Registro de préstamos
fines        -- Multas por atrasos
```

### Relaciones
- `copies` → `books` (FK: book_id)
- `loans` → `copies` (FK: copy_id)
- `loans` → `members` (FK: member_id)
- `fines` → `loans` (FK: loan_id)

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
├── db/                          # Scripts SQL
│   ├── schema.sql              # Definición de tablas (5 tablas)
│   ├── seed.sql                # Datos de prueba
│   ├── reports_vw.sql          # 5 VIEWS obligatorias
│   ├── indexes.sql             # 3 índices optimizados
│   └── roles.sql               # Usuario app_user con permisos
├── src/
│   ├── app/                    # Rutas de Next.js (App Router)
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── layout.tsx         # Layout global
│   │   ├── globals.css        # Estilos Tailwind
│   │   └── reports/           # 5 páginas de reportes
│   │       ├── most-borrowed/page.tsx
│   │       ├── overdue-loans/page.tsx
│   │       ├── fines-summary/page.tsx
│   │       ├── member-activity/page.tsx
│   │       └── inventory-health/page.tsx
│   ├── lib/
│   │   └── db.ts              # Conexión PostgreSQL (pool)
│   └── types/
│       └── index.ts           # Tipos TypeScript
├── public/                     # Archivos estáticos
├── docker-compose.yml          # Orquestación (Postgres + Next.js)
├── Dockerfile                  # Imagen de Next.js
├── package.json               # Dependencias
├── tsconfig.json              # Configuración TypeScript
└── README.md                  # Documentación
```
