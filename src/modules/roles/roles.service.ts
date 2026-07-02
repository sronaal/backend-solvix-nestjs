import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RolesService {

  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private readonly rolRepository: Repository<Role>,
    private readonly dataSource: DataSource
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    
    const nombre = createRoleDto.nombre_rol.toUpperCase();
    const existingRole = await this.rolRepository.findOne({
      where: { nombre_rol: nombre }
    })

    if (existingRole) {
      throw new ConflictException(`El rol ${nombre} ya existe`);
    }

    const newRole = this.rolRepository.create({ nombre_rol: nombre })
    return await this.rolRepository.save(newRole)
  }

  async findAll() {
    return this.rolRepository.find();
  }

  async findOne(id: string) {
    const rol = await this.rolRepository.findOneBy({ id });
    if (!rol) throw new NotFoundException(`Rol con id ${id} no encontrado`);
    return rol;
  }

  async findByOneName(name: string) {
    const rol = await this.rolRepository.findOneBy({ nombre_rol: name })
    if (!rol) throw new NotFoundException(`Rol con nombre ${name} no encontrado`)
    return rol
  }

  async update(id: string, updateDto: UpdateRoleDto) {
    const rol = await this.findOne(id);
    
    if (updateDto.nombre_rol) {
      const nombre = updateDto.nombre_rol.toUpperCase();
      const existing = await this.rolRepository.findOne({ where: { nombre_rol: nombre } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`El rol ${nombre} ya existe`);
      }
      rol.nombre_rol = nombre;
    }

    await this.rolRepository.save(rol);
    return rol;
  }

  async remove(id: string) {
    const rol = await this.findOne(id);
    await this.rolRepository.remove(rol);
    return { mensaje: `Rol ${rol.nombre_rol} eliminado correctamente` };
  }

  async deteleAllRoles() {

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Role)
        .execute()

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      this.logger.error(`Error al eliminar roles: ${error.message}`, error.stack)
    } finally {
      await queryRunner.release()
    }
  }


}
