import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { PdfService } from './pdf.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [BillService, PdfService],
  controllers: [BillController],
  exports: [BillService, PdfService],
})
export class BillModule {}
