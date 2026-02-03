import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private readonly rolRepository : Repository<Role>
  ){}

  create(createRoleDto: CreateRoleDto) {
    const roles = this.rolRepository.create(createRoleDto);

    return this.rolRepository.save(roles)
  }

  
}
