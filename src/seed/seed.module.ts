import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { RolesModule } from 'src/roles/roles.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [RolesModule, UserModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
