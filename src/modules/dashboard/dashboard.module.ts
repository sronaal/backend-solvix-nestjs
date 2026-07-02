import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TicketsModule } from '../tickets/tickets.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TicketsModule, UserModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
