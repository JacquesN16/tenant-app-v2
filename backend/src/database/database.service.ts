import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: NodePgDatabase<typeof schema>;

  async onModuleInit() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(pool, { schema });

    await migrate(this.db, { migrationsFolder: './drizzle' });
  }

  getDb(): NodePgDatabase<typeof schema> {
    return this.db;
  }
}
