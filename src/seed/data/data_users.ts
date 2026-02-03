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