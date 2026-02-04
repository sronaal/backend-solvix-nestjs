import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private readonly rolRepository: Repository<Role>,
    private readonly dataSource: DataSource
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    
    
    const existingRole = await this.rolRepository.findOne({
      where: {nombre_rol: createRoleDto.nombre_rol.toUpperCase() }
    })

    if(existingRole) return existingRole

    const newRole = this.rolRepository.create(createRoleDto)
    return await this.rolRepository.save(newRole)
  }

  async findByOneName(name: string){

    const rol = await this.rolRepository.findOneBy({nombre_rol: name})
  
    if(!rol) throw new NotFoundException(`Rol with name ${name} not found`)

    return rol
  }


  async deteleAllRoles() {

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {

      // Elimina todos los registros de la tabla Roles
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Role)
        .execute()

      await queryRunner.commitTransaction()

    } catch (error) {

      await queryRunner.rollbackTransaction()
      console.log(error)
    } finally {
      await queryRunner.release()
    }
  }


}
