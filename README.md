
# BarberBook Backend

Backend para la gestión de turnos en **peluquerías/barberías**.  
Desarrollado con [NestJS](https://nestjs.com/) y pensado para ser **escalable, seguro y multi-tenant**: cada salón/barbería gestiona sus propios clientes, empleados y servicios de forma aislada.

---

## 1. Propósito del Proyecto

BarberBook Backend provee una **API robusta** para administrar:

- **Usuarios y roles**: administrador, editor, lector.
- **Clientes** y sus datos.
- **Empleados** y disponibilidad.
- **Servicios** ofrecidos (corte, coloración, peinado, etc.).
- **Turnos (appointments)** con trazabilidad y auditoría.
- Separación de datos por salón/barbería (**multi-tenant**).

Ideal para digitalizar la gestión de reservas y operaciones en salones de belleza.

---

## 2. Tecnologías utilizadas

- [Node.js](https://nodejs.org/) (>= 18.x)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/) / [Prisma](https://www.prisma.io/) (ORM para PostgreSQL)
- [PostgreSQL](https://www.postgresql.org/)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- [Class-validator](https://github.com/typestack/class-validator)

---

## 3. Instalación y configuración

### 3.1 Clonar el repositorio

```bash
git clone https://github.com/JereStorm/barberbook-backend.git
cd barberbook-backend
```

### 3.2 Instalar dependencias

```bash
npm install
```

### 3.3 Configurar variables de entorno

Crear archivo .env en la raiz del proyecto con las siguientes variables:

```bash
DB_HOST = -Tu Host-
DB_PORT = -Tu Port-
DB_USERNAME = -Tu Username- 
DB_PASSWORD = -Tu Password-
DB_NAME = barberbook
DB_TYPE = mysql
```

### 3.4 Configurar variables de Autenticacion

```bash
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_min_32_chars
JWT_EXPIRE=24h
```

### 3.4 Levantar la base de datos (ejemplo con Workbench)

Crear schema llamado "barberbook"

### 3.5 Levantar el servidor en desarrollo

```bash
npm run start:dev
```

Accede a la API en: [http://localhost:3001](http://localhost:3001)

---

## 4. Dependencias mínimas

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x
- **Docker** (opcional, recomendado para desarrollo)

---

## 5. Scripts útiles

| Script                | Descripción                                 |
|-----------------------|---------------------------------------------|
| `npm run start`       | Inicia el servidor en modo producción       |
| `npm run start:dev`   | Inicia el servidor en modo desarrollo con hot reload |
| `npm run lint`        | Ejecuta ESLint para análisis de código      |
| `npm run format`      | Formatea el código con Prettier             |
| `npm run test`        | Ejecuta los tests unitarios                 |

---

## 6. Colaboradores y contexto

Proyecto académico desarrollado por el **DevTeam BarberBook** en la materia **FIP y PROG**.  
Participan estudiantes, tutora y profesora, aplicando buenas prácticas de desarrollo backend y trabajo colaborativo.

---

## Documentación y recursos

* 📑 [Presentación en Canva](https://www.canva.com/design/DAGiN-Z6BJY/7ekvPEv_fIHH8W8yAe-MTA/edit)
* 📁 [Google Drive](https://drive.google.com/drive/folders/1iNgk87ktPxIVHVjKhX8JX5RhkVyxDoiI?usp=sharing)
* 🗂 [Jira – Gestión del proyecto](https://proyecto-fip-grupo-28.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)
* 🎨 [Figma – Maquetado UI](https://www.figma.com/design/sir4f0X1vRGK2TuaSeaMiT/Maquetado-React?node-id=0-1&t=T793I8xwPOGGrltI-1)
* [Postman](https://solar-station-957438.postman.co/workspace/My-Workspace~c3bd3ea0-6871-4e10-867e-49ea4891ec47/collection/21908760-0eb112fc-d643-4811-92ab-9a5df88f1abe?action=share&creator=21908760)

---

## 7. Recursos adicionales

- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## 8. Contacto

¿Dudas o sugerencias?  
Abrí un issue en el repositorio o contacta al equipo por los canales oficiales de la materia.

---
