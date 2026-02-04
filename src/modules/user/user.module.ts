import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from '../roles/roles.module';

@Module({

  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
  ],
  exports:[UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
