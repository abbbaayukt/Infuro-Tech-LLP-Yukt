import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RolesService } from '../roles/roles.service';
import { TenantContext } from '../common/context/tenant.context';
import { TenantsService } from '../tenants/tenants.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly tenantContext: TenantContext,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;

    const tenant = await this.tenantsService.findByName( registerDto.tenant );

  if (!tenant) {
      throw new UnauthorizedException(
          'Invalid tenant',
      );
  }

  this.tenantContext.setSchema(
      tenant.schemaName,
  );

  const existingUser =
      await this.usersService.findByUsername(
          registerDto.username, registerDto.tenant)

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = await this.rolesService.findByName('USER');

    if (!userRole) {
      throw new Error('USER role not found');
    }

    const user = await this.usersService.createUser(
      username,
      hashedPassword,
      userRole,
    );

    return {
      id: user.id,
      username: user.username,
    };
  }

  async login(loginDto: LoginDto) {
    const { tenant, username, password } = loginDto;

    const Tenant = await this.tenantsService.findByName(tenant);

    if (!Tenant) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.usersService.findByUsername( username, Tenant.id );
    if (!user){
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      username: user.username,
      roleId: user.role.id,
      roleName: user.role.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }
}