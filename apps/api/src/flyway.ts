import {Flyway} from 'node-flyway';
import * as CONFIG from '@resources/server-config.json';
import {includeAny} from '@melluin/common';

const MIGRATION_ONLY_ARG = 'migration-only';
const WITH_MIGRATION_ARG = 'with-migration';

export async function handleMigrations(): Promise<void> {
    const migrationsOnly = includeAny(process.argv, MIGRATION_ONLY_ARG);
    const withMigrations = migrationsOnly || includeAny(process.argv, WITH_MIGRATION_ARG);

    if (withMigrations) {
        await runMigrations();

        if (migrationsOnly) {
            process.exit(0);
        }
    }
}

export function runMigrations(): Promise<void> {
    const db = CONFIG.database;

    const flyway = new Flyway({
        url: `jdbc:postgresql://${db.host}:${db.port}/${db.name}`,
        user: db.username,
        password: db.password,
        defaultSchema: 'public',
        migrationLocations: ['resources/db/scripts/'],
        advanced: {
            baselineOnMigrate: false,
        }
    });

    console.log('Execute migrations...');
    return flyway.migrate().then(response => {
        console.info(response.flywayResponse);
        if (!response.success) {
            const errorMsg = JSON.stringify(response.error ?? {}, null, 54);
            throw new Error(`Unable to execute migrate command. Error: ${errorMsg}`);
        }
        console.log('Successfully executed migrations');
    });
}
