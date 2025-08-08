import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PropertyModule } from '../property/property.module';
import { TenantModule } from '../tenant/tenant.module';
import { UnitModule } from '../unit/unit.module';
import { BillModule } from '../bill/bill.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [PropertyModule, TenantModule, UnitModule, BillModule, DatabaseModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
