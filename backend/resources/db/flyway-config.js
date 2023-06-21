// eslint-disable-next-line @typescript-eslint/no-var-requires
const backendConfig = require('../server-config.json');

module.exports = function() {
    console.log('Flyway config setting...');
    return {
        flywayArgs: {
            url: `jdbc:postgresql://${backendConfig.database.host}:${backendConfig.database.port}/${backendConfig.database.name}`,
            schemas: 'public',
            locations: 'filesystem:resources/db/scripts',
            user: backendConfig.database.username,
            password: backendConfig.database.password,
            baselineOnMigrate: false,
        }
    };
};
