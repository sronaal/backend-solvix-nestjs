import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { SeedModule } from './seed/seed.module';

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
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
