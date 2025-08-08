import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

async function cleanDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    console.log('🧹 Starting database cleanup...');

    // Delete all data in reverse dependency order
    await db.execute(sql`DELETE FROM bills`);
    console.log('✅ Cleared bills table');

    await db.execute(sql`DELETE FROM tenants`);
    console.log('✅ Cleared tenants table');

    await db.execute(sql`DELETE FROM units`);
    console.log('✅ Cleared units table');

    await db.execute(sql`DELETE FROM properties`);
    console.log('✅ Cleared properties table');

    await db.execute(sql`DELETE FROM users`);
    console.log('✅ Cleared users table');

    console.log('🎉 Database cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

cleanDatabase();