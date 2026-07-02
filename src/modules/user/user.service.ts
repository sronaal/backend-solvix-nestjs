import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly rolesService: RolesService,
    private readonly dataSource: DataSource
  ) { }



  async create(createUserDto: CreateUserDto) {

    const { role, password, ...rest } = createUserDto

    const rol = await this.rolesService.findByOneName(role!)


    const existingUser = await this.userRepository.findOneBy({ correo: rest.correo });
    if (existingUser) {
      throw new ConflictException(`El correo ${rest.correo} ya está registrado`);
    }

    try {
      const userCreate = this.userRepository.create({
        ...rest,
        role: rol,
        hash_password: password
      })

      await this.userRepository.save(userCreate)
      return this.sanitizeUser(userCreate);
    } catch (error) {
      this.handleErrors(error)
    }

  }

  async findAll() {
    let users = await this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.role', 'roles')
      .select([
        "users.id",
        "users.nombres",
        "users.apellidos",
        "users.correo",
        "users.activo",
        "users.telefono",
        "users.departamento",
        "roles.nombre_rol"
      ])
      .getMany()

    let usersData = users.map(user => ({
      "id": user.id,
      "nombres": user.nombres,
      "apellidos": user.apellidos,
      "correo": user.correo,
      "telefono": user.telefono,
      "departamento": user.departamento,
      "rol": user.role.nombre_rol,
      "activo": user.activo,


    })
    )

    return usersData
  }

  async findUserByCorreoForAuth(correo: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .select([
        'user.id',
        'user.nombres',
        'user.apellidos',
        'user.correo',
        'user.hash_password',
        'user.activo',
        'role.nombre_rol'
      ])
      .where('user.correo = :correo', { correo })
      .getOne();
    if (!user) throw new NotFoundException(`User with email ${correo} not found`)
    return user;
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return user;
  }

  async findOne(id: string) {
    let user = await this.userRepository.findOneBy({ id: id })
    if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    return user
  }

  async findUserByRol(rol: string) {
    const role = await this.roleRepository.findOne({
      where: { nombre_rol: rol }
    });

    if (!role) {
      throw new NotFoundException(`Rol con nombre ${rol} no encontrado`);
    }

    const users = await this.userRepository.find({
      where: {
        role: { id: role.id }
      },
      relations: ['role']
    });

    return users;
  }

  async update(id: string, updateDto: UpdateUserDto) {
    const user = await this.findUserById(id);

    if (updateDto.role) {
      const rol = await this.rolesService.findByOneName(updateDto.role);
      user.role = rol;
    }

    if (updateDto.nombres) user.nombres = updateDto.nombres;
    if (updateDto.apellidos) user.apellidos = updateDto.apellidos;
    if (updateDto.correo) user.correo = updateDto.correo;
    if (updateDto.telefono !== undefined) user.telefono = updateDto.telefono;
    if (updateDto.departamento) user.departamento = updateDto.departamento;
    if (updateDto.activo !== undefined) user.activo = updateDto.activo;

    await this.userRepository.save(user);
    return this.sanitizeUser(user);
  }

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    // Necesitamos el hash_password que está con select: false
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.hash_password')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);

    const isMatch = await bcrypt.compare(currentPassword, user.hash_password);
    if (!isMatch) throw new BadRequestException('La contraseña actual no es correcta');

    user.hash_password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    return { mensaje: 'Contraseña actualizada correctamente' };
  }

  async deactivate(id: string) {
    const user = await this.findOne(id);
    user.activo = false;
    await this.userRepository.save(user);
    return { mensaje: 'Usuario desactivado correctamente' };
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { mensaje: `Usuario ${user.nombres} ${user.apellidos} eliminado correctamente` };
  }

  async deleteAllUsers() {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(User)
        .execute()

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      this.logger.error(`Error al eliminar usuarios: ${error.message}`, error.stack)
    } finally {
      await queryRunner.release()
    }
  }

  private sanitizeUser(user: User) {
    const { hash_password, ...safeUser } = user;
    return safeUser;
  }

  private handleErrors(error) {
    if (error instanceof ConflictException || error instanceof NotFoundException) {
      throw error;
    }
    if (error.code === '23505') {
      throw new ConflictException('El correo ya está registrado');
    }
    this.logger.error(`Error inesperado: ${error.message}`, error.stack);
    throw error;
  }
}
