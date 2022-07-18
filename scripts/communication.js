import {commonStrings, helpers, formatDate} from "./common.js"


var dpLink = window.location.href.substring(0, window.location.href.lastIndexOf("/"));

function castToGroupStat(object, cid) {
    return {
        obj:        object,
        group:      "ParentGroup",
        groupName:  "GroupName",
        discipline: "Discipline",
        score:      "Score",
        pairsNum:   "PairsNum",
        winsNum:    "Wins",
        place:      "Place",
        link:      "/competition?cid=" + cid + "/group?gid=",

        getGroupId()          {return this.obj[this.group];},
        getGroupName()        {return this.obj[this.groupName];},
        getDiscipline()       {return this.obj[this.discipline];},
        getScore()            {return this.obj[this.score];},
        getPairsNum()         {return this.obj[this.pairsNum];},
        getWinsNum()          {return this.obj[this.winsNum];},
        getPlace()            {return this.obj[this.place];},
        getGroupLink()        {return dpLink + this.link + this.getGroupId();}
    };
}

function castToCompetitionStat(object) {
    return {
        obj:                object,
        competitionId:      "Competition",
        competitionName:    "CompetitionName",
        disciplines:        "Disciplines",
        allDisciplines:      "AllDisciplines",
        admit:              "Admitted",
        groupsStats:        "GroupStats",
        pairs:              "Pairs",
        link:               "/competition?cid=",

        getCompetitionId()      {return this.obj[this.competitionId];},
        getCompetitionName()    {return this.obj[this.competitionName];},
        getDisciplines()        {return this.obj[this.disciplines];},
        getAllDisciplines()     {return this.obj[this.allDisciplines];},
        isAdmitted()            {return this.obj[this.admit];},
        getGroupsStats()        {
                                    var cid = this.getCompetitionId();
                                    return this.obj[this.groupsStats].map( function(gs){ return castToGroupStat(gs, cid);});
                                },
        getPairs()              {return this.obj[this.pairs].map(castToPair);},
        getCompetitionLink()    {return dpLink + this.link + this.getCompetitionId(); }
    };
}

function castToSportsman(object) {
    return {
        obj:    object,
        id:         "Id",
        name:       "Name",
        surname:    "Surname",
        birth:      "BirthDate",
        age:        "Age",
        weight:     "Weight",
        sex:        "Sex",
        qual:       "Qualification",
        team:       "Team",
        region:     "Region",
        trainer:    "Trainer",
        photo:      "Photo",
        accred:     "AccreditationOut",
        admit:      "Admitted",
        disciplines:"Disciplines",
        groupsNum:  "GroupStatsNum",
        compStats:  "Statistics",
        link:       "/sportsman?sid=",

        getId()               {return this.obj[this.id];},
        getName()             {return this.obj[this.name];},
        getSurname()          {return this.obj[this.surname];},
        getBirth(f)           {return formatDate(this.obj[this.birth], f);},
        getAge()              {return this.obj[this.age];},
        getWeight()           {return this.obj[this.weight];},
        getSex()              {return this.obj[this.sex];},
        getTeam()             {return this.obj[this.team];},
        getTrainer()          {return this.obj[this.trainer];},
        getRegion()           {return this.obj[this.region];},
        getQualification()    {return this.obj[this.qual];},
        getAdmition()         {return this.obj[this.admit];},
        getDisciplines()      {return this.obj[this.disciplines];},
        getGroupsNum()        {return this.obj[this.groupsNum];},
        getPhoto()            {return this.obj[this.photo];},
        getAccreditation()    {return this.obj[this.accred];},
        getStatistics()       {return this.obj[this.compStats].map(castToCompetitionStat);},

        setName(v)             {this.obj[this.name] = v;},
        setSurname(v)          {this.obj[this.surname] = v;},
        setBirth(v)            {this.obj[this.birth] = v;},
        setWeight(v)           {this.obj[this.weight] = v;},
        setSex(v)              {this.obj[this.sex] = v;},
        setTeam(v)             {this.obj[this.team] = v;},
        setQualification(v)    {this.obj[this.qual] = v;},
        setTrainer(v)          {this.obj[this.trainer] = v;},
        setAdmition(v)         {this.obj[this.admit] = v;},
        setDisciplines(v)      {this.obj[this.disciplines] = v;},
        setAccreditation(v)    {this.obj[this.accred] = v;},

        getLink()              {return "/sportsman?sid=" + this.getId();}
    };
}

