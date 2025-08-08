import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { UnitService } from '../unit/unit.service';
import { DatabaseService } from '../../database/database.service';

describe('TenantService', () => {
  let service: TenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        { provide: UnitService, useValue: { findOne: jest.fn() } },
        { provide: DatabaseService, useValue: { getDb: jest.fn() } },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
