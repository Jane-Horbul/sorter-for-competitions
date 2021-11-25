import {ops} from "./communication.js"

function createClient(status){
    var res = new Map();
    res.set("ClientStatus", status);
    return res;
}

function createSportsman(id, name, surname, bd, age, weight, sex, team, qual, admit, disc, gr_num){
    var res = new Map();
    res.set("Id", id)
    .set("Name", name)
    .set("Surname", surname)
    .set("Birth", bd)
    .set("Age", age)
    .set("Weight", weight)
    .set("Sex", sex)
    .set("Team", team)
    .set("Qualification", qual)
    .set("Admited", admit)
    .set("Disciplines", disc)
    .set("Groups_num", gr_num);
    return res;
}

function createPair(id, gid, red_sp, blue_sp, winner, number, list, time, final, child){
    var res = new Map();
    res.set("Id",           id)
    .set("Group_id",        gid)
    .set("Sportsman_red",   red_sp)
    .set("Sportsman_blue",  blue_sp)
    .set("Winner",          winner)
    .set("Number",          number)
    .set("Pairs_list",      list)
    .set("Time",            time)
    .set("Final_part",      final)
    .set("Child_pair",      child);
    return res;
}

function createFormula(prepare, rounds_num, round, rest, hold, fmin, fmax){
    var res = new Map();
    res
    .set("Preparation",     "" + prepare)
    .set("Rounds_num",      "" + rounds_num)
    .set("Round",           "" + round)
    .set("Rest",            "" + rest)
    .set("Afterhold",       "" + hold)
    .set("Final_min",       "" + fmin)
    .set("Final_max",       "" + fmax);
    return res;
}

function createGroup(id, name, fs, agemin, agemax, wmin, wmax, qmin, qmax, sex, disc, sports, pairs, frmls){
    var res = new Map();
    res.set("Id", id)
    .set("Name", name)
    .set("Form_sys", fs)
    .set("Age_min", agemin)
    .set("Age_max", agemax)
    .set("Weight_min", wmin)
    .set("Weight_max", wmax)
    .set("Qualification_min", qmin)
    .set("Qualification_max", qmax)
    .set("Sex", sex)
    .set("Division", disc)
    .set("Members", sports)
    .set("Pairs", pairs)
    .set("Formulas", frmls);
    return res;
}

function createCompetition(id, name, desc, start, end, sports, groups){
    var res = new Map();
    res.set("Id",       id)
    .set("Name",        name)
    .set("Description", desc)
    .set("StartDate",   start)
    .set("EndDate",     end)
    .set("Sportsmans",  sports)
    .set("Groups",      groups);
    return res;
}

function createGroupStat(gid, gname, disc, score, pairs_num, wins, place){
    var res = new Map();
    res.set("GroupId",  gid)
    .set("GroupName",   gname)
    .set("Discipline",  disc)
    .set("Score",       score)
    .set("PairsNum",    pairs_num)
    .set("WinsNum",     wins)
    .set("Place",       place);
    return res;
}

function createCompStat(cid, cname, disc, adm, act, grStat, pairs){
    var res = new Map();
    res.set("CompetitionId", cid)
    .set("CompetitionName", cname)
    .set("Disciplines", disc)
    .set("Admition", adm)
    .set("IsActive", act)
    .set("GroupsStatistic", grStat)
    .set("Pairs", pairs);
    return res;
}

function createDepartment(id, name, comps, sports, divs, quals){
    var res = new Map();
    res.set("Id",             id);
    res.set("Name",           name);
    res.set("Competitions",   comps);
    res.set("Sportsmens",     sports);
    res.set("Divisions",      divs.split(","));
    var qualsMap = new Map();
    quals.split(",").forEach(pair => {
        var parts = pair.split("-");
        qualsMap.set(parts[0], parts[1]);
    });
    res.set("Qualifications", qualsMap);
    return res;
}

var dbgClient = createClient("Root");

var dbgSportsmen = [
    createSportsman("1", "John", "Smith",   "1996-05-15T00:00", "25", "88", "male", "Team 1", "1", "yes", "Disc1,Disc2", "2"),
    createSportsman("2", "Adam", "Ortego",  "1997-11-02T00:00", "24", "77", "male", "Team 2", "2", "yes", "Disc1,Disc2", "2"),
];

