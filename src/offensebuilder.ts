import config from "../config.json";
import gen7Leads from './mon-sets/gen7leads.json';
import natdexLeads from './mon-sets/natdexleads.json';
import gen7Sets from './mon-sets/gen7sets.json';
import natdexSets from './mon-sets/natdexsets.json';

export function buildTeam() {

    let teamString = "";
    for (var b = 0; b < config.teamNumber; b++) {
        let team: any = [];

        if (config.teamNumber > 1) {
            teamString += `=== [${config.tier}] team${b} ===\n\n`;
        }
        let startMon: any = config.startMon;

        if (startMon.set) {
            team[0] = config.startMon;
        } else {
            if (config.gen === 'gen7') {
                team[0] = gen7Leads[getRandomInt(gen7Leads.length)];
            } else if (config.gen === 'natdex') {
                team[0] = natdexLeads[getRandomInt(natdexLeads.length)]
            }
        }
        for (let i = 1; i < config.teamLength; i++) {
            let prunedArray = getMons(0, team);
            if (prunedArray.length > 0) {
                team.push(prunedArray[getRandomInt(prunedArray.length)]);
            } else {
                let reps = 1;
                while (true) {
                    let newList = getMons(reps, team);
                    if (newList.length > 1) {
                        team.push(newList[getRandomInt(length)]);
                        break;
                    }
                    reps++;
                    if (reps > 10){
                        break;
                    }
                }
            }
        }

        for (let i = 0; i < team.length; i++) {
            let set = team[i].set;
            teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\n\n`
        }
    }
    return (teamString);
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

function isValid(mon: { set: { name: string; }; z: any; mega: any; }, team: string | any[]) {
    for (let i = 0; i < config.monsToAvoid.length; i++) {
        if (mon.set.name.toLowerCase() === config.monsToAvoid[i].toLowerCase()) {
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

function getMons(num: number, team: string | any[]) {
    let prunedArray = [];
    if (config.gen === 'gen7') {
        for (let set of gen7Sets) {
            let mon = set;
            if (mon.breaker >= config.cutoff - num && isValid(set, team)) {
                prunedArray.push(mon);
            }
        }
    } else if (config.gen === 'natdex') {
        for (let set of natdexSets) {
            let mon = set;
            if (mon.breaker >= config.cutoff - num && isValid(set, team)) {
                prunedArray.push(mon);
            }
        }
    }
    if (prunedArray.length > 0) {
        return (prunedArray);
    } else {
        return ([]);
    }
}