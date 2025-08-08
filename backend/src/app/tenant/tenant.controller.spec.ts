import { Test, TestingModule } from '@nestjs/testing';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { UnitService } from '../unit/unit.service';
import { DatabaseService } from '../../database/database.service';

describe('TenantController', () => {
  let controller: TenantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        TenantService,
        { provide: UnitService, useValue: { findOne: jest.fn() } },
        { provide: DatabaseService, useValue: { getDb: jest.fn() } },
      ],
    }).compile();

    controller = module.get<TenantController>(TenantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
