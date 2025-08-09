import {
  Controller,
  Get,
  Param,
  Put,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BillService } from './bill.service';
import { BillEntity } from './bill.entity';
import { PdfService } from './pdf.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bills')
@UseGuards(JwtAuthGuard)
export class BillController {
  constructor(
    private readonly billService: BillService,
    private readonly pdfService: PdfService,
  ) {}

  @Post('generate')
  async generateBills(): Promise<string> {
    await this.billService.generateMonthlyBills();
    return 'Monthly bills generated successfully.';
  }

  @Get('tenant/:tenantId')
  async getBillsByTenant(
    @Param('tenantId') tenantId: string,
  ): Promise<BillEntity[]> {
    return this.billService.getBillsByTenant(tenantId);
  }

  @Get(':id')
  async getBillById(@Param('id') id: string): Promise<BillEntity> {
    return this.billService.getBillById(id);
  }

  @Put(':id/pay')
  async markBillAsPaid(@Param('id') id: string): Promise<BillEntity> {
    return this.billService.markBillAsPaid(id);
  }

  @Get(':id/receipt')
  async generateReceipt(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const pdfBuffer = await this.pdfService.generateReceiptPdf(id);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quittance-${id}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } catch (error) {
      res.status(400).json({
        message: error.message || 'Failed to generate receipt',
      });
    }
  }
}
