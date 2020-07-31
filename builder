#!/usr/bin/env node

// {
//     "set": {
//         "name":"",
//         "item":"",
//         "ability":"",
//         "evs":"",
//         "nature":"",
//         "moves":["", "", "", ""]
//     },
//     "breaker":,
//     "ogreCheck":,
//     "donCheck":,
//     "ygodCheck":,
//     "xernCheck":,
//     "rayCheck":,
//     "zygCheck":,
//     "zacCheck":,
//     "mega":,
//     "z":,
//     "rocks":,
//     "defog":
// },

console.log('building...');

require('child_process').execSync('npm run build');

const config = require("./config.json");

let teamString = "";

if(config.mode.toLowerCase() != "offense"){
    teamString = require(`./dist/src/${config.gen}${config.mode.toLowerCase()}builder.js`).buildTeam();
} else {
    teamString = require(`./dist/src/offensebuilder.js`).buildTeam();
}

console.log(teamString);
