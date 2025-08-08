import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { UnitModule } from '../unit/unit.module';
import { PropertyModule } from '../property/property.module';

@Module({
  imports: [UnitModule, PropertyModule],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
