import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from 'src/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/modules/roles/roles.module';
import { SeedModule } from 'src/modules/seed/seed.module';
import { TicketsModule } from 'src/modules/tickets/tickets.module';
import { AuthModule } from './modules/auth/auth.module';
import { ComentariosModule } from './modules/comentarios/comentarios.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),    
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      autoLoadEntities: true,
      synchronize: true,
      migrations:['src/migrations/.*ts']
    }),
    UserModule,
    RolesModule,
    SeedModule,
    TicketsModule,
    AuthModule,
    ComentariosModule
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
