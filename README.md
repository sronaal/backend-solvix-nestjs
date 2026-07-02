# Solvix Backend — Sistema de Gestión de Incidentes y Requerimientos IT

**Proyecto de sustentación SENA** — API REST construida con NestJS para la gestión de tickets de soporte técnico, usuarios y comentarios.

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Módulos y Endpoints](#módulos-y-endpoints)
- [Seguridad](#seguridad)
- [Modelo de Datos](#modelo-de-datos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Seed de Datos](#seed-de-datos)
- [Pendientes](#pendientes)

---

## Stack Tecnológico

| Categoría            | Tecnología                              |
| -------------------- | --------------------------------------- |
| **Runtime**          | Node.js ≥ 22                            |
| **Framework**        | NestJS 11                               |
| **Lenguaje**         | TypeScript 5                            |
| **Base de Datos**    | PostgreSQL                              |
| **ORM**              | TypeORM 0.3                             |
| **Autenticación**    | JWT + Passport + bcrypt                 |
| **Validación**       | class-validator + class-transformer     |
| **Configuración**    | @nestjs/config (variables de entorno)   |

---

## Arquitectura

```
src/
├── main.ts                   # Bootstrap, CORS, ValidationPipe global
├── app.module.ts             # Módulo raíz con guards globales
│
├── common/                   # Cross-cutting (compartido entre módulos)
│   ├── decorators/
│   │   ├── public.decorator.ts      # @Public() — salta el JWT guard
│   │   ├── roles.decorator.ts       # @Roles('ADMIN') — control de acceso
│   │   └── current-user.decorator.ts # @CurrentUser() — inyecta usuario
│   └── guards/
│       ├── jwt-auth.guard.ts        # JWT guard global
│       └── roles.guard.ts           # RBAC guard global
│
└── modules/
    ├── auth/                 # Autenticación JWT
    ├── user/                 # CRUD de usuarios
    ├── roles/                # CRUD de roles
    ├── tickets/              # CRUD de tickets con filtros y paginación
    ├── comentarios/          # CRUD de comentarios en tickets
    ├── dashboard/            # Estadísticas y dashboards
    └── seed/                 # Población de datos de prueba
```

### Convenciones

- **Prefijo global**: `/api/v1/`
- **CORS**: habilitado globalmente
- **Validación global**: ValidationPipe con `whitelist`, `forbidNonWhitelisted`, y `transform`
- **Paginación por defecto**: 10 resultados por página
- **Autenticación**: JWT en header `Authorization: Bearer <token>`

---

## Módulos y Endpoints

### Auth (`/api/v1/auth`)
| Método  | Ruta            | Auth     | Descripción                          |
| ------- | --------------- | -------- | ------------------------------------ |
| `POST`  | `/auth/login`   | Público  | Inicia sesión, devuelve JWT + datos  |
| `POST`  | `/auth/verify`  | Público  | Verifica token actual                |

- JWT con expiración de 2 horas
- Contraseñas hasheadas con bcrypt
- Login devuelve: `id`, `nombre_usuario`, `rol`, `activo`, `token`

---

### Users (`/api/v1/user`)
| Método  | Ruta                  | Auth     | Roles              | Descripción                     |
| ------- | --------------------- | -------- | ------------------ | ------------------------------- |
| `POST`  | `/user`               | JWT      | ADMIN              | Crear usuario                   |
| `GET`   | `/user`               | JWT      | ADMIN, TECNICO     | Listar todos                    |
| `GET`   | `/user/:id`           | JWT      | ADMIN, TECNICO     | Buscar por UUID                 |
| `GET`   | `/user/correo/:email` | JWT      | ADMIN, TECNICO     | Buscar por email                |
| `GET`   | `/user/rol/:rol`      | JWT      | ADMIN, TECNICO     | Buscar por rol                  |
| `PATCH` | `/user/:id`           | JWT      | ADMIN              | Actualizar perfil               |
| `PATCH` | `/user/:id/password`  | JWT      | Cualquiera         | Cambiar contraseña              |
| `PATCH` | `/user/:id/deactivate`| JWT      | ADMIN              | Desactivar usuario              |
| `DELETE`| `/user/:id`           | JWT      | ADMIN              | Eliminar usuario                |

---

### Roles (`/api/v1/roles`)
| Método  | Ruta           | Auth     | Roles  | Descripción                     |
| ------- | -------------- | -------- | ------ | ------------------------------- |
| `POST`  | `/roles`       | JWT      | ADMIN  | Crear rol                       |
| `GET`   | `/roles`       | JWT      | ADMIN  | Listar todos                    |
| `GET`   | `/roles/:id`   | JWT      | ADMIN  | Buscar por UUID                 |
| `PATCH` | `/roles/:id`   | JWT      | ADMIN  | Actualizar rol                  |
| `DELETE`| `/roles/:id`   | JWT      | ADMIN  | Eliminar rol                    |

- Roles disponibles: `ADMIN`, `TECNICO`, `SOLICITANTE`

---

### Tickets (`/api/v1/tickets`)
| Método  | Ruta                  | Auth     | Roles              | Descripción                      |
| ------- | --------------------- | -------- | ------------------ | -------------------------------- |
| `POST`  | `/tickets`            | JWT      | Cualquiera         | Crear ticket                     |
| `GET`   | `/tickets`            | JWT      | Cualquiera         | Listar con filtros y paginación  |
| `GET`   | `/tickets/:id`        | JWT      | Cualquiera         | Buscar por UUID                  |
| `GET`   | `/tickets/numero/:nro`| JWT      | Cualquiera         | Buscar por número correlativo    |
| `PATCH` | `/tickets/:id`        | JWT      | Cualquiera         | Actualizar ticket                |
| `DELETE`| `/tickets/:id`        | JWT      | ADMIN, TECNICO     | Eliminar ticket                  |

**Parámetros de consulta (GET /tickets):**
| Parámetro    | Tipo   | Descripción                                    |
| ------------ | ------ | ---------------------------------------------- |
| `estado`     | enum   | SIN ASIGNAR, ACTIVO, ESPERA, RESUELTO          |
| `prioridad`  | enum   | BAJA, MEDIA, ALTA, CRITICA                     |
| `categoria`  | string | Filtro por categoría                           |
| `tecnico`    | UUID   | ID del técnico asignado                        |
| `solicitante`| UUID   | ID del solicitante                             |
| `search`     | string | Búsqueda en título y descripción               |
| `page`       | number | Número de página (default: 1)                  |
| `limit`      | number | Resultados por página (default: 10)            |

---

### Comentarios (`/api/v1/comentarios`)
| Método  | Ruta                          | Auth     | Roles          | Descripción                    |
| ------- | ----------------------------- | -------- | -------------- | ------------------------------ |
| `POST`  | `/comentarios`                | JWT      | Cualquiera     | Agregar comentario             |
| `GET`   | `/comentarios/ticket/:ticketId` | JWT    | Cualquiera     | Listar comentarios de un ticket|
| `PATCH` | `/comentarios/:id`            | JWT      | ADMIN, TECNICO | Editar comentario              |
| `DELETE`| `/comentarios/:id`            | JWT      | ADMIN          | Eliminar comentario            |

---

### Dashboard (`/api/v1/dashboard`)
| Método  | Ruta              | Auth     | Roles          | Descripción                          |
| ------- | ----------------- | -------- | -------------- | ------------------------------------ |
| `GET`   | `/dashboard/stats`| JWT      | ADMIN, TECNICO | Estadísticas completas del sistema   |

**Respuesta de ejemplo:**
```json
{
  "totalTickets": 10,
  "activeTickets": 5,
  "resolvedTickets": 2,
  "unassignedTickets": 1,
  "ticketsByPriority": { "baja": 2, "media": 4, "alta": 3, "critica": 1 },
  "ticketsByStatus": { "sin_asignar": 1, "activo": 5, "espera": 2, "resuelto": 2 },
  "ticketsByCategory": [
    { "categoria": "Hardware", "count": 3 }
  ],
  "ticketsByTechnician": [
    { "id": "uuid", "nombre": "Laura Gómez", "count": 4 }
  ],
  "avgResolutionTime": 24.5,
  "recentTickets": [ ... ]
}
```

---

### Seed (`/api/v1/seed`)
| Método  | Ruta            | Auth     | Descripción                              |
| ------- | --------------- | -------- | ---------------------------------------- |
| `POST`  | `/seed/create`  | JWT      | Poblar DB con datos de prueba (borra todo antes) |

---

## Seguridad

### Esquema de Autenticación

1. **JwtAuthGuard global**: toda la API requiere token JWT por defecto
2. **@Public()**: endpoints puntuales (`/auth/login`, `/auth/verify`) se marcan como públicos
3. **JWT Strategy**: valida el token, busca el usuario en DB, verifica que esté activo, y popula `request.user`

### Control de Acceso (RBAC)

- **RolesGuard global** con decorador `@Roles('ADMIN', 'TECNICO')`
- Tres niveles: `ADMIN` (todo), `TECNICO` (gestión de tickets), `SOLICITANTE` (crear y ver tickets)
- Sin `@Roles()` = cualquier usuario autenticado

### Flujo de Login

```
POST /api/v1/auth/login { correo, password }
  → Valida credenciales contra bcrypt
  → Genera JWT con payload: { id, activo, rol }
  → Devuelve token + datos del usuario

Headers para requests autenticados:
  Authorization: Bearer <token>
```

---

## Modelo de Datos

### User (`users`)
| Campo           | Tipo        | Descripción                       |
| --------------- | ----------- | --------------------------------- |
| id              | UUID (PK)   | Identificador único               |
| nombres         | TEXT        | Nombres del usuario               |
| apellidos       | TEXT        | Apellidos del usuario             |
| correo          | TEXT (UQ)   | Correo electrónico único          |
| hash_password   | TEXT        | Contraseña hasheada con bcrypt    |
| activo          | BOOLEAN     | Estado del usuario (default: true)|
| telefono        | TEXT        | Número de teléfono                |
| departamento    | TEXT        | Departamento o área               |
| role            | FK → Role   | Rol del usuario                   |
| createdAt       | TIMESTAMP   | Fecha de creación                 |
| updatedAt       | TIMESTAMP   | Fecha de actualización            |

### Role (`roles`)
| Campo       | Tipo              | Descripción                     |
| ----------- | ----------------- | ------------------------------- |
| id          | UUID (PK)         | Identificador único             |
| nombre_rol  | ENUM              | ADMIN, TECNICO, SOLICITANTE     |

### Ticket (`tickets`)
| Campo              | Tipo                 | Descripción                              |
| ------------------ | -------------------- | ---------------------------------------- |
| id                 | UUID (PK)            | Identificador único                      |
| numero_ticket      | INT (UQ)             | Número correlativo del ticket            |
| titulo             | TEXT                 | Título de la incidencia                  |
| descripcion        | VARCHAR(500)         | Descripción detallada                    |
| estado             | ENUM                 | SIN ASIGNAR, ACTIVO, ESPERA, RESUELTO    |
| prioridad          | ENUM                 | BAJA, MEDIA, ALTA, CRITICA               |
| categoria          | VARCHAR(100) nullable| Categoría (Hardware, Software, Red, etc) |
| solicitante        | FK → User            | Usuario que reporta                      |
| tecnico            | FK → User (nullable) | Técnico asignado                         |
| fecha_creado       | TIMESTAMP            | Fecha de creación                        |
| fecha_actualizacion| TIMESTAMP            | Última modificación                      |
| fecha_cierre       | TIMESTAMP (nullable) | Fecha de resolución                      |

### Comentario
| Campo              | Tipo             | Descripción                      |
| ------------------ | ---------------- | -------------------------------- |
| id                 | UUID (PK)        | Identificador único              |
| ticket             | FK → Ticket      | Ticket asociado                  |
| id_usuario         | FK → User        | Autor del comentario             |
| contenido          | TEXT             | Texto del comentario             |
| fecha_creacion     | TIMESTAMP        | Fecha de creación                |
| fecha_actualizacion| TIMESTAMP        | Última modificación              |

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
# Editar .env con tus credenciales de PostgreSQL
```

### Variables de Entorno

| Variable      | Descripción              | Default               |
| ------------- | ------------------------ | --------------------- |
| `PORT`        | Puerto del servidor      | `3000`                |
| `DB_HOST`     | Host de PostgreSQL       | `localhost`           |
| `DB_PORT`     | Puerto de PostgreSQL     | `5432`                |
| `DB_USERNAME` | Usuario de PostgreSQL    | `postgres`            |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `postgres`            |
| `DB_NAME`     | Nombre de la base de datos| `solvix`             |
| `JWT_SECRET`  | Secreto para firmar JWT  | *(requerido)*         |

```bash
# 4. Iniciar en modo desarrollo
yarn start:dev

# 5. Poblar base de datos con datos de prueba
curl -X POST http://localhost:3000/api/v1/seed/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>"
```

> **Nota**: El seed requiere token JWT de un ADMIN. Primero obtené el token:
> ```bash
> curl -X POST http://localhost:3000/api/v1/auth/login \
>   -H "Content-Type: application/json" \
>   -d '{"correo":"carlos.ramirez@mail.com","password":"hash_admin_123"}'
> ```

### Scripts Disponibles

| Comando               | Descripción                         |
| --------------------- | ----------------------------------- |
| `yarn start`          | Iniciar servidor                    |
| `yarn start:dev`      | Iniciar con hot-reload (watch mode) |
| `yarn start:prod`     | Iniciar desde compilación `dist/`   |
| `yarn build`          | Compilar TypeScript                 |
| `yarn test`           | Ejecutar tests unitarios            |
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

**Usuarios de prueba:**

| Nombre         | Correo                    | Rol         | Contraseña              |
| -------------- | ------------------------- | ----------- | ----------------------- |
| Carlos Ramírez | carlos.ramirez@mail.com   | ADMIN       | `hash_admin_123`        |
| Laura Gómez    | laura.gomez@mail.com      | TECNICO     | `hash_tecnico_123`      |
| Andrés Pérez   | andres.perez@mail.com     | SOLICITANTE | `hash_solicitante_123`  |

> ⚠️ El seed borra todos los registros existentes antes de insertar. Solo para desarrollo.

---

## Pendientes

| Funcionalidad                        | Estado |
| ------------------------------------ | ------ |
| Tests unitarios (specs)              | ❌     |
| Tests e2e personalizados             | ❌     |
| Migraciones (cambiar a synchronize: false) | ❌ |
| Refresh token                        | ❌     |
| Rate limiting (Throttler)            | ❌     |
| Documentación Swagger/OpenAPI        | ❌     |
| Docker / docker-compose              | ❌     |
| Módulo de notificaciones (email)     | ❌     |
| Historial de cambios / Auditoría     | ❌     |
| Archivos adjuntos                    | ❌     |

---

## Documentación del Proyecto

Documentación completa disponible en:
[Google Drive](https://drive.google.com/file/d/1pUv33vhZdLC0ycEX-EsUtD19uVATX7o2/view?usp=sharing)

---

## Licencia

UNLICENSED — Proyecto privado con fines educativos (SENA).
