const fs = require('fs')

const file = fs.readFileSync('playByPlay.json', 'utf-8')

const playByPlay = JSON.parse(file)


let playerData = []


let PA = 0;
let AB = 0;
let H = 0;
let HR = 0;
let RBI = 0;
let SB = 0;
let R = 0;
let BB = 0;
let IBB = 0;
let HBP = 0;
let SO = 0;
let SH = 0;
let SF = 0;
let ROE = 0;
let GDP = 0;
let CS = 0;

let TB = 0;

let singles = 0;
let doubles = 0;
let triples = 0;

let strikePitchCodes = ["S", "C", "F", "T", "L", "W", "M", "Q", "R", "X", "D", "E"]
let ballPitchCodes = ["B", "*B", "I", "P", "H"]


let foo = []

const emptyBatterStats = {
    pa: 0,
    ab: 0,
    h: 0,
    hr: 0,
    rbi: 0,
    sb: 0,
    r: 0,
    bb: 0,
    ibb: 0,
    hbp: 0,
    so: 0,
    sh: 0,
    sf: 0,
    roe: 0,
    gdp: 0,
    cs: 0,
    tb: 0,
    singles: 0,
    doubles: 0,
    triples: 0,
    ba: 0,
    obp: 0,
    slg: 0,
    ops: 0
}

const emptyPitcherStats = {
    h: 0,
    r: 0,
    er: 0,
    bb: 0,
    ibb: 0,
    so: 0,
    hr: 0,
    hbp: 0,
    bf: 0,
    pit: 0,
    balls: 0,
    str: 0,
    stl: 0,
    sts: 0,
    gb: 0,
    fb: 0,
    ld: 0,
    pu: 0,
    sb: 0,
    cs: 0,
    po: 0,
    ab: 0,
    singles: 0,
    doubles: 0,
    triples: 0,
    gdp: 0,
    sf: 0,
    roe: 0, 
    entered: '',
    exit: ''
}



