import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignOptions } from 'jsonwebtoken';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { TenantsModule } from 'src/tenants/tenants.module';
import { ContextModule } from 'src/common/context/context.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    TenantsModule,
    PermissionsModule,
    RolesModule,
    ContextModule,
    JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: {
            expiresIn: configService.getOrThrow<SignOptions['expiresIn']>(
      'JWT_EXPIRES_IN',
      ),
        },
    }),
}),
    ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