function castToTrainer(object) {
    return {
        obj:        object,
        id:         "Id",
        name:       "Name",
        surname:    "Surname",
        birth:      "BirthDate",
        sex:        "Sex",
        team:       "Team",
        region:     "Region",
        email:      "Email",
        pass:       "Password",
        photo:      "Photo",
        accred:     "AccreditationOut",
        link:       "/trainer?tid=",

        getId()               {return this.obj[this.id];},
        getName()             {return this.obj[this.name];},
        getSurname()          {return this.obj[this.surname];},
        getBirth(f)           {return formatDate(this.obj[this.birth], f);},
        getSex()              {return this.obj[this.sex];},
        getTeam()             {return this.obj[this.team];},
        getRegion()           {return this.obj[this.region];},
        getEmail()            {return this.obj[this.email];},
        getPhoto()            {return this.obj[this.photo];},
        getAccreditation()    {return this.obj[this.accred];},
        getLink()             {return this.link + this.getId();},

        setId(v)               {this.obj[this.id] = v;},
        setName(v)             {this.obj[this.name] = v;},
        setSurname(v)          {this.obj[this.surname] = v;},
        setBirth(v)            {this.obj[this.birth] = v;},
        setSex(v)              {this.obj[this.sex] = v;},
        setTeam(v)             {this.obj[this.team] = v;},
        setRegion(v)           {this.obj[this.region] = v;},
        setEmail(v)            {this.obj[this.email] = v;},
        setPassword(v)         {this.obj[this.pass] = v;},
        setAccreditation(v)    {this.obj[this.accred] = v;},
    };
}

function castToJudge(object) {
    return {
        obj:        object,
        id:         "Id",
        name:       "Name",
        surname:    "Surname",
        birth:      "BirthDate",
        sex:        "Sex",
        region:     "Region",
        email:      "Email",
        pass:       "Password",
        photo:      "Photo",
        accred:     "AccreditationOut",
        link:       "/judge?jid=",

        getId()               {return this.obj[this.id];},
        getName()             {return this.obj[this.name];},
        getSurname()          {return this.obj[this.surname];},
        getBirth(f)           {return formatDate(this.obj[this.birth], f);},
        getSex()              {return this.obj[this.sex];},
        getRegion()           {return this.obj[this.region];},
        getEmail()            {return this.obj[this.email];},
        getPhoto()            {return this.obj[this.photo];},
        getAccreditation()    {return this.obj[this.accred];},
        getLink()             {return this.link + this.getId();},

        setId(v)               {this.obj[this.id] = v;},
        setName(v)             {this.obj[this.name] = v;},
        setSurname(v)          {this.obj[this.surname] = v;},
        setBirth(v)            {this.obj[this.birth] = v;},
        setSex(v)              {this.obj[this.sex] = v;},
        setRegion(v)           {this.obj[this.region] = v;},
        setEmail(v)            {this.obj[this.email] = v;},
        setPassword(v)         {this.obj[this.pass] = v;},
        setAccreditation(v)    {this.obj[this.accred] = v;},
    };
}

function castToAdmin(object) {
    return {
        obj:        object,
        id:         "Id",
        name:       "Name",
        surname:    "Surname",
        birth:      "BirthDate",
        sex:        "Sex",
        region:     "Region",
        email:      "Email",
        pass:       "Password",
        photo:      "Photo",
        accred:     "AccreditationOut",
        link:       "/admin?nid=",

        getId()               {return this.obj[this.id];},
        getName()             {return this.obj[this.name];},
        getSurname()          {return this.obj[this.surname];},
        getBirth(f)           {return formatDate(this.obj[this.birth], f);},
        getSex()              {return this.obj[this.sex];},
        getRegion()           {return this.obj[this.region];},
        getEmail()            {return this.obj[this.email];},
        getPhoto()            {return this.obj[this.photo];},
        getAccreditation()    {return this.obj[this.accred];},
        getLink()             {return this.link + this.getId();},

        setId(v)               {this.obj[this.id] = v;},
        setName(v)             {this.obj[this.name] = v;},
        setSurname(v)          {this.obj[this.surname] = v;},
        setBirth(v)            {this.obj[this.birth] = v;},
        setSex(v)              {this.obj[this.sex] = v;},
        setRegion(v)           {this.obj[this.region] = v;},
        setEmail(v)            {this.obj[this.email] = v;},
        setPassword(v)         {this.obj[this.pass] = v;},
        setAccreditation(v)    {this.obj[this.accred] = v;},
    };
}

