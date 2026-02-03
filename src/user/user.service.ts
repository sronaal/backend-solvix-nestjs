import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DataSource, DataSourceOptions } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly dataSource: DataSource
  ) { }



  async create(createUserDto: CreateUserDto) {

    const { role, password, ...rest } = createUserDto

    const rol = await this.rolesService.findByOneName(role!)

    const userCreate = this.userRepository.create({
      ...rest,
      role: rol,
      hash_password: password

    })

    await this.userRepository.save(userCreate)
  }

  findAll() {
    return this.userRepository.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async deleteAllUsers() {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {

      // Elimina todos los registros de la tabla Roles
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(User)
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