var dbgPairs1 = [
    createPair("G1P1", "1", "1", "2", "2", "1", undefined, "2021-12-21T11:00", "1/2", "G1P2"),
    createPair("G1P2", "1", "2", "1", "1", "2", undefined, "2021-12-21T11:30", "1/1", undefined),
];

var dbgPairs2 = [
    createPair("G2P1", "1", "1", "2", "2", "1", undefined, "2021-12-21T11:00", "1/2", "G2P2"),
    createPair("G2P2", "1", "2", "1", "1", "2", undefined, "2021-12-21T11:30", "1/1", undefined),
];

var dbgFrmls = [createFormula(10, 3, 90, 30, 30, 1, 1), createFormula(10, 2, 60, 30, 30, -1, -1)];

var dbgGroups = [
    createGroup("1", "Group 1", "Olimpic", "18", undefined, "70", "80", undefined, undefined, "male", "Disc1", dbgSportsmen, dbgPairs1, dbgFrmls),
    createGroup("2", "Group 2", "Olimpic", "20", "30", "75", "80", "1", "10", "male", "Disc2", dbgSportsmen, dbgPairs2, dbgFrmls)
];

var dbgCompetitions = [
    createCompetition("1", "Competition 1", "Comp description 1", "2021-12-21T09:00", "2021-12-22T19:00", dbgSportsmen, dbgGroups),
    createCompetition("2", "Competition 2", "Comp description 2", "2021-12-27T10:00", "2021-12-27T19:00", dbgSportsmen, dbgGroups),
];

var dbgGroupStats = [
    createGroupStat("1", "Group 1", "Disc1", "15", "1", "1", "1"),
    createGroupStat("2", "Group 2", "Disc2", "1", "1", "0", "2")
];

var dbgCompStats = [
    createCompStat("1", "Competition 1", ["Disc1","Disc2"], "yes", "yes", dbgGroupStats, dbgPairs1),
    createCompStat("2", "Competition 2", ["Disc1","Disc2"], "yes", "yes", dbgGroupStats, dbgPairs2)
];

var dbgDepartment = createDepartment("D0", "Debug department", dbgCompetitions, dbgSportsmen, "Disc1,Disc2,Disc3", "1-Qualification1,2-Qualification2,3-Qualification3");

export const server = {
    access: {
        login(login, pass)                  {location.reload();},
        getClient()                         {return ops.createClient(dbgClient);}
    },
    department: {
        get()                               {return ops.createDepartmant(dbgDepartment);},
        edit(name)                          {location.reload();},
        addQualification(value, name)       {},
        deleteQualification(value)          {},
        addDiscipline(name)                 {},
        deleteDiscipline(name)              {}
    },
    competition: {
        get(cid)                            {return ops.createCompetition(dbgCompetitions[0]);},
        edit(cp)                            {location.reload();},
        create(cp)                          {location.reload();},
        sortSportsmans(cid)                 {return dbgCompetitions[0];},
        addSprotsmen(cid, ids)              {location.reload();},
        delSprotsman(cid, sid)              {location.reload();},
        formPairs(cid)                      {return dbgCompetitions[0];}
    },
    group: {
        get(cid, gid)                       {return ops.createGroup(dbgGroups[0]);},
        edit(cid, gid, gr)                  {location.reload();},
        create(cid, gr)                     {location.reload();},
        remove(cid, gid)                    {return dbgGroups[0];},
        excludeSportsman(cid, gid, sid)     {},
        includeSportsList(cid, gid, sids)   {location.reload();},
        refreshPairs(cid, gid)              {return dbgGroups[0];},
        setPairWinner(cid, gid, pid, color) {location.reload();},
        addFormula(cid, gid, formula)       {},
        deleteFormula(cid, gid, formula)    {},
        createFormula(map)                  {return mapToFormula(map);}
    },
    sportsman: {
        get(sid)                            {return ops.createSportsman(dbgSportsmen[0]);},
        getStatistics(sid)                  {return ops.createStatistics(dbgCompStats[0]);},
        create(sp)                          {location.reload();},
        remove(sid)                         {},
        edit(sid, sp)                       {location.reload();},
        addDiscipline(sid, cid, disc)       {},
        delDiscipline(sid, cid, disc)       {},
        admitChange(sid, cid, stat)         {},
    }
}