
# 💈 BarberBook Backend

Backend para la gestión de turnos en **peluquerías/barberías**.  
Desarrollado con [NestJS](https://nestjs.com/) y pensado para ser **escalable, seguro y multi-tenant**: cada salón/barbería gestiona sus propios clientes, empleados y servicios de forma aislada.

---

## 🚀 1. Propósito del Proyecto

BarberBook Backend provee una **API robusta** para administrar:

- **Usuarios y roles**: administrador, editor, lector.
- **Clientes** y sus datos.
- **Empleados** y disponibilidad.
- **Servicios** ofrecidos (corte, coloración, peinado, etc.).
- **Turnos (appointments)** con trazabilidad y auditoría.
- Separación de datos por salón/barbería (**multi-tenant**).

Ideal para digitalizar la gestión de reservas y operaciones en salones de belleza.

---

## 🛠️ 2. Tecnologías utilizadas

- [Node.js](https://nodejs.org/) (>= 18.x)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/) / [Prisma](https://www.prisma.io/) (ORM para PostgreSQL)
- [PostgreSQL](https://www.postgresql.org/)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- [Class-validator](https://github.com/typestack/class-validator)

---

## 📦 3. Instalación y configuración

### 3.1 Clonar el repositorio

```bash
git clone https://github.com/<tu-org>/barberbook-backend.git
cd barberbook-backend
```

### 3.2 Instalar dependencias

```bash
npm install
```

### 3.3 Configurar variables de entorno

Por definir

### 3.4 Levantar la base de datos (ejemplo con Docker a futuro)

Por definir

### 3.5 Levantar el servidor en desarrollo

```bash
npm run start:dev
```

Accede a la API en: [http://localhost:3000](http://localhost:3000)

---

## ✅ 4. Dependencias mínimas

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x
- **Docker** (opcional, recomendado para desarrollo)

---

## 📖 5. Scripts útiles

| Script                | Descripción                                 |
|-----------------------|---------------------------------------------|
| `npm run start`       | Inicia el servidor en modo producción       |
| `npm run start:dev`   | Inicia el servidor en modo desarrollo con hot reload |
| `npm run lint`        | Ejecuta ESLint para análisis de código      |
| `npm run format`      | Formatea el código con Prettier             |
| `npm run test`        | Ejecuta los tests unitarios                 |

---

## 👥 6. Colaboradores y contexto

Proyecto académico desarrollado por el **DevTeam BarberBook** en la materia **FIP**.  
Participan estudiantes, tutora y profesora, aplicando buenas prácticas de desarrollo backend y trabajo colaborativo.

---

## 📌 7. Estado del Proyecto

- ✔️ Diseño de base de datos aprobado
- ✔️ Setup inicial con NestJS
- ⬜ Implementación de módulos (`users`, `clients`, `employees`, `services`, `appointments`)
- ⬜ Autenticación y roles
- ⬜ Documentación con alguna tool o framework

---

## 📚 8. Recursos adicionales

- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## 💬 9. Contacto

¿Dudas o sugerencias?  
Abre un issue en el repositorio o contacta al equipo por los canales oficiales de la materia.

---