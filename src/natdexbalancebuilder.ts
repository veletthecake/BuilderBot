import sets from "./mon-sets/natdexsets.json";
import config from "../config.json";

let stats = {
    ints: {
        rayCheck: 0,
        zygCheck: 0,
        zacCheck: 0,
        donCheck: 0,
        breaker: 0,
        ygodCheck: 0,
        xernCheck: 0,
        ogreCheck: 0
    },
    mega: false,
    z: false,
    rocks: false,
    defog: false,
    cleric: false
};

export function buildTeam() {

    let teamString = "";

    for (var b = 0; b < config.teamNumber; b++) {
        let team: any = [];
        if (config.teamNumber > 1) {
            teamString += `=== [${config.tier}] team${b} ===\n\n`;
        }
        let startMon: any = config.startMon

        if (!startMon.set) {
            team[0] = getRandomMon(team);
        } else {
            team[0] = config.startMon;
        }

        updateStats(team);

        for (let i = 1; i < config.teamLength; i++) {

            let pruneArray= [];
            let prunedArray = [];
            let rejected = [];
            
            let SET: any;

            for (SET of sets){
                if(SET.priority >= config.cutoff) {
                    pruneArray.push(SET);
                }
            }

            for (let a = 0; a < pruneArray.length; a++) {
                if (isValid(pruneArray[a], team) && zMegaCheckPassed(pruneArray[a]) && clericTest(pruneArray[a])) {
                    if (!stats.rocks || !stats.defog) {
                        if (!stats.rocks && pruneArray[a].rocks) {
                            prunedArray.push(pruneArray[a]);
                        } else if (!stats.defog && pruneArray[a].defog) {
                            prunedArray.push(pruneArray[a]);
                        } else {
                            rejected.push(pruneArray[a]);
                        }
                    } else {
                        if ((!stats.rocks) || (stats.rocks && !pruneArray[a].rocks)) {
                            prunedArray.push(pruneArray[a]);
                        }
                    }
                }
            }

            if (prunedArray.length === 0) {
                if (!stats.defog && config.cutoff <= 2) {
                    let mon = getRandomMon(team);
                    let a = 0;
                    while (!mon!.defog) {
                        mon = getRandomMon(team);
                        a++;
                        if (a > 1000) {
                            break;
                        }
                    }
                    prunedArray.push(mon);
                } else if (rejected) {
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
                } else {
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
            teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\n\n`
        }

        if (config.teamNumber === 1) {
            for (let [key, value] of Object.entries(stats.ints)) {
                console.log(key, value);
            }
        }
    }
    return (teamString);
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

function updateStats(team: string | any[]) {
    stats = {
        ints: {
            rayCheck: 0,
            zygCheck: 0,
            zacCheck: 0,
            donCheck: 0,
            ygodCheck: 0,
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
        if (team[i].breaker) { stats.ints.breaker += team[i].breaker; }
        if (team[i].rayCheck) { stats.ints.rayCheck += team[i].rayCheck; }
        if (team[i].zygCheck) { stats.ints.zygCheck += team[i].zygCheck; }
        if (team[i].zacCheck) { stats.ints.zacCheck += team[i].zacCheck; }
        if (team[i].donCheck) { stats.ints.donCheck += team[i].donCheck; }
        if (team[i].ygodCheck) { stats.ints.ygodCheck += team[i].ygodCheck; }
        if (team[i].xernCheck) { stats.ints.xernCheck += team[i].xernCheck; }
        if (team[i].ogreCheck) { stats.ints.ogreCheck += team[i].ogreCheck; }

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

function isValid(mon: any, team: any) {
    for (let i = 0; i < team.length; i++) {
        if (mon.set.name.includes(team[i].set.name) || team[i].set.name.includes(mon)) {
            return false;
        }

        if ((mon.set.name.includes("Tyranitar") && team[i].set.name === "Shedinja") || (mon === "Shedinja" && team[i].set.name.includes("Tyranitar"))) {
            return false;
        }
    }
    for (let i = 0; i < config.monsToAvoid.length; i++) {
        if (mon.set.name.toLowerCase() === config.monsToAvoid[i].toLowerCase()) {
            return false;
        }
    }
    return true;
}

function zMegaCheckPassed(mon: any) {
    if (!stats.mega && !stats.z) {
        return true;
    } else if (stats.mega && !mon.mega) {
        return true;
    } else if (stats.z && !mon.z) {
        return true;
    }

    return false;
}

function clericTest(mon: any) {
    if (stats.cleric && mon.cleric) {
        return false;
    }
    return true;
}

function getRandomMon(team: any) {
    let a = 0;
    let completed = false;
    while (!completed) {
        let rand = sets[getRandomInt(sets.length - 1)];
        if (isValid(rand, team) && zMegaCheckPassed(rand) && clericTest(rand)) {
            if ((!stats.rocks) || (stats.rocks && !rand.rocks)) {
                return (rand);
            }
        }
        a++;
        if (a > 1000) {
            return (sets[getRandomInt(sets.length - 1)])
        }
    }
}