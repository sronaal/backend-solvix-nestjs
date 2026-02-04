// Interfaz local para evitar importar la Entidad real
interface SeedUser {
  nombres: string;
  apellidos: string;
  correo: string;
  hash_password: string;
  activo: boolean;
  telefono: string;
  departamento: string;
  roleName: string; // Usamos un string plano para el nombre del rol
}


interface SeedTicket {
  numero: number;
  titulo: string;
  descripcion: string;
  solicitante?: string
  tecnico?: string
}

export const ROLES_SEED = [
  'ADMIN',
  'TECNICO',
  'SOLICITANTE',
];

export const USERS_SEED: SeedUser[] = [
  {
    nombres: 'Carlos',
    apellidos: 'Ramírez',
    correo: 'carlos.ramirez@mail.com',
    hash_password: 'hash_admin_123',
    activo: true,
    telefono: '3001111111',
    departamento: 'TI',
    roleName: 'ADMIN',
  },
  {
    nombres: 'Laura',
    apellidos: 'Gómez',
    correo: 'laura.gomez@mail.com',
    hash_password: 'hash_tecnico_123',
    activo: true,
    telefono: '3002222222',
    departamento: 'Soporte',
    roleName: 'TECNICO',
  },
  {
    nombres: 'Andrés',
    apellidos: 'Pérez',
    correo: 'andres.perez@mail.com',
    hash_password: 'hash_solicitante_123',
    activo: true,
    telefono: '3003333333',
    departamento: 'Compras',
    roleName: 'SOLICITANTE',
  },
  // Generación de los 17 restantes
  ...Array.from({ length: 17 }, (_, i): SeedUser => ({
    nombres: `Usuario${i + 1}`,
    apellidos: 'Prueba',
    correo: `usuario${i + 1}@mail.com`,
    hash_password: `password_seguro_${i + 1}`,
    activo: true,
    telefono: `30100000${i}`,
    departamento: 'General',
    roleName: i % 3 === 0 ? 'ADMIN' : i % 3 === 1 ? 'TECNICO' : 'SOLICITANTE',
  })),
];

export const TICKETS_SEED: SeedTicket[] = [
  {
    numero: 1001,
    titulo: 'Error de conexión VPN',
    descripcion: 'El usuario no puede conectarse a la red interna desde su casa.',
  },
  {
    numero: 1002,
    titulo: 'Instalación de Node.js',
    descripcion: 'Se requiere la versión 20 de Node.js para el proyecto nuevo.',
  },
  {
    numero: 1003,
    titulo: 'Teclado no funciona',
    descripcion: 'Varias teclas no responden en el equipo portátil asignado.',
  },
  {
    numero: 1004,
    titulo: 'Reseteo de contraseña ERP',
    descripcion: 'El usuario bloqueó su cuenta tras varios intentos fallidos.',
  },
  {
    numero: 1005,
    titulo: 'Lentitud en el sistema de ventas',
    descripcion: 'El sistema tarda más de 30 segundos en cargar los reportes mensuales.',
  },
  // Generación automática de los 5 restantes para completar 10
  ...Array.from({ length: 5 }, (_, i): SeedTicket => ({
    numero: 1006 + i,
    titulo: `Ticket de soporte sistema #${i + 6}`,
    descripcion: `Incidencia técnica detectada automáticamente en el módulo ${i + 1}.`,
  })),
];