import { Module } from '@nestjs/common';
import { MasterUsersService } from './master-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterUser } from './entities/master-user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([ MasterUser ])],
  providers: [MasterUsersService],
  exports: [MasterUsersService],
})
export class MasterUsersModule {}
