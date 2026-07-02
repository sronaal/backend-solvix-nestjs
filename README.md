# Solvix Backend — Sistema de Gestión de Incidentes y Requerimientos IT

**Proyecto de sustentación SENA** — API REST construida con NestJS para la gestión de tickets de soporte técnico, usuarios y comentarios.

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Módulos](#módulos)
- [Endpoints de la API](#endpoints-de-la-api)
- [Modelo de Datos](#modelo-de-datos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Seed de Datos](#seed-de-datos)
- [Análisis de Funcionalidades](#análisis-de-funcionalidades)
  - [Implementado ✅](#implementado-)
  - [Incompleto / Con Bugs ⚠️](#incompleto--con-bugs-️)
  - [No Implementado ❌](#no-implementado-)
- [Roadmap Recomendado](#roadmap-recomendado)

---

## Stack Tecnológico

| Categoría       | Tecnología                          |
| --------------- | ----------------------------------- |
| **Runtime**     | Node.js ≥ 22                        |
| **Framework**   | NestJS 11                           |
| **Lenguaje**    | TypeScript 5                        |
| **Base de Datos** | PostgreSQL                       |
| **ORM**         | TypeORM 0.3                         |
| **Autenticación** | JWT + Passport + bcrypt           |
| **Validación**  | class-validator + class-transformer |
| **Configuración** | @nestjs/config (variables de entorno) |

---

## Arquitectura

```
src/
├── main.ts              # Punto de entrada, bootstrap de NestJS
├── app.module.ts        # Módulo raíz, importa todos los módulos
│
└── modules/
    ├── auth/            # Autenticación JWT (login)
    │   ├── controller, service, module
    │   ├── dto/         # AuthDTO, JWTPayload
    │   ├── entities/    # Auth (entity placeholder — vacía)
    │   └── strategies/  # JwtStrategy (Passport)
    │
    ├── user/            # CRUD de usuarios
    │   ├── controller, service, module
    │   ├── dto/         # CreateUserDto, UpdateUserDto
    │   └── entities/    # User entity
    │
    ├── roles/           # Gestión de roles
    │   ├── controller, service, module
    │   ├── dto/         # CreateRoleDto, UpdateRoleDto
    │   └── entities/    # Role entity
    │
    ├── tickets/         # CRUD de tickets/incidencias
    │   ├── controller, service, module
    │   ├── dto/         # CreateTicketDto, UpdateTicketDto
    │   └── entities/    # Ticket entity
    │
    ├── comentarios/     # Comentarios en tickets
    │   ├── controller, service, module
    │   ├── dto/         # CreateComentarioDto, UpdateComentarioDto
    │   └── entities/    # Comentario entity
    │
    └── seed/            # Población de datos de prueba
        ├── controller, service, module
        └── data/        # data_users.ts (datos de semilla)
```

### Convenciones

- **Prefijo global de API**: `/api/v1/`
- **CORS**: habilitado globalmente
- **Validación global**: ValidationPipe con `whitelist: true` y `forbidNonWhitelisted: true`
- **Base de datos**: PostgreSQL con `synchronize: true` (**solo para desarrollo**)

---

## Módulos

### Auth (`/auth`)
- **`POST /api/v1/auth/login`** — Inicia sesión con correo y contraseña, devuelve JWT + datos del usuario
- Estrategia JWT configurada (Passport), secreto desde variable de entorno `JWT_SECRET`
- Token con expiración de 2 horas

### Users (`/user`)
- **`POST /api/v1/user`** — Crear usuario (valida correo único, hashea contraseña con bcrypt)
- **`GET /api/v1/user`** — Listar todos los usuarios (con rol expandido, sin hash de contraseña)
- **`GET /api/v1/user/:id`** — Buscar usuario por UUID
- **`GET /api/v1/user/correo/:email`** — Buscar por correo electrónico
- **`GET /api/v1/user/rol/:rol`** — Buscar usuarios por rol (ADMIN, TECNICO, SOLICITANTE)

### Roles (`/roles`)
- **`POST /api/v1/roles`** — Crear un rol (evita duplicados por nombre)

### Tickets (`/tickets`)
- **`POST /api/v1/tickets`** — Crear un ticket (asigna solicitante y técnico opcional)
- **`GET /api/v1/tickets`** — Listar todos los tickets con datos expandidos
- **`GET /api/v1/tickets/:id`** — Buscar ticket por número correlativo ⚠️
- **`PATCH /api/v1/tickets/:id`** — Actualizar ticket (título, descripción, estado, técnico, solicitante)

### Comentarios (`/comentarios`)
- **`POST /api/v1/comentarios`** — Agregar comentario a un ticket

### Seed (`/seed`)
- **`POST /api/v1/seed/create`** — Poblar la base de datos con datos de prueba

---

## Modelo de Datos

### User (`users`)
| Campo           | Tipo        | Descripción                    |
| --------------- | ----------- | ------------------------------ |
| id              | UUID (PK)   | Identificador único            |
| nombres         | TEXT        | Nombres del usuario            |
| apellidos       | TEXT        | Apellidos del usuario          |
| correo          | TEXT (UQ)   | Correo electrónico único       |
| hash_password   | TEXT        | Contraseña hasheada con bcrypt |
| activo          | BOOLEAN     | Estado del usuario (default: true) |
| telefono        | TEXT        | Número de teléfono             |
| departamento    | TEXT        | Departamento o área            |
| role            | FK → Role   | Rol del usuario                |
| createdAt       | TIMESTAMP   | Fecha de creación              |
| updatedAt       | TIMESTAMP   | Fecha de actualización         |

### Role (`roles`)
| Campo       | Tipo              | Descripción                    |
| ----------- | ----------------- | ------------------------------ |
| id          | UUID (PK)         | Identificador único            |
| nombre_rol  | ENUM              | ADMIN / TECNICO / SOLICITANTE  |

### Ticket (`tickets`)
| Campo              | Tipo             | Descripción                             |
| ------------------ | ---------------- | --------------------------------------- |
| id                 | UUID (PK)        | Identificador único                     |
| numero_ticket      | INT (UQ)         | Número correlativo del ticket           |
| titulo             | TEXT             | Título de la incidencia                 |
| descripcion        | VARCHAR(500)     | Descripción detallada                   |
| estado             | ENUM             | SIN ASIGNAR / ACTIVO / ESPERA / RESUELTO |
| solicitante        | FK → User        | Usuario que reporta                     |
| tecnico            | FK → User (nullable) | Técnico asignado                    |
| fecha_creado       | TIMESTAMP        | Fecha de creación                       |
| fecha_actualizacion| TIMESTAMP        | Última modificación                     |
| fecha_cierre       | TIMESTAMP (nullable) | Fecha de resolución                  |

### Comentario
| Campo              | Tipo             | Descripción                     |
| ------------------ | ---------------- | ------------------------------- |
| id                 | UUID (PK)        | Identificador único             |
| ticket             | FK → Ticket      | Ticket asociado                 |
| id_usuario         | FK → User        | Autor del comentario            |
| contenido          | TEXT             | Texto del comentario            |
| fecha_creacion     | TIMESTAMP        | Fecha de creación               |
| fecha_actualizacion| TIMESTAMP        | Última modificación             |

---

## Instalación y Configuración

### Prerrequisitos

- Node.js ≥ 22
- PostgreSQL (13+)
- yarn (o npm/pnpm)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd backend-solvix-nestjs

# 2. Instalar dependencias
yarn install

# 3. Crear archivo de variables de entorno
cp .env.example .env
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor (default: 3000)
PORT=3000

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=solvix

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
```

```bash
# 4. Iniciar en modo desarrollo
yarn start:dev

# 5. Poblar base de datos con datos de prueba
curl -X POST http://localhost:3000/api/v1/seed/create
```

### Scripts Disponibles

| Comando               | Descripción                         |
| --------------------- | ----------------------------------- |
| `yarn start`          | Iniciar servidor                    |
| `yarn start:dev`      | Iniciar con hot-reload (watch mode) |
| `yarn start:prod`     | Iniciar desde compilación `dist/`   |
| `yarn build`          | Compilar TypeScript                 |
| `yarn test`           | Ejecutar tests unitarios           |
| `yarn test:e2e`       | Ejecutar tests e2e                  |
| `yarn lint`           | Linter y corrección automática      |
| `yarn migration:generate --name=Nombre` | Generar migración |
| `yarn migration:run`  | Ejecutar migraciones pendientes     |

---

## Seed de Datos

El seed crea:

- **3 roles**: ADMIN, TECNICO, SOLICITANTE
- **20 usuarios** distribuidos entre los 3 roles
- **10 tickets de ejemplo** con técnicos y solicitantes asignados

**Usuarios de prueba creados:**

| Nombre            | Correo                  | Rol        | Contraseña para login        |
| ----------------- | ----------------------- | ---------- | ---------------------------- |
| Carlos Ramírez    | carlos.ramirez@mail.com | ADMIN      | `hash_admin_123`             |
| Laura Gómez       | laura.gomez@mail.com    | TECNICO    | `hash_tecnico_123`           |
| Andrés Pérez      | andres.perez@mail.com   | SOLICITANTE | `hash_solicitante_123`      |

> **Nota**: El seed ejecuta DELETE de todos los registros existentes antes de insertar. Solo para desarrollo.

---

## Análisis de Funcionalidades

### Implementado ✅

| Funcionalidad                         | Estado | Detalle                            |
| ------------------------------------- | ------ | ---------------------------------- |
| Autenticación JWT (login)             | ✅     | Login con JWT + bcrypt, token 2h   |
| Estrategia Passport JWT               | ✅     | Extrae token del Bearer header     |
| CRUD de usuarios (crear, listar, buscar) | ✅  | CRUD parcial, faltan update/delete |
| CRUD de roles (crear)                 | ✅     | Sólo creación implementada         |
| CRUD de tickets (crear, listar, actualizar) | ✅ | CRUD parcial, falta delete       |
| Comentarios en tickets (crear)        | ✅     | Sólo creación                      |
| Validación de datos de entrada        | ✅     | class-validator en todos los DTOs  |
| Semilla de datos (seed)               | ✅     | 3 roles, 20 users, 10 tickets     |
| CORS                                  | ✅     | Habilitado globalmente             |
| Prefijo global de API                 | ✅     | `/api/v1/`                         |

### Incompleto / Con Bugs ⚠️

| Funcionalidad                         | Estado | Problema                                                   |
| ------------------------------------- | ------ | ---------------------------------------------------------- |
| **JWT Strategy validate()**           | ⚠️     | El método `validate()` está **vacío** — no retorna nada, por lo que `request.user` nunca se puebla. Si algún día se pone un guard, rompe. |
| **findOne en TicketsController**      | ⚠️     | Usa `+id` para convertir a número pero la ruta recibe UUIDs — `findOneBy({ numero_ticket: id })` busca por número correlativo, no por UUID. El método `findOneById` para UUID existe en el servicio pero no está expuesto en el controller. |
| **UpdateUserDto sin endpoint**        | ⚠️     | El DTO `UpdateUserDto` existe pero el controller de User no expone `PATCH /user/:id` ni `DELETE /user/:id`. |
| **Seed: contraseñas literales**       | ⚠️     | Las contraseñas del seed se guardan con bcrypt (el hook `@BeforeInsert` las hashea), pero lo que se pasa como "password" son strings literales (`hash_admin_123`). Para login usás esas literales — funcional, pero conceptualmente confuso. |
| **Módulo Auth: entidad vacía**        | ⚠️     | `auth.entity.ts` es `export class Auth {}` — no se usa para nada, debería eliminarse. |
| **CreateRoleDto sin validaciones**    | ⚠️     | No tiene decoradores `@IsString`, `@IsEnum`, etc.          |
| **Manejo de errores inconsistente**   | ⚠️     | Algunos métodos tienen try/catch silencioso, otros propagan excepciones. ComentariosService traga errores sin logging. |

### No Implementado ❌

#### Seguridad y Autorización (CRÍTICO)

| Funcionalidad                          | Prioridad | Detalle |
| -------------------------------------- | --------- | ------- |
| **Guards de autenticación**           | 🔴 Alta   | Ningún endpoint tiene `@UseGuards(AuthGuard())` — **toda la API es pública**. Cualquiera puede crear, listar y modificar datos sin token. |
| **RBAC (Control de acceso por roles)** | 🔴 Alta  | No existe un `RolesGuard` ni decorador `@Roles()`. No hay protecciones por rol. |
| **Refresh Token**                      | 🟡 Media  | JWT expira en 2h sin mecanismo para renovarlo. |

#### CRUD Completo

| Funcionalidad                          | Prioridad | Detalle |
| -------------------------------------- | --------- | ------- |
| **User: actualizar perfil**            | 🟡 Media  | `PATCH /user/:id` no existe |
| **User: cambiar contraseña**           | 🟡 Media  | Endpoint separado para cambio de password |
| **User: eliminar/desactivar**          | 🟡 Media  | `DELETE /user/:id` o `PATCH /user/:id/deactivate` |
| **Roles: listar todos**                | 🟢 Baja   | `GET /roles` para el frontend |
| **Roles: actualizar/eliminar**         | 🟢 Baja   | Gestión completa de roles |
| **Tickets: eliminar**                  | 🟡 Media  | `DELETE /tickets/:id` |
| **Comentarios: listar por ticket**     | 🟡 Media  | `GET /tickets/:id/comentarios` |
| **Comentarios: editar/eliminar**       | 🟢 Baja   | Gestión completa de comentarios |

#### Features del Sistema de Tickets

| Funcionalidad                          | Prioridad | Detalle |
| -------------------------------------- | --------- | ------- |
| **Prioridad de tickets**               | 🟡 Media  | Alta / Media / Baja |
| **Categorías / Clasificación**         | 🟡 Media  | Hardware, Software, Red, etc. |
| **Filtros y búsqueda**                 | 🟡 Media  | Por estado, fecha, técnico, palabra clave |
| **Paginación en listados**             | 🟡 Media  | Listas planas sin paginación |
| **Dashboard / Estadísticas**           | 🟡 Media  | Tickets por estado, por técnico, tiempo de resolución |
| **Historial / Auditoría de cambios**   | 🟡 Media  | Quién cambió qué y cuándo |
| **Notificaciones internas**            | 🟢 Baja   | Al asignar, cambiar estado, comentar |
| **Archivos adjuntos**                  | 🟢 Baja   | Evidencia/screenshots en tickets |
| **SLAs y tiempos de respuesta**        | 🟢 Baja   | Métricas de cumplimiento |

#### Infraestructura y Calidad

| Funcionalidad                          | Prioridad | Detalle |
| -------------------------------------- | --------- | ------- |
| **Tests unitarios (specs)**            | 🔴 Alta   | **No hay ningún** archivo `.spec.ts`. Coverage 0%. |
| **Test e2e personalizado**             | 🔴 Alta   | El test e2e es el default de NestJS ("Hello World!"). |
| **Migraciones de base de datos**       | 🟡 Media  | `synchronize: true` en producción es peligroso. DataSource `./data-source.ts` no existe. |
| **Archivo .env.example**               | 🟢 Baja   | No hay plantilla de variables de entorno. |
| **Documentación Swagger/OpenAPI**      | 🟡 Media  | No hay docs interactivos de la API. |
| **Docker / docker-compose**            | 🟢 Baja   | No hay contenedor para desarrollo. |
| **Rate Limiting (Throttler)**          | 🟡 Media  | Sin protección contra fuerza bruta. |
| **Logging estructurado**               | 🟡 Media  | Usa `console.log` en lugar de Logger de NestJS. |
| **Módulo de notificaciones (email)**   | 🟢 Baja   | Sin envío de correos. |

---

## Roadmap Recomendado

### Fase 1 — Seguridad (Prioridad Máxima)

1. Completar `JwtStrategy.validate()` para que busque el usuario y lo asigne a `request.user`
2. Crear un **JwtAuthGuard** y aplicarlo a **todos los endpoints** con `@UseGuards(AuthGuard('jwt'))`
3. Crear un **RolesGuard** con decorador `@Roles('ADMIN', 'TECNICO')` para proteger rutas por rol
4. Agregar **ThrottlerModule** para rate limiting en login

### Fase 2 — Completar CRUD

5. Agregar `PATCH /user/:id`, `DELETE /user/:id`, `PATCH /user/:id/password`
6. Agregar `GET /roles`, `PATCH /roles/:id`, `DELETE /roles/:id`
7. Arreglar `GET /tickets/:id` para que busque por UUID (no por número)
8. Agregar `DELETE /tickets/:id`
9. Agregar `GET /tickets/:id/comentarios`, `PATCH /comentarios/:id`, `DELETE /comentarios/:id`

### Fase 3 — Calidad y Testing

10. Escribir tests unitarios para servicios (auth, user, tickets)
11. Personalizar test e2e con casos reales (login → CRUD tickets → comentarios)
12. Configurar migraciones con `yarn migration:generate` y cambiar a `synchronize: false`

### Fase 4 — Features del Sistema

13. Agregar prioridad y categoría a tickets
14. Implementar paginación y filtros en listados
15. Endpoint de dashboard con estadísticas
16. Sistema de notificaciones internas

### Fase 5 — Infraestructura

17. Agregar documentación Swagger/OpenAPI
18. Dockerizar la aplicación (Dockerfile + docker-compose con PostgreSQL)
19. Logging con Logger de NestJS

---

## Documentación del Proyecto

Documentación completa del proyecto disponible en:
[Google Drive](https://drive.google.com/file/d/1pUv33vhZdLC0ycEX-EsUtD19uVATX7o2/view?usp=sharing)

---

## Licencia

UNLICENSED — Proyecto privado con fines educativos (SENA).
