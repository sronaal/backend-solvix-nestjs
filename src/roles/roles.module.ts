import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from '../roles/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([Role])
  ],
  exports:[
    TypeOrmModule,
    RolesService
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
