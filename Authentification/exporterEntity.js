require('dotenv').config()
require("amd-loader")
const fs   = require('fs');
const yaml = require('js-yaml');

define([], function() {
    try {
        let fileContents = fs.readFileSync('./models/entite.yml', 'utf8');
        let data         = yaml.safeLoad(fileContents);
        let yamlStr      = yaml.safeDump(data);
        return {
            data
        };
    } catch (e) {
        console.log(e);
    }
});