function castToPair(object) {
    return {
        obj:        object,
        id:         "Id",
        group:      "ParentGroup",
        resSports:  "RedSportsman",
        blueSports: "BlueSportsman",
        winner:     "Winner",
        number:     "Number",
        arena:      "Arena",
        time:       "Time",
        final:      "FinalPart",
        child:      "ChildPair",
        redScore:   "RedScore",
        blueScore:  "BlueScore",
        round:      "Round",

        getId()             {return this.obj[this.id];},
        getGroupId()        {return this.obj[this.group];},
        getRedSp()          {return this.obj[this.resSports];},
        getBlueSp()         {return this.obj[this.blueSports];},
        getWinner()         {return this.obj[this.winner];},
        getNumber()         {return this.obj[this.number];},
        getArena()          {return this.obj[this.arena];},
        getTime(f)          {return formatDate(this.obj[this.time], f);},
        getFinalPart()      {return this.obj[this.final];},
        getChildPair()      {return this.obj[this.child];},
        getRound()          {return this.obj[this.round];},
        getRedScore()       {return this.obj[this.redScore];},
        getBlueScore()      {return this.obj[this.blueScore];}
    };
}

function castToFormula(object) {
    return {
        obj:        object,
        prepare:    "Preparation",
        roundsNum:  "RoundsNum",
        round:      "RoundDuration",
        rest:       "Rest",
        hold:       "Hold",
        finalMin:   "Name",
        finalMax:   "FinalMax",
        
        getPreparation()    {return this.obj[this.prepare];},
        getRoundsNum()      {return this.obj[this.roundsNum];},
        getRound()          {return this.obj[this.round];},
        getRest()           {return this.obj[this.rest];},
        getAfterhold()      {return this.obj[this.hold];},
        getFinalMin()       {return this.obj[this.finalMin];},
        getFinalMax()       {return this.obj[this.finalMax];},
        
        setPreparation(v)    {this.obj[this.prepare] = v;},
        setRoundsNum(v)      {this.obj[this.roundsNum] = v;},
        setRound(v)          {this.obj[this.round] = v;},
        setRest(v)           {this.obj[this.rest] = v;},
        setAfterhold(v)      {this.obj[this.hold] = v;},
        setFinalMin(v)       {this.obj[this.finalMin] = v;},
        setFinalMax(v)       {this.obj[this.finalMax] = v;}
        
    };
}

function castToGroup(object) {
    return {
        obj:            object,
        name:           "Name",
        id:             "Id",
        system:         "System",
        ageMin:         "AgeMin",
        ageMax:         "AgeMax",
        weightMin:      "WeightMin",
        weightMax:      "WeightMax",
        qualMin:        "QualificationMin",
        qualMax:        "QualificationMax",
        sex:            "Sex",
        discipline:     "Discipline",
        sportsmen:      "Sportsmen",
        sportsmenNum:   "SportsmenNumber",
        pairs:          "Pairs",
        formulas:       "Formulas",
        link:           "/group?gid=",
        getId()           {return this.obj[this.id];},
        getName()         {return this.obj[this.name];},
        getFormSystem()   {return this.obj[this.system];},
        getAgeMin()       {return this.obj[this.ageMin];},
        getAgeMax()       {return this.obj[this.ageMax];},
        getWeightMin()    {return this.obj[this.weightMin];},
        getWeightMax()    {return this.obj[this.weightMax];},
        getQualMin()      {return this.obj[this.qualMin];},
        getQualMax()      {return this.obj[this.qualMax];},
        getSex()          {return this.obj[this.sex];},
        getDiscipline()   {return this.obj[this.discipline];},
        getSportsNum()    {return this.obj[this.sportsmenNum];},
        getSportsmen()    {return this.obj[this.sportsmen].map(castToSportsman);},
        getPairs()        {return this.obj[this.pairs].map(castToPair);},
        getFormulas()     {return this.obj[this.formulas].map(castToFormula);},
        getLink()         {return this.link + this.getId();},

        getPairById(id)   { return this.getPairs().find(pr => helpers.strEquals(pr.getId(), id));},

        setId(v)           {this.obj[this.id] = v;},
        setName(v)         {this.obj[this.name] = v;},
        setFormSystem(v)   {this.obj[this.system] = v;},
        setAgeMin(v)       {this.obj[this.ageMin] = v;},
        setAgeMax(v)       {this.obj[this.ageMax] = v;},
        setWeightMin(v)    {this.obj[this.weightMin] = v;},
        setWeightMax(v)    {this.obj[this.weightMax] = v;},
        setQualMin(v)      {this.obj[this.qualMin] = v;},
        setQualMax(v)      {this.obj[this.qualMax] = v;},
        setSex(v)          {this.obj[this.sex] = v;},
        setDiscipline(v)   {this.obj[this.discipline] = v;}
    };
}

function castToSchedule(sch){
    var intervals = sch.split(commonStrings.mapDivider);
    return {start: intervals[0], end: intervals[1]};
}

function castToArena(object) {
    return {
        obj:        object,
        name:       "Name",
        id:         "Id",
        groups:     "Groups",
        distance:   "Distance",
        ageMin:     "AgeMin",
        ageMax:     "AgeMax",
        weightMin:  "WeightMin",
        weightMax:  "WeightMax",
        qualMin:    "QualMin",
        qualMax:    "QualMax",
        finalMin:   "FinalMin",
        finalMax:   "FinalMax",
        pairs:      "Pairs",
        pairsNum:   "PairsNum",
        schedule:   "Schedule",
        start:      "Start",
        load:       "Load",
        activePair: "ActivePair",
        link:       "/arena?aid=",

        getName()         {return this.obj[this.name];},
        getId()           {return this.obj[this.id];},
        getDistance()     {return this.obj[this.distance];},
        getAgeMin()       {return this.obj[this.ageMin];},
        getAgeMax()       {return this.obj[this.ageMax];},
        getWeightMin()    {return this.obj[this.weightMin];},
        getWeightMax()    {return this.obj[this.weightMax];},
        getQualMin()      {return this.obj[this.qualMin];},
        getQualMax()      {return this.obj[this.qualMax];},
        getFinalMin()     {return this.obj[this.finalMin];},
        getFinalMax()     {return this.obj[this.finalMax];},
        getPairsNum()     {return this.obj[this.pairsNum];},
        getActivePair()   {return this.obj[this.activePair];},
        getStart(f)       {return formatDate(this.obj[this.start], f);},
        getLoad()         {return this.obj[this.load];},
        getSchedule()     {return this.obj[this.schedule].map(castToSchedule);},
        getGroups()       {return this.obj[this.groups].map(castToGroup);},
        getPairs()        {return this.obj[this.pairs].map(castToPair);},
        getLink()         {return this.link + this.getId();},

        setName(v)         {this.obj[this.name] = v;},
        setId(v)           {this.obj[this.id] = v;},
        setGroups(v)       {this.obj[this.groups] = v;},
        setPairs(v)        {this.obj[this.pairs] = v;},
        setDistance(v)     {this.obj[this.distance] = v;},
        setAgeMin(v)       {this.obj[this.ageMin] = v;},
        setAgeMax(v)       {this.obj[this.ageMax] = v;},
        setWeightMin(v)    {this.obj[this.weightMin] = v;},
        setWeightMax(v)    {this.obj[this.weightMax] = v;},
        setQualMin(v)      {this.obj[this.qualMin] = v;},
        setQualMax(v)      {this.obj[this.qualMax] = v;},
        setFinalMin(v)     {this.obj[this.finalMin] = v;},
        setFinalMax(v)     {this.obj[this.finalMax] = v;},
        setSchedule(v)     {this.obj[this.schedule] = v;},

        getPairById(id)    { 
            return this.getPairs().find(pr => helpers.strEquals(pr.getId(), id));
        }
    };
}

