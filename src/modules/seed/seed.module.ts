import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { RolesModule } from '../roles/roles.module';
import { UserModule } from '../user/user.module';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [RolesModule, UserModule, TicketsModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
