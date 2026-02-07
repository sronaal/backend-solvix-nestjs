import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/modules/roles/roles.module';
import { SeedModule } from 'src/modules/seed/seed.module';
import { TicketsModule } from 'src/modules/tickets/tickets.module';
import { AuthModule } from './modules/auth/auth.module';
import { ComentariosModule } from './comentarios/comentarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),    
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule,
    RolesModule,
    SeedModule,
    TicketsModule,
    AuthModule,
    ComentariosModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
