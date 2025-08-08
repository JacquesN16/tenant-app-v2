import { DatabaseService } from '../../database/database.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UnitService } from './unit.service';

describe('UnitService', () => {
  let service: UnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitService,
        { provide: DatabaseService, useValue: { getDb: jest.fn() } },
      ],
    }).compile();

    service = module.get<UnitService>(UnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
