import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { RolesModule } from 'src/roles/roles.module';
import { UserModule } from 'src/user/user.module';
import { TicketsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [RolesModule, UserModule, TicketsModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
