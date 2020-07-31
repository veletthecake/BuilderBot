"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTeam = void 0;
const config_json_1 = __importDefault(require("../config.json"));
const gen7leads_json_1 = __importDefault(require("./mon-sets/gen7leads.json"));
const natdexleads_json_1 = __importDefault(require("./mon-sets/natdexleads.json"));
const gen7sets_json_1 = __importDefault(require("./mon-sets/gen7sets.json"));
const natdexsets_json_1 = __importDefault(require("./mon-sets/natdexsets.json"));
function buildTeam() {
    let teamString = "";
    for (var b = 0; b < config_json_1.default.teamNumber; b++) {
        let team = [];
        if (config_json_1.default.teamNumber > 1) {
            teamString += `=== [${config_json_1.default.tier}] team${b} ===\n\n`;
        }
        let startMon = config_json_1.default.startMon;
        if (startMon.set) {
            team[0] = config_json_1.default.startMon;
        }
        else {
            if (config_json_1.default.gen === 'gen7') {
                team[0] = gen7leads_json_1.default[getRandomInt(gen7leads_json_1.default.length)];
            }
            else if (config_json_1.default.gen === 'natdex') {
                team[0] = natdexleads_json_1.default[getRandomInt(natdexleads_json_1.default.length)];
            }
        }
        for (let i = 1; i < config_json_1.default.teamLength; i++) {
            let prunedArray = getMons(0, team);
            if (prunedArray.length > 0) {
                team.push(prunedArray[getRandomInt(prunedArray.length)]);
            }
            else {
                let reps = 1;
                while (true) {
                    let newList = getMons(reps, team);
                    if (newList.length > 1) {
                        team.push(newList[getRandomInt(length)]);
                        break;
                    }
                    reps++;
                    if (reps > 10) {
                        break;
                    }
                }
            }
        }
        for (let i = 0; i < team.length; i++) {
            let set = team[i].set;
            teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\n\n`;
        }
    }
    return (teamString);
}
exports.buildTeam = buildTeam;
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function isValid(mon, team) {
    for (let i = 0; i < config_json_1.default.monsToAvoid.length; i++) {
        if (mon.set.name.toLowerCase() === config_json_1.default.monsToAvoid[i].toLowerCase()) {
            return false;
        }
    }
    for (let i = 0; i < team.length; i++) {
        if (mon.set.name.includes(team[i].set.name) || team[i].set.name.includes(mon.set.name)) {
            return false;
        }
        if ((mon.z && team[i].z) || (mon.mega && team[i].mega)) {
            return false;
        }
    }
    return true;
}
function getMons(num, team) {
    let prunedArray = [];
    if (config_json_1.default.gen === 'gen7') {
        for (let set of gen7sets_json_1.default) {
            let mon = set;
            if (mon.breaker >= config_json_1.default.cutoff - num && isValid(set, team)) {
                prunedArray.push(mon);
            }
        }
    }
    else if (config_json_1.default.gen === 'natdex') {
        for (let set of natdexsets_json_1.default) {
            let mon = set;
            if (mon.breaker >= config_json_1.default.cutoff - num && isValid(set, team)) {
                prunedArray.push(mon);
            }
        }
    }
    if (prunedArray.length > 0) {
        return (prunedArray);
    }
    else {
        return ([]);
    }
}
//# sourceMappingURL=offensebuilder.js.map