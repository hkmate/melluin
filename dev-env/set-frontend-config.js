const fs = require('fs');
const CONFIG_FILE = 'frontend/src/assets/app-config.json';

let rawData = fs.readFileSync(CONFIG_FILE);
let config = JSON.parse(rawData);

console.log(`Set base url: ${process.env.API_URL}`);
config.baseURL = process.env.API_URL;

let data = JSON.stringify(config, null, '    ');
fs.writeFileSync(CONFIG_FILE, data);
