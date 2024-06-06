/*
    This file should be executed from script in root dir.
 */

const fs = require('fs');
const CONFIG_FILE = 'frontend/src/assets/app-config.json';

let rawData = fs.readFileSync(CONFIG_FILE);
let config = JSON.parse(rawData);

console.log(`Set base url: '${process.env.API_URL}'`);
config.baseURL = process.env.API_URL;

console.log(`Set questionnaire for child url: '${process.env.QUESTIONNAIRE_FOR_CHILD}'`);
config.questionnaireForChild = process.env.QUESTIONNAIRE_FOR_CHILD;

console.log(`Set questionnaire for parent url: '${process.env.QUESTIONNAIRE_FOR_PARENT}'`);
config.questionnaireForParent = process.env.QUESTIONNAIRE_FOR_PARENT;

let data = JSON.stringify(config, null, '    ');
fs.writeFileSync(CONFIG_FILE, data);
