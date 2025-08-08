import { Injectable } from '@nestjs/common';
import { jsPDF } from 'jspdf';
import { DatabaseService } from '../../database/database.service';
import {
  bills,
  tenants,
  units,
  properties,
  users,
} from '../../database/schema';
import { eq } from 'drizzle-orm';

interface ReceiptData {
  bill: {
    id: string;
    amount: number;
    month: number;
    year: number;
    dueDate: Date;
    isPaid: boolean;
  };
  tenant: {
    title: string;
    firstName: string;
    lastName: string;
    monthlyRent: number;
    monthlyCharge: number;
  };
  property: {
    address: any; // JSONB field from database
  };
  owner: {
    firstName: string;
    lastName: string;
  };
}

@Injectable()
export class PdfService {
  constructor(private databaseService: DatabaseService) {}

  // Convert number to French text
  private numberToFrenchText(num: number): string {
    const ones = [
      '',
      'un',
      'deux',
      'trois',
      'quatre',
      'cinq',
      'six',
      'sept',
      'huit',
      'neuf',
    ];
    const teens = [
      'dix',
      'onze',
      'douze',
      'treize',
      'quatorze',
      'quinze',
      'seize',
      'dix-sept',
      'dix-huit',
      'dix-neuf',
    ];
    const tens = [
      '',
      '',
      'vingt',
      'trente',
      'quarante',
      'cinquante',
      'soixante',
      'soixante-dix',
      'quatre-vingt',
      'quatre-vingt-dix',
    ];
    const hundreds = [
      '',
      'cent',
      'deux cents',
      'trois cents',
      'quatre cents',
      'cinq cents',
      'six cents',
      'sept cents',
      'huit cents',
      'neuf cents',
    ];

    if (num === 0) return 'zéro';
    if (num < 0) return 'moins ' + this.numberToFrenchText(-num);

    let result = '';
    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);

    // Handle thousands
    if (integerPart >= 1000) {
      const thousands = Math.floor(integerPart / 1000);
      if (thousands === 1) {
        result += 'mille ';
      } else {
        result += this.convertHundreds(thousands) + ' mille ';
      }
    }

    // Handle hundreds
    const remainder = integerPart % 1000;
    if (remainder > 0) {
      result += this.convertHundreds(remainder);
    }

    if (result.trim() === '') result = 'zéro';

    // Handle decimal part (cents)
    if (decimalPart > 0) {
      result += ' virgule ' + this.convertHundreds(decimalPart);
    }

    return result.trim();
  }

  private convertHundreds(num: number): string {
    const ones = [
      '',
      'un',
      'deux',
      'trois',
      'quatre',
      'cinq',
      'six',
      'sept',
      'huit',
      'neuf',
    ];
    const teens = [
      'dix',
      'onze',
      'douze',
      'treize',
      'quatorze',
      'quinze',
      'seize',
      'dix-sept',
      'dix-huit',
      'dix-neuf',
    ];
    const tens = [
      '',
      '',
      'vingt',
      'trente',
      'quarante',
      'cinquante',
      'soixante',
      'soixante-dix',
      'quatre-vingt',
      'quatre-vingt-dix',
    ];

    let result = '';

    // Handle hundreds
    const hundredsDigit = Math.floor(num / 100);
    if (hundredsDigit > 0) {
      if (hundredsDigit === 1) {
        result += 'cent ';
      } else {
        result += ones[hundredsDigit] + ' cent ';
      }
    }

    // Handle tens and ones
    const remainder = num % 100;
    if (remainder >= 10 && remainder < 20) {
      result += teens[remainder - 10];
    } else {
      const tensDigit = Math.floor(remainder / 10);
      const onesDigit = remainder % 10;

      if (tensDigit > 0) {
        result += tens[tensDigit];
        if (onesDigit > 0) {
          if (tensDigit === 7 || tensDigit === 9) {
            // Special cases for 70-79 and 90-99
            result += '-' + teens[onesDigit];
          } else {
            result += '-' + ones[onesDigit];
          }
        }
      } else if (onesDigit > 0) {
        result += ones[onesDigit];
      }
    }

    return result.trim();
  }

  private getMonthName(month: number): string {
    const months = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];
    return months[month - 1] || '';
  }

  private formatPeriod(
    month: number,
    year: number,
  ): { start: string; end: string } {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month

    const formatDate = (date: Date) => {
      return `${date.getDate().toString().padStart(2, '0')} ${this.getMonthName(
        date.getMonth() + 1,
      )} ${date.getFullYear()}`;
    };

    return {
      start: formatDate(startDate),
      end: formatDate(endDate),
    };
  }

  async generateReceiptPdf(billId: string): Promise<Buffer> {
    // Get bill data with related information
    const receiptData = await this.getReceiptData(billId);

    if (!receiptData) {
      throw new Error('Bill not found or not paid');
    }

    // Create PDF
    const doc = new jsPDF('portrait', 'mm', 'a4');

    // Set up fonts and styling
    doc.setFont('helvetica');

    // Header
    doc.setFontSize(19.5);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Quittance de loyer du ${receiptData.bill.month}/${receiptData.bill.year}`,
      105,
      30,
      {
        align: 'center',
      },
    );

    // Property address (top left)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const tenant_address_x_val = 150;
    const tenant_address_base_y_val = 50;
    const y_val_step = 6;
    doc.text(
      `${receiptData.tenant.lastName.toUpperCase()} ${
        receiptData.tenant.firstName
      }`,
      tenant_address_x_val,
      tenant_address_base_y_val,
    );
    doc.text(
      `${receiptData.property.address?.street || ''}`,
      tenant_address_x_val,
      get_y_offset_val(tenant_address_base_y_val, y_val_step, 1),
    );
    doc.text(
      `${receiptData.property.address?.zipCode || ''} ${
        receiptData.property.address?.city || ''
      }`,
      tenant_address_x_val,
      get_y_offset_val(tenant_address_base_y_val, y_val_step, 2),
    );
    doc.text(
      `${receiptData.property.address?.country || ''}`,
      tenant_address_x_val,
      get_y_offset_val(tenant_address_base_y_val, y_val_step, 3),
    );

    const today = new Date();

    // Period information
    const period = this.formatPeriod(
      receiptData.bill.month,
      receiptData.bill.year,
    );

    // Main content
    const amountInText = this.numberToFrenchText(receiptData.bill.amount);

    // Get the proper title for the tenant
    const getTenantTitle = (title: string): string => {
      switch (title) {
        case 'monsieur':
          return 'Monsieur';
        case 'madame':
          return 'Madame';
        case 'mademoiselle':
          return 'Mademoiselle';
        default:
          return 'Monsieur/Madame'; // Fallback for existing tenants without title
      }
    };

    doc.setFontSize(13);
    const tenantTitle = getTenantTitle(receiptData.tenant.title);
    const mainText = `Je soussigné ${receiptData.owner.firstName} ${
      receiptData.owner.lastName
    }, propriétaire du logement désigné ci-dessus, déclare avoir reçu de ${tenantTitle} ${
      receiptData.tenant.lastName
    } ${
      receiptData.tenant.firstName
    }, la somme de ${receiptData.bill.amount.toFixed(
      2,
    )} euros (${amountInText} euros), au titre du paiement du loyer et des charges pour la période de location du ${
      period.start
    } au ${
      period.end
    } et lui en donne quittance, sous réserve de tous mes droits.`;

    // Split text into lines for better formatting
    const splitText = doc.splitTextToSize(mainText, 170);
    doc.text(splitText, 20, 90);

    doc.setFontSize(11.5);

    // Table for breakdown
    const tableStartY = 120;

    // Table headers
    const main_text_y = 100;
    const row_length = 120;
    const row_heigth = 8;
    doc.setFont('helvetica', 'bold');
    doc.rect(20, tableStartY, row_length, row_heigth);
    doc.text('Désignation', 25, tableStartY + 5);
    doc.text('Montant (€)', main_text_y, tableStartY + 5);

    // Table rows
    doc.setFont('helvetica', 'normal');
    let currentY = tableStartY + 8;

    // Rent row
    doc.rect(20, currentY, row_length, row_heigth);
    doc.text('Loyer mensuel', 25, currentY + 5);
    doc.text(
      `${receiptData.tenant.monthlyRent.toFixed(2)}`,
      main_text_y,
      currentY + 5,
    );
    currentY += 8;

    // Charges row
    doc.rect(20, currentY, row_length, row_heigth);
    doc.text('Charges mensuelles', 25, currentY + 5);
    doc.text(
      `${receiptData.tenant.monthlyCharge.toFixed(2)}`,
      main_text_y,
      currentY + 5,
    );
    currentY += 8;

    // Total row
    doc.setFont('helvetica', 'bold');
    doc.rect(20, currentY, row_length, row_heigth);
    doc.text('TOTAL', 25, currentY + 5);
    doc.text(
      `${receiptData.bill.amount.toFixed(2)}`,
      main_text_y,
      currentY + 5,
    );
    currentY += 8;

    // Payment date
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Date de paiement : ${today.toLocaleDateString('fr-FR')}`,
      25,
      currentY + 15,
    );

    // Signature area
    doc.text(
      `Fait le ${today.toLocaleDateString('fr-FR')} ${
        receiptData.property.address?.city
          ? `à ${receiptData.property.address?.city}`
          : ''
      } `,
      120,
      currentY + 30,
    );
    // doc.text('Signature du propriétaire :', 120, currentY + 40);

    // Convert to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
  }

  private async getReceiptData(billId: string): Promise<ReceiptData | null> {
    const [billResult] = await this.databaseService
      .getDb()
      .select()
      .from(bills)
      .leftJoin(tenants, eq(bills.tenantId, tenants.id))
      .leftJoin(units, eq(tenants.unitId, units.id))
      .leftJoin(properties, eq(units.propertyId, properties.id))
      .leftJoin(users, eq(properties.ownerId, users.id))
      .where(eq(bills.id, billId));

    if (
      !billResult ||
      !billResult.tenants ||
      !billResult.properties ||
      !billResult.users
    ) {
      return null;
    }

    if (!billResult.bills.isPaid) {
      throw new Error('Cannot generate receipt for unpaid bill');
    }

    return {
      bill: billResult.bills,
      tenant: billResult.tenants,
      property: billResult.properties,
      owner: billResult.users,
    };
  }
}

function get_y_offset_val(
  base_val: number,
  offset_step_val: number,
  step_count: number,
) {
  return base_val + step_count * offset_step_val;
}