function castToCompetition(object) {
    return {
        obj:        object,
        name:       "Name",
        id:         "Id",
        desc:       "Description",
        start:      "StartDateTime",
        end:        "EndDateTime",
        sportsmen:  "Sportsmen",
        groups:     "Groups",
        arenas:     "Arenas",
        link:       "/competition?cid=",

        getId()                 {return this.obj[this.id];},
        getName()               {return this.obj[this.name];},
        getDescription()        {return this.obj[this.desc];},
        getStartDate(f)         {return formatDate(this.obj[this.start], f);},
        getEndDate(f)           {return formatDate(this.obj[this.end], f);},
        getLink()               {return this.link + this.getId();},
        getSportsmen()          {return this.obj[this.sportsmen].map(castToSportsman);},
        getGroups()             {return this.obj[this.groups].map(castToGroup);},
        getArenas()             {return this.obj[this.arenas].map(castToArena);},

        setName(v)              {this.obj[this.name] = v;},
        setId(v)                {this.obj[this.id] = v;},
        setDescription(v)       {this.obj[this.desc] = v;},
        setStartDate(v)         {this.obj[this.start] = v;},
        setEndDate(v)           {this.obj[this.end] = v;},

        getGroupById(id)        { return this.getGroups().find(gr => helpers.strEquals(gr.getId(), id));}
    };
}

function castToMap(obj){
    var map = new Map();
    for(const [key, value] of Object.entries(obj)){
        map.set(key, value);
    }
    return map;
}

function castToDepatrment(object) {
    return {
        obj:            object,
        name:           "Name",
        id:             "Id",
        competitions:   "Competitions",
        sportsmen:      "Sportsmen",
        trainers:       "Trainers",
        disciplines:    "Disciplines",
        quals:          "Qualifications",
        
        getId()                 {return this.obj[this.id];},
        getName()               {return this.obj[this.name];},
        getDisciplines()        {return this.obj[this.disciplines];},
        getQualifications()     {return castToMap(this.obj[this.quals]);},
        getCompetitions()       {return this.obj[this.competitions].map(castToCompetition);},
        getSportsmen()          {return this.obj[this.sportsmen].map(castToSportsman);},
        getTrainers()           {return this.obj[this.trainers].map(castToTrainer);},

        getSportsmanById(id)    { return this.getSportsmen().find(sp => helpers.strEquals(sp.getId(), id));}
    };
}

function castToClient(object) {
    return {
        obj:        object,
        status:     "Status",
        id:         "Id",
        name:       "Name",
        surname:    "Surname",
        photo:      "Photo",
        login:      "Login",
        pass:       "Password",
        newLogin:   "NewLogin",
        newPass:    "NewPassword",
        lang:       "lang",

        root:   "Root",
        admin:  "Admin",
        trainer:"Trainer",
        judge:  "Judge",
        guest:  "Guest",

        getStatus()         {return this.obj[this.status];},
        getId()             {return this.obj[this.id];},
        getName()           {return this.obj[this.name];},
        getSurname()        {return this.obj[this.surname];},
        getPhoto()          {return this.obj[this.photo];},
        getLang()           {return this.obj[this.lang];},

        isRoot()            {return helpers.strEquals(this.getStatus(), this.root);},
        isAdmin()           {return helpers.strEquals(this.getStatus(), this.admin);},
        isTrainer()         {return helpers.strEquals(this.getStatus(), this.trainer);},
        isJudge()           {return helpers.strEquals(this.getStatus(), this.judge);},
        isGuest()           {return helpers.strEquals(this.getStatus(), this.guest);},

        setStatus(v)        {this.obj[this.status] = v;},
        setLogin(v)         {this.obj[this.login] = v;},
        setNewLogin(v)      {this.obj[this.newLogin] = v;},
        setPassword(v)      {this.obj[this.pass] = v;},
        setNewPassword(v)   {this.obj[this.newPass] = v;}
    };
}

export const ops = {
    createClient(o)         {return castToClient        (o == undefined ? {} : o);},
    createDepartmant(o)     {return castToDepatrment    (o == undefined ? {} : o);},
    createSportsman(o)      {return castToSportsman     (o == undefined ? {} : o);},
    createTrainer(o)        {return castToTrainer       (o == undefined ? {} : o);},
    createJudge(o)          {return castToJudge         (o == undefined ? {} : o);},
    createAdmin(o)          {return castToAdmin         (o == undefined ? {} : o);},
    createPair(o)           {return castToPair          (o == undefined ? {} : o);},
    createGroup(o)          {return castToGroup         (o == undefined ? {} : o);},
    createArena(o)          {return castToArena         (o == undefined ? {} : o);},
    createCompetition(o)    {return castToCompetition   (o == undefined ? {} : o);}, 
}


