/*
    This file should be executed from script in root dir.
*/

const fs = require('fs');
const CONFIG_FILE = 'apps/api/resources/server-config.json';

let rawData = fs.readFileSync(CONFIG_FILE);
let config = JSON.parse(rawData);

console.log(`Set db host: ${process.env.ENV_DB_HOST}`);
config.database.host = process.env.ENV_DB_HOST;

console.log(`Set db port: ${process.env.ENV_DB_PORT}`);
config.database.port = +process.env.ENV_DB_PORT;

console.log(`Set db ssl param: ${process.env.ENV_DB_SSL}`);
config.database.ssl = (process.env.ENV_DB_SSL) ? ('true' === process.env.ENV_DB_SSL.toLowerCase()) : false;

console.log(`Set db name: ${process.env.ENV_DB_NAME}`);
config.database.name = process.env.ENV_DB_NAME;

console.log(`Set db username: ${process.env.ENV_DB_USERNAME}`);
config.database.username = process.env.ENV_DB_USERNAME;

console.log(`Set db password: **********`);
config.database.password = process.env.ENV_DB_PASSWORD;

console.log(`Set secretKey: **********`);
config.server.security.secretKey = process.env.ENV_SECRET_KEY;

let data = JSON.stringify(config, null, '    ');
fs.writeFileSync(CONFIG_FILE, data);
