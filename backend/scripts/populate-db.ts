import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../src/database/schema';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { PropertyType } from '@tenant-lib/model';

dotenv.config();

// Utility function to generate IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Utility function to get random date within range
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

async function populateDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  try {
    console.log('🌱 Starting database population...');

    // Sample addresses
    const addresses = [
      {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
      },
      {
        street: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
      },
      {
        street: '321 Elm St',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'USA',
      },
      {
        street: '654 Maple Dr',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA',
      },
      {
        street: '987 Cedar Ln',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
        country: 'USA',
      },
      {
        street: '147 Birch Way',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        country: 'USA',
      },
      {
        street: '258 Spruce St',
        city: 'Denver',
        state: 'CO',
        zipCode: '80201',
        country: 'USA',
      },
    ];

    // Create users (property owners)
    const userIds: string[] = [];

    const userEmails = [
      'j.doe@mail.com',
      'j.smith@mail.com',
      'm.johnson@mail.com',
      's.wilson@mail.com',
      'd.brown@mail.com',
    ];

    console.log('👥 Creating users...');
    for (let i = 0; i < 5; i++) {
      const userId = generateId();
      const hashedPassword = await bcrypt.hash('12345678', 10);

      await db.insert(schema.users).values({
        id: userId,
        firstName: ['John', 'Jane', 'Mike', 'Sarah', 'David'][i],
        lastName: ['Doe', 'Smith', 'Johnson', 'Wilson', 'Brown'][i],
        email: userEmails[i],
        password: hashedPassword,
        phone: `555-${1000 + i * 111}-${2000 + i * 222}`,
        address: addresses[i],
        avatarUrl: `https://avatar.vercel.sh/${userEmails[i]}`,
        propertyIds: [],
        token: generateId(),
      });

      userIds.push(userId);
      console.log(`✅ Created user: ${userEmails[i]}`);
    }

    // Create properties
    const propertyIds: string[] = [];
    const propertyTypes = [
      PropertyType.APARTMENT_BUILDING,
      PropertyType.SINGLE_FAMILY_HOME,
      PropertyType.CONDO,
      PropertyType.TOWNHOUSE,
      PropertyType.DUPLEX,
      PropertyType.SHARE_HOUSE,
    ];

    const propertyNicknames = [
      'Sunset Apartments',
      'Oak Grove Residence',
      'Pine Valley Complex',
      'Elm Street Property',
      'Maple Gardens',
      'Cedar Heights',
      'Birch Manor',
      'Spruce Court',
    ];

    console.log('🏢 Creating properties...');
    for (let i = 0; i < 8; i++) {
      const propertyId = generateId();
      const ownerId = userIds[i % userIds.length];

      await db.insert(schema.properties).values({
        id: propertyId,
        address: addresses[i],
        ownerId,
        nickname: propertyNicknames[i],
        propertyType: propertyTypes[i % propertyTypes.length],
        imageUrl: `https://picsum.photos/400/300?random=${i}`,
      });

      propertyIds.push(propertyId);
      console.log(`✅ Created property: ${propertyNicknames[i]}`);
    }

    // Create units
    const unitIds: string[] = [];
    const occupiedUnitIds: string[] = [];
    const vacantUnitIds: string[] = [];
    console.log('🏠 Creating units...');

    for (const propertyId of propertyIds) {
      // Each property gets 2-6 units
      const unitCount = Math.floor(Math.random() * 5) + 2;

      for (let j = 0; j < unitCount; j++) {
        const unitId = generateId();
        const unitNumber = String.fromCharCode(65 + j) + (j + 1); // A1, B2, C3, etc.
        const isOccupied = Math.random() > 0.3; // 70% occupied

        await db.insert(schema.units).values({
          id: unitId,
          unitNumber,
          isOccupied,
          bedrooms: Math.floor(Math.random() * 3) + 1, // 1-3 bedrooms
          bathrooms: Math.floor(Math.random() * 2) + 1, // 1-2 bathrooms
          squareFootage: Math.floor(Math.random() * 75) + 45, // 45-120 m²
          tenantIds: [],
          propertyId,
        });

        unitIds.push(unitId);
        if (isOccupied) {
          occupiedUnitIds.push(unitId);
        } else {
          vacantUnitIds.push(unitId);
        }
      }
    }
    console.log(`✅ Created ${unitIds.length} units (${occupiedUnitIds.length} occupied, ${vacantUnitIds.length} vacant)`);

    // Create tenants
    const tenantIds: string[] = [];
    const firstNames = [
      'Alice',
      'Bob',
      'Charlie',
      'Diana',
      'Edward',
      'Fiona',
      'George',
      'Helen',
      'Ian',
      'Julia',
      'Kevin',
      'Linda',
      'Michael',
      'Nancy',
      'Oliver',
      'Patricia',
      'Quinn',
      'Rachel',
      'Steven',
      'Teresa',
      'Ulrich',
      'Victoria',
      'Walter',
      'Xenia',
      'Yves',
      'Zoe',
      'Amanda',
      'Brian',
      'Catherine',
      'Daniel',
      'Emily',
      'Frank',
    ];

    const lastNames = [
      'Anderson',
      'Bennett',
      'Carter',
      'Davis',
      'Evans',
      'Foster',
      'Garcia',
      'Harris',
      'Jackson',
      'King',
      'Lewis',
      'Martin',
      'Nelson',
      'Parker',
      'Quinn',
      'Roberts',
      'Smith',
      'Taylor',
      'Underwood',
      'Vincent',
      'White',
      'Young',
      'Adams',
      'Baker',
      'Clark',
      'Edwards',
      'Fisher',
      'Green',
      'Hill',
      'Irving',
      'Jones',
      'Kelly',
    ];

    console.log('👨‍👩‍👧‍👦 Creating tenants...');

    // Create exactly one tenant for each occupied unit
    for (let i = 0; i < occupiedUnitIds.length; i++) {
      const tenantId = generateId();
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const unitId = occupiedUnitIds[i];

      const monthlyRent = Math.floor(Math.random() * 1200) + 600; // €600-€1800
      const monthlyCharge = Math.floor(Math.random() * 150) + 30; // €30-€180
      const securityDeposit = monthlyRent * (1 + Math.random()); // 1-2x rent

      const entryDate = randomDate(
        new Date(2023, 0, 1),
        new Date(2024, 11, 31),
      );
      const leaseStartDate = new Date(entryDate);
      const leaseEndDate = new Date(leaseStartDate);
      leaseEndDate.setFullYear(leaseEndDate.getFullYear() + 1); // 1 year lease

      await db.insert(schema.tenants).values({
        id: tenantId,
        firstName,
        lastName,
        phoneNumber: `555-${String(
          Math.floor(Math.random() * 900) + 100,
        )}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        monthlyRent,
        monthlyCharge,
        unitId,
        entryDate,
        isActive: Math.random() > 0.1, // 90% active
        leaseStartDate,
        leaseEndDate,
        securityDeposit,
        notes: Math.random() > 0.7 ? 'Good tenant, pays on time' : null,
      });

      tenantIds.push(tenantId);
      console.log(`✅ Created tenant: ${firstName} ${lastName}`);
    }

    // Create bills
    console.log('💰 Creating bills...');

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    for (const tenantId of tenantIds) {
      // Get tenant info for bill amount
      const tenant = await db.query.tenants.findFirst({
        where: (tenants, { eq }) => eq(tenants.id, tenantId),
      });

      if (!tenant) continue;

      const billAmount = tenant.monthlyRent + tenant.monthlyCharge;

      // Create bills for the last 6 months
      for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
        const billMonth = currentMonth - monthOffset;
        const billYear = billMonth <= 0 ? currentYear - 1 : currentYear;
        const adjustedMonth = billMonth <= 0 ? billMonth + 12 : billMonth;

        const dueDate = new Date(billYear, adjustedMonth - 1, 1); // First of the month
        const isPaid = Math.random() > 0.2; // 80% paid

        await db.insert(schema.bills).values({
          id: generateId(),
          tenantId,
          amount: billAmount,
          month: adjustedMonth,
          year: billYear,
          isPaid,
          dueDate,
        });
      }
    }

    console.log(`✅ Created bills for ${tenantIds.length} tenants`);

    // Update units with tenant associations
    console.log('🔗 Updating unit-tenant associations...');
    for (const tenantId of tenantIds) {
      const tenant = await db.query.tenants.findFirst({
        where: (tenants, { eq }) => eq(tenants.id, tenantId),
      });

      if (tenant && tenant.unitId) {
        await db
          .update(schema.units)
          .set({
            tenantIds: [tenantId],
            isOccupied: true,
          })
          .where(eq(schema.units.id, tenant.unitId));
      }
    }

    console.log('🎉 Database population completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${userIds.length}`);
    console.log(`   - Properties: ${propertyIds.length}`);
    console.log(`   - Units: ${unitIds.length} (${occupiedUnitIds.length} occupied, ${vacantUnitIds.length} vacant)`);
    console.log(`   - Tenants: ${tenantIds.length} (one per occupied unit)`);
    console.log(`   - Bills: ${tenantIds.length * 6} (6 months per tenant)`);
  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

populateDatabase();