function sendRequest(request, createF) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', request, false);
    xhr.send();
    if (xhr.status != 200)   return new Map();
    var answer = JSON.parse(xhr.responseText);
    if(answer.ErrorCode != 0)
        alert(answer.Body);
    return createF == undefined ? answer.Body : createF(answer.Body);
}

function sendFormData(formName, data, refresh) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var answer = JSON.parse(xhr.responseText);
            if(answer.ErrorCode != 0)
                alert(answer.Body);
            if(refresh == true)
                location().reload();
        };
    };
    xhr.open('POST', "/" + formName, true);
    xhr.send(data);
    return true;
}

function sendList(formName, obj, refresh) {
    var xhr = new XMLHttpRequest();
    var boundary = String(Math.random()).slice(2);
    var body = ['\r\n'];
    for(const [key, value] of Object.entries(obj)){
        body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + value + '\r\n');
    }
    body = body.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';

    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var answer = JSON.parse(xhr.responseText);
            if(answer.ErrorCode != 0)
                alert(answer.Body);
            if(refresh == true)
                location().reload();
        };
    };
    xhr.open('POST', "/" + formName, true);
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    xhr.send(body);
    return true;
}

function getCompStatistics(spArray){
    var list = {};
    spArray.forEach(sp => {
        list[sp.getId() + "=" + sp.getAdmition()] = helpers.arrayToString(sp.getDisciplines());
    });
    return list;
}
export const server = {
    access: {
        loginLink:          "client-login",
        logoutLink:         "client-logout",
        getStatusLink:      "client-status-get",
        changeLoginLink:    "client-change-login",
        changePassLink:     "client-change-pass",
        getLangLink(lang)   {return "client-change-lang?lang=" + lang;},

        logout()            {sendList(this.logoutLink,                    {},     true);},
        login(cl)           {sendList(this.loginLink,                     cl.obj, true);},
        changeLogin(cl)     {sendList(this.changeLoginLink,               cl.obj, true);},
        changePass(cl)      {sendList(this.changePassLink,                cl.obj, true);},
        changeLang(lang)    {sendList(this.getLangLink(lang),             {},     true);},
        getClient()         {return sendRequest(this.getStatusLink, ops.createClient);},
    },
    department: {
        getLink:                        "competition-list-get?",
        editLink:                       "department-info-edit",
        qualAddLink:                    "department-qual-add",
        qualRemoveLink:                 "department-qual-del",
        discAddLink:                    "department-disc-add",
        discRemoveLink:                 "department-disc-del",

        get()                           {return sendRequest(this.getLink, ops.createDepartmant);},
        edit(name)                      {sendList(this.editLink,          { [castToDepatrment().name]:        name },   true);},
        addDiscipline(name)             {sendList(this.discAddLink,       { [castToDepatrment().disciplines]: name },   false);},
        deleteDiscipline(name)          {sendList(this.discRemoveLink,    { [castToDepatrment().disciplines]: name },   false);},
        deleteQualification(value)      {sendList(this.qualRemoveLink,    { [castToDepatrment().quals]:       value },  false);},
        addQualification(value, name)   {sendList(this.qualAddLink,       { [castToDepatrment().quals]: value + commonStrings.mapDivider + name}, false)},
    },
    competition: {
        createLink:                     "department-comp-add",
        getLink(cid)                    {return "competition-get?cid=" + cid;},
        editLink(cid)                   {return "competition-info-edit?cid=" + cid;},
        removeLink(cid)                 {return "competition-remove?cid=" + cid;},
        addSportsLink(cid)              {return "new-member-form?cid=" + cid;},
        removeSportsLink(cid, sid)      {return "competition-member-del?cid=" + cid + "&sid=" + sid;},
        updatePairsLink(cid)            {return "competition-pairs-refresh?cid=" + cid;},
        sortSportsLink(cid)             {return "competition-members-sort?cid=" + cid;},

        get(cid)                        {return sendRequest(this.getLink(cid),          ops.createCompetition);},
        sortSportsmans(cid)             {return sendRequest(this.sortSportsLink(cid),   ops.createCompetition);},
        formPairs(cid)                  {return sendRequest(this.updatePairsLink(cid),  ops.createCompetition);},

        create(cp)                      {sendList(this.createLink,                  cp.obj,                 true);},
        edit(cp)                        {sendList(this.editLink(cp.getId()),        cp.obj,                 true);},
        delete(cid)                     {sendList(this.removeLink(cid),             {},                     false);},
        delSprotsman(cid, sid)          {sendList(this.removeSportsLink(cid, sid),  {},                     true);},
        addSprotsmen(cid, ids)          {sendList(this.addSportsLink(cid),          getCompStatistics(ids), true);},   
    },
    group: {
        getLink(cid, gid)                   {return "group-get?cid="                + cid + "&gid=" + gid;},
        createLink(cid)                     {return "new-group-form?cid="           + cid;},
        editLink(cid, gid)                  {return "group-info-edit?cid="          + cid + "&gid=" + gid;},
        removeLink(cid, gid)                {return "competition-group-del?cid="    + cid + "&gid=" + gid;},
        addSportsLink(cid, gid)             {return "group-sportsmens-add?cid="     + cid + "&gid=" + gid;},
        removeSportsLink(cid, gid)          {return "group-sportsmen-del?cid="      + cid + "&gid=" + gid;},
        updatePairsLink(cid, gid)           {return "group-pairs-refresh?cid="      + cid + "&gid=" + gid;},
        setWinnerLink(cid, gid, pid)        {return "pair-member-win?cid="          + cid + "&gid=" + gid + "&pid=" + pid;},
        addFormulaLink(cid, gid)            {return "group-formula-add?cid="        + cid + "&gid=" + gid;},
        removeFormulaLink(cid, gid)         {return "group-formula-del?cid="        + cid + "&gid=" + gid;},

        get(cid, gid)                       {return sendRequest(this.getLink(cid, gid),         ops.createGroup);},
        refreshPairs(cid, gid)              {return sendRequest(this.updatePairsLink(cid, gid), ops.createGroup);},
        edit(cid, gid, gr)                  {sendList(this.editLink(cid, gid),          gr.obj,                             true)},
        create(cid, gr)                     {sendList(this.createLink(cid),             gr.obj,                             true);},
        remove(cid, gid)                    {sendList(this.removeLink(cid, gid),        {},                                 false);},
        excludeSportsman(cid, gid, sid)     {sendList(this.removeSportsLink(cid, gid),  {[castToGroup().sportsmen]: sid},   false);},
        includeSportsList(cid, gid, sids)   {sendList(this.addSportsLink(cid, gid),     {[castToGroup().sportsmen]: sids},  true);},
        setPairWinner(cid, gid, pid, color) {sendList(this.setWinnerLink(cid, gid, pid),{[castToPair().winner]: color},     true);},
        addFormula(cid, gid, formula)       {sendList(this.addFormulaLink(cid, gid),    {[castToGroup().formulas]: formula},false);},
        deleteFormula(cid, gid, formula)    {sendList(this.removeFormulaLink(cid, gid), {[castToGroup().formulas]: formula},true);},
        createFormula()                     {return castToFormula({});}
    },
    sportsman: {
        createLink:                     "department-sports-add",
        getLink(sid)                    {return "department-sports-get?sid="    + sid;},
        editLink(sid)                   {return "department-sports-edit?sid="   + sid;},
        deleteLink(sid)                 {return "department-sports-del?sid="    + sid;},
        changePhotoLink(sid)            {return "sportsman-photo-change?sid="   + sid;},
        addDisciplineLink(cid, sid)     {return "competition-stat-disc_add?cid="    + cid + "&sid=" + sid;},
        removeDisciplineLink(cid, sid)  {return "competition-stat-disc_del?cid="    + cid + "&sid=" + sid;},
        changeAdmitLink(cid, sid)       {return "competition-stat-perm-change?cid=" + cid + "&sid=" + sid;},

        get(sid)                        {return sendRequest(this.getLink(sid), ops.createSportsman);},

        create(sp)                      {sendList(this.createLink,                      sp.obj, false);},
        edit(sid, sp)                   {sendList(this.editLink(sid),                   sp.obj, true);},
        remove(sid)                     {sendList(this.deleteLink(sid),                 {},     false);},
        addDiscipline(sid, cid, disc)   {sendList(this.addDisciplineLink(cid, sid),     {[castToCompetitionStat().disciplines]: disc},  false);},
        delDiscipline(sid, cid, disc)   {sendList(this.removeDisciplineLink(cid, sid),  {[castToCompetitionStat().disciplines]: disc},  false);},
        admitChange(sid, cid, stat)     {sendList(this.changeAdmitLink(cid, sid),       {[castToCompetitionStat().admit]: stat},        false);},
        changePhoto(sid, data)          {sendFormData(this.changePhotoLink(sid),        data,                                           true);}
    },

    trainer: {
        getLink(tid)            {return "trainer-get?tid=" + tid;},
        createLink()            {return "trainer-create";},
        removeLink(tid)         {return "trainer-remove?tid=" + tid;},
        editLink(tid)           {return "trainer-edit?tid=" + tid;},
        changePhotoLink(tid)    {return "trainer-photo-change?tid=" + tid;},

        get(tid)                {return sendRequest(this.getLink(tid), ops.createTrainer);},
        create(tr)              {sendList(      this.createLink(),          tr.obj, false);},
        edit(tid, tr)           {sendList(      this.editLink(tid),         tr.obj, true);},
        remove(tid)             {sendList(      this.removeLink(tid),       {},     false);},
        changePhoto(tid, data)  {sendFormData(  this.changePhotoLink(tid),  data,   true);}
    },

    judge: {
        getLink(jid)            {return "judge-get?tid=" + jid;},
        createLink()            {return "judge-create";},
        removeLink(jid)         {return "judge-remove?jid=" + jid;},
        editLink(jid)           {return "judge-edit?jid=" + jid;},
        changePhotoLink(jid)    {return "judge-photo-change?jid=" + jid;},

        get(jid)                {return sendRequest(this.getLink(jid), ops.createTrainer);},
        create(tr)              {sendList(      this.createLink(),          tr.obj, false);},
        edit(jid, tr)           {sendList(      this.editLink(jid),         tr.obj, true);},
        remove(jid)             {sendList(    this.removeLink(jid),         {},     false);},
        changePhoto(jid, data)  {sendFormData(  this.changePhotoLink(jid),  data,   true);}
    },

    admin: {
        getLink(nid)            {return "admin-get?tid=" + nid;},
        createLink()            {return "admin-create";},
        removeLink(nid)         {return "admin-remove?nid=" + nid;},
        editLink(nid)           {return "admin-edit?nid=" + nid;},
        changePhotoLink(nid)    {return "admin-photo-change?nid=" + nid;},

        get(nid)                {return sendRequest(this.getLink(nid), ops.createTrainer);},
        create(tr)              {sendList(      this.createLink(),          tr.obj, false);},
        edit(nid, tr)           {sendList(      this.editLink(nid),         tr.obj, true);},
        remove(nid)             {sendList(      this.removeLink(nid),       {},     false);},
        changePhoto(nid, data)  {sendFormData(  this.changePhotoLink(nid),  data,   true);}
    },

    arena: {
        createLink(cid)                     {return "arena-create?cid=" + cid;},
        getLink(cid, aid)                   {return "arena-get?cid="    + cid + "&aid=" + aid;},
        removeLink(cid, aid)                {return "arena-remove?cid=" + cid + "&aid=" + aid;},
        editLink(cid, aid)                  {return "arena-edit?cid="   + cid + "&aid=" + aid;},
        pairRemoveLink(cid, aid, pid)       {return "arena-pair-remove?cid="    + cid + "&aid=" + aid + "&pid=" + pid;},
        pairsRebuildLink(cid, aid)          {return "arena-pairs-rebuild?cid="  + cid + "&aid=" + aid;},
        pairsFilterLink(cid, aid)           {return "arena-pairs-filter?cid="   + cid + "&aid=" + aid;},


        get(cid, aid)                       {return sendRequest(this.getLink(cid, aid), ops.createArena);},
        create(cid, arena)                  {sendList(this.createLink(cid),                 arena.obj,                      false);},
        edit(cid, aid, arena)               {sendList(this.editLink(cid, aid),              arena.obj,                      true);},
        remove(cid, aid)                    {sendList(this.removeLink(cid, aid),            {},                             false);},
        pairRemove(cid, aid, pid)           {sendList(this.pairRemoveLink(cid, aid, pid),   {},                             false);},
        pairsListRebuild(cid, aid, pids)    {sendList(this.pairsRebuildLink(cid, aid),      {[castToArena().pairs]: pids},  true);},
        filterPairs(cid, aid)               {sendList(this.pairsFilterLink(cid, aid),       {},                             true);},
    }
}