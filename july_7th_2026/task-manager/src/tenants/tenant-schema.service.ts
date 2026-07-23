import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantSchemaService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async createSchema(schema: string) {
    await this.dataSource.query(
      `CREATE SCHEMA IF NOT EXISTS "${schema}"`,
    );
  }

  async createTables(schema: string) {
    // Function to update updatedat automatically
    await this.dataSource.query(`
      CREATE OR REPLACE FUNCTION "${schema}".update_updatedat()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updatedat = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Users

    await this.dataSource.query(`
      CREATE TABLE "${schema}".users (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

          username varchar NOT NULL UNIQUE,

          password varchar NOT NULL,

          roleid uuid NOT NULL
              REFERENCES public.roles(id),

          failedloginattempts integer NOT NULL DEFAULT 0,

          lockeduntil timestamp NULL,

          createdat timestamp NOT NULL DEFAULT now(),

          updatedat timestamp NOT NULL DEFAULT now()
      );
    `);

    await this.dataSource.query(`
      CREATE TRIGGER users_updatedat_trigger
      BEFORE UPDATE ON "${schema}".users
      FOR EACH ROW
      EXECUTE FUNCTION "${schema}".update_updatedat();
    `);

    // Tasks

    await this.dataSource.query(`
      CREATE TABLE "${schema}".tasks (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

          title varchar NOT NULL,

          completed boolean NOT NULL DEFAULT false,

          userid uuid NOT NULL
              REFERENCES "${schema}".users(id)
              ON DELETE CASCADE,

          createdat timestamp NOT NULL DEFAULT now(),

          updatedat timestamp NOT NULL DEFAULT now()
      );
    `);

    await this.dataSource.query(`
      CREATE TRIGGER tasks_updatedat_trigger
      BEFORE UPDATE ON "${schema}".tasks
      FOR EACH ROW
      EXECUTE FUNCTION "${schema}".update_updatedat();
    `);

    // Tickets

    await this.dataSource.query(`
      CREATE TABLE "${schema}".tickets (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

          title varchar NOT NULL,

          description text,

          status varchar NOT NULL DEFAULT 'OPEN',

          userid uuid NOT NULL
              REFERENCES "${schema}".users(id)
              ON DELETE CASCADE,

          createdat timestamp NOT NULL DEFAULT now(),

          updatedat timestamp NOT NULL DEFAULT now()
      );
    `);

    await this.dataSource.query(`
      CREATE TRIGGER tickets_updatedat_trigger
      BEFORE UPDATE ON "${schema}".tickets
      FOR EACH ROW
      EXECUTE FUNCTION "${schema}".update_updatedat();
    `);
  }
}