import { Test, TestingModule } from '@nestjs/testing';
import { MasterUsersService } from './master-users.service';

describe('MasterUsersService', () => {
  let service: MasterUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterUsersService],
    }).compile();

    service = module.get<MasterUsersService>(MasterUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
