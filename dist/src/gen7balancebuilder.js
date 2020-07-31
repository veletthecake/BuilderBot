"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTeam = void 0;
const gen7sets_json_1 = __importDefault(require("./mon-sets/gen7sets.json"));
const config_json_1 = __importDefault(require("../config.json"));
let stats = {
    ints: {
        rayCheck: 0,
        zygCheck: 0,
        marshCheck: 0,
        donCheck: 0,
        breaker: 0,
        ultraCheck: 0,
        xernCheck: 0,
        ogreCheck: 0
    },
    mega: false,
    z: false,
    rocks: false,
    defog: false,
    cleric: false
};
function buildTeam() {
    let teamString = "";
    for (var b = 0; b < config_json_1.default.teamNumber; b++) {
        let team = [];
        if (config_json_1.default.teamNumber > 1) {
            teamString += `=== [${config_json_1.default.tier}] team${b} ===\n\n`;
        }
        let startMon = config_json_1.default.startMon;
        if (!startMon.set) {
            team[0] = getRandomMon(team);
        }
        else {
            team[0] = config_json_1.default.startMon;
        }
        updateStats(team);
        for (let i = 1; i < config_json_1.default.teamLength; i++) {
            let pruneArray = [];
            let prunedArray = [];
            let priority = "";
            let currentValue = 11;
            let rejected = [];
            for (let [key, value] of Object.entries(stats.ints)) {
                if (value <= currentValue) {
                    currentValue = value;
                    priority = key;
                }
            }
            for (let SET of gen7sets_json_1.default) {
                if (SET.priority && SET.priority >= config_json_1.default.cutoff) {
                    pruneArray.push(SET);
                }
            }
            for (let a = 0; a < pruneArray.length; a++) {
                if (isValid(pruneArray[a], team) && zMegaCheckPassed(pruneArray[a]) && clericTest(pruneArray[a])) {
                    if (!stats.rocks || !stats.defog) {
                        if (!stats.rocks && pruneArray[a].rocks) {
                            prunedArray.push(pruneArray[a]);
                        }
                        else if (!stats.defog && pruneArray[a].defog) {
                            prunedArray.push(pruneArray[a]);
                        }
                        else {
                            rejected.push(pruneArray[a]);
                        }
                    }
                    else {
                        if ((!stats.rocks) || (stats.rocks && !pruneArray[a].rocks)) {
                            prunedArray.push(pruneArray[a]);
                        }
                    }
                }
            }
            if (prunedArray.length === 0) {
                if (!stats.defog && config_json_1.default.cutoff <= 2) {
                    let mon = getRandomMon(team);
                    let a = 0;
                    while (!mon.defog) {
                        mon = getRandomMon(team);
                        a++;
                        if (a > 1000) {
                            break;
                        }
                    }
                    prunedArray.push(mon);
                }
                else if (rejected) {
                    for (let i = 0; i < rejected.length; i++) {
                        if (rejected[i] && isValid(rejected[i], team) && zMegaCheckPassed(rejected[i]) && clericTest(rejected[i])) {
                            if ((!stats.rocks) || (stats.rocks && !rejected[i].rocks)) {
                                prunedArray.push(rejected[i]);
                            }
                        }
                    }
                    if (prunedArray.length === 0) {
                        prunedArray.push(getRandomMon(team));
                    }
                }
                else {
                    prunedArray.push(getRandomMon(team));
                }
            }
            while (true) {
                let rand = prunedArray[getRandomInt(prunedArray.length)];
                if (isValid(rand, team) && zMegaCheckPassed(rand) && clericTest(rand)) {
                    team.push(rand);
                    break;
                }
            }
            updateStats(team);
        }
        for (let i = 0; i < team.length; i++) {
            let set = team[i].set;
            teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\n\n`;
        }
        if (config_json_1.default.teamNumber === 1) {
            for (let [key, value] of Object.entries(stats.ints)) {
                console.log(key, value);
            }
        }
    }
    return (teamString);
}
exports.buildTeam = buildTeam;
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function updateStats(team) {
    stats = {
        ints: {
            rayCheck: 0,
            zygCheck: 0,
            marshCheck: 0,
            donCheck: 0,
            ultraCheck: 0,
            xernCheck: 0,
            ogreCheck: 0,
            breaker: 0,
        },
        mega: false,
        z: false,
        rocks: false,
        defog: false,
        cleric: false
    };
    for (let i = 0; i < team.length; i++) {
        if (team[i].breaker) {
            stats.ints.breaker += team[i].breaker;
        }
        if (team[i].rayCheck) {
            stats.ints.rayCheck += team[i].rayCheck;
        }
        if (team[i].zygCheck) {
            stats.ints.zygCheck += team[i].zygCheck;
        }
        if (team[i].marshCheck) {
            stats.ints.marshCheck += team[i].marshCheck;
        }
        if (team[i].donCheck) {
            stats.ints.donCheck += team[i].donCheck;
        }
        if (team[i].ultraCheck) {
            stats.ints.ultraCheck += team[i].ultraCheck;
        }
        if (team[i].xernCheck) {
            stats.ints.xernCheck += team[i].xernCheck;
        }
        if (team[i].ogreCheck) {
            stats.ints.ogreCheck += team[i].ogreCheck;
        }
        if (team[i].mega) {
            stats.mega = true;
        }
        if (team[i].z) {
            stats.z = true;
        }
        if (team[i].rocks) {
            stats.rocks = true;
        }
        if (team[i].defog) {
            stats.defog = true;
        }
        if (team[i].cleric) {
            stats.cleric = true;
        }
    }
}
function isValid(mon, team) {
    for (let i = 0; i < team.length; i++) {
        if (mon.set.name.includes(team[i].set.name) || team[i].set.name.includes(mon)) {
            return false;
        }
        if ((mon.set.name.includes("Tyranitar") && team[i].set.name === "Shedinja") || (mon === "Shedinja" && team[i].set.name.includes("Tyranitar"))) {
            return false;
        }
    }
    for (let i = 0; i < config_json_1.default.monsToAvoid.length; i++) {
        if (mon.set.name.toLowerCase() === config_json_1.default.monsToAvoid[i].toLowerCase()) {
            return false;
        }
    }
    return true;
}
function zMegaCheckPassed(mon) {
    if (!stats.mega && !stats.z) {
        return true;
    }
    else if (stats.mega && !mon.mega) {
        return true;
    }
    else if (stats.z && !mon.z) {
        return true;
    }
    return false;
}
function clericTest(mon) {
    if (stats.cleric && mon.cleric) {
        return false;
    }
    return true;
}
function getRandomMon(team) {
    let a = 0;
    let completed = false;
    while (!completed) {
        let rand = gen7sets_json_1.default[getRandomInt(gen7sets_json_1.default.length - 1)];
        if (isValid(rand, team) && zMegaCheckPassed(rand) && clericTest(rand)) {
            if ((!stats.rocks) || (stats.rocks && !rand.rocks)) {
                return (rand);
            }
        }
        a++;
        if (a > 1000) {
            return (gen7sets_json_1.default[getRandomInt(gen7sets_json_1.default.length - 1)]);
        }
    }
}
//# sourceMappingURL=gen7balancebuilder.js.map