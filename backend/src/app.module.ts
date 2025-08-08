import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './app/auth/auth.module';
import { PropertyModule } from './app/property/property.module';
import { UnitModule } from './app/unit/unit.module';
import { TenantModule } from './app/tenant/tenant.module';
import { DashboardModule } from './app/dashboard/dashboard.module';
import { UserModule } from './app/user/user.module';
import { BillModule } from './app/bill/bill.module';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,

    AuthModule,
    PropertyModule,
    UnitModule,
    TenantModule,
    DashboardModule,
    UserModule,
    BillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