playByPlay.allPlays.forEach(play => {

    if (playerData.length === 0) {
        playerData.push({playerId: play.matchup.batter.id, playerName: play.matchup.batter.fullName, type:'batter', stats: emptyBatterStats})
        playerData.push({playerId: play.matchup.pitcher.id, playerName: play.matchup.pitcher.fullName, type: 'pitcher', stats: emptyPitcherStats})
    }

    let batter = playerData.find(p => p.playerId == play.matchup.batter.id);

    let pitcher = playerData.find(p => p.playerId == play.matchup.pitcher.id);

    if (batter === undefined) {
        batter = {playerId: play.matchup.batter.id, playerName: play.matchup.batter.fullName, type: 'batter', stats: emptyBatterStats}
        playerData.push(batter)
    }

    if (pitcher == undefined) {
        pitcher = {playerId: play.matchup.pitcher.id, playerName: play.matchup.pitcher.fullName, type: 'pitcher', stats: emptyPitcherStats}
        playerData.push(pitcher)
    }


    if (play.result.type === 'atBat') {

        batter.stats.pa+=1;
        batter.stats.rbi+=play.result.rbi

        if (play.result.eventType === 'strikeout') {
            batter.stats.so+=1;
            pitcher.stats.so++;
        }

        if (play.result.eventType === 'walk') {
            batter.stats.bb+=1;
            pitcher.stats.bb+=1;
        }

        if (play.result.eventType === 'intent_walk') {
            batter.stats.ibb+=1;
            pitcher.stats.ibb+=1;
        }

        if (play.result.eventType === 'hit_by_pitch') {
            batter.stats.hbp+=1;
            pitcher.stats.hbp+=1;
        }

        if (play.result.eventType !== 'walk' && play.result.eventType !== 'hit_by_pitch' && play.result.eventType !== 'sac_bunt' && play.result.eventType !== 'sac_fly' && play.result.eventType !== 'intent_walk') {
            batter.stats.ab+=1;
        }

        if (play.result.eventType === 'single') {
            batter.stats.h+=1;
            pitcher.stats.h+=1;
            batter.stats.singles+=1;
            pitcher.stats.singles++;
        }

        if (play.result.eventType === 'double') {
            batter.stats.h+=1;
            pitcher.stats.h+=1;
            batter.stats.doubles+=1;
            pitcher.stats.doubles+=1;
        }

        if (play.result.eventType === 'triple') {
            batter.stats.h+=1;
            pitcher.stats.h+=1;
            batter.stats.triples+=1;
            pitcher.stats.triples+=1;
        }

        if (play.result.eventType === 'home_run') {
            batter.stats.h+=1;
            pitcher.stats.h+=1;
            batter.stats.hr+=1;
            batter.stats.r+=1;
            pitcher.stats.hr+=1;
            pitcher.stats.r+=play.result.rbi;
            R+=1;
        }



        let pitchIsBallOrStrike

        pitcher.stats.bf++;

        play.playEvents.forEach(event => {


            if (event.isPitch) {

                pitchIsBallOrStrike = false;
                pitcher.stats.pit+=1
            }

            if (event.details.call) {

                // console.log(event.details.call.code)

                if (ballPitchCodes.indexOf(event.details.call.code) !== -1) {
                    pitcher.stats.balls+=1
                    pitchIsBallOrStrike = true;

                }

                if (foo.indexOf(event.details.call.code) === -1) {
                    foo.push(event.details.call.code)
                }

                if (strikePitchCodes.indexOf(event.details.call.code) !== -1) {
                    pitcher.stats.str+=1;
                    pitchIsBallOrStrike = true;

                    if (event.details.call.code === 'C') {
                        pitcher.stats.stl++;
                    }
                    
                    if (event.details.call.code === 'S') {
                        pitcher.stats.sts++;
                    }


                }

                if (event.hitData) {
                    if (event.hitData.trajectory === 'ground_ball' || event.hitData.trajectory === 'bunt_grounder') {
                        pitcher.stats.gb++;
                    }

                    if (event.hitData.trajectory === 'fly_ball') {
                        pitcher.stats.fb++;
                    }

                    if (event.hitData.trajectory === 'line_drive') {
                        pitcher.stats.ld++;
                        pitcher.stats.fb++;
                    }

                    if (event.hitData.trajectory === 'popup' || event.hitData.trajectory === 'bunt_popup') {
                        pitcher.stats.pu++;
                        pitcher.stats.fb++;
                    }
                }


                if (!pitchIsBallOrStrike) {
                    console.log('pitch was not ball or strike')
                    console.log(event.details.call)
                }
            } else if (event.isPitch) {
                console.log('non pitch event')
                console.log(event)
            }

        })


    }

    if (play.runners.length > 0) {
        play.runners.forEach(runner => {
            if (runner.movement.end === "score") {
                R+=1;
            }

            if (runner.details.eventType.startsWith('stolen_base')) {
                SB+=1;
                pitcher.stats.sb++;
            }
        })
    }
})

TB = singles + 2*doubles + 3*triples + 4*HR;

const BA = H/AB;
const OBP = (H+BB+IBB+HBP)/(AB+H+BB+IBB+HBP);
const SLG = TB/AB;
const OPS = OBP+SLG;

playerData.filter(player => player.type === 'batter').forEach(batter => {
    batter.stats.tb = batter.stats.singles + batter.stats.doubles*2 + batter.stats.triples*3 + batter.stats.hr*4;
    batter.stats.obp = (batter.stats.h + batter.stats.bb + batter.stats.ibb + batter.stats.hbp) / (batter.stats.h + batter.stats.bb + batter.stats.ibb + batter.stats.hbp + batter.stats.ab)
    batter.stats.slg = batter.stats.tb / batter.stats.ab;
    batter.stats.obp = batter.stats.obp + batter.stats.slg
})


console.log(playerData.find(player => player.playerName === 'Rick Porcello'))

console.log(playerData.map(player => player.playerName))