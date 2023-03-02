const fs = require('fs');
const CONFIG_FILE = 'backend/resources/server-config.json';

let rawData = fs.readFileSync(CONFIG_FILE);
let config = JSON.parse(rawData);

console.log(`set db host: ${process.env.DB_HOST}`);
config.database.host = process.env.DB_HOST;
console.log(`set db name: ${process.env.DB_NAME}`);
config.database.name = process.env.DB_NAME;
console.log(`set db username: ${process.env.DB_USERNAME}`);
config.database.username = process.env.DB_USERNAME;
console.log(`set db password: ${process.env.DB_PASSWORD}`);
config.database.password = process.env.DB_PASSWORD;

console.log(`set secretKey: ${process.env.SECRET_KEY}`);
config.server.security.secretKey =process.env.SECRET_KEY;

let data = JSON.stringify(config, null, '    ');
fs.writeFileSync(CONFIG_FILE, data);
