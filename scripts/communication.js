import {refreshPage, parseAnswerParams, commonStrings} from "./common.js"

const backendLinks = {
    DEPARTMENT_GET:                     "competition-list-get?",
    DEPARTMENT_EDIT:                    "department-info-edit",
    DEPARTMENT_QUALIFICATION_ADD:       "department-qual-add",
    DEPARTMENT_QUALIFICATION_DEL:       "department-qual-del",
    DEPARTMENT_DISCIPLINE_ADD:          "department-disc-add",
    DEPARTMENT_DISCIPLINE_DEL:          "department-disc-del",
    
    DEPARTMENT_SPORTSMEN_GET(sid)       {return "department-sports-get?sid=" + sid;},
    DEPARTMENT_SPORTSMEN_EDIT(sid)      {return "department-sports-edit?sid=" + sid;},
    DEPARTMENT_SPORTSMEN_ADD:           "department-sports-add",
    DEPARTMENT_SPORTSMEN_DEL(sid)       {return "department-sports-del?sid=" + sid;},

    COMPETITION_CREATE:                 "department-comp-add",
    COMPETITION_GET(cid)                {return "competition-get?cid=" + cid;},
    COMPETITION_EDIT(cid)               {return "competition-info-edit?cid=" + cid;},
    COMPETITION_SPORTSMAN_ADD(cid)      {return "new-member-form?cid=" + cid;},
    COMPETITION_SPORTSMAN_DEL(cid, sid) {return "competition-member-del?cid=" + cid + "&sid=" + sid;},
    COMPETITION_GROUP_ADD(cid)          {return "new-group-form?cid=" + cid;},
    COMPETITION_GROUP_DEL(cid, gid)     {return "competition-group-del?cid=" + cid;},
    COMPETITION_GROUPS_PAIRS_FORM(cid)  {return "competition-pairs-refresh?cid=" + cid;},
    COMPETITION_MEMBERS_SORT(cid)       {return "competition-members-sort?cid=" + cid;},

    GROUP_GET(cid, gid)                 {return "group-get?cid=" + cid + "&gid=" + gid;},
    GROUP_INFO_EDIT(cid, gid)           {return "group-info-edit?cid=" + cid + "&gid=" + gid;},
    GROUP_SPORTSMENS_ADD(cid, gid)      {return "group-sportsmens-add?cid=" + cid + "&gid=" + gid;},
    GROUP_SPORTSMEN_DEL(cid, gid)       {return "group-sportsmen-del?cid=" + cid + "&gid=" + gid;},
    GROUP_PAIRS_REFRESH(cid, gid)       {return "group-pairs-refresh?cid=" + cid + "&gid=" + gid;},
    GROUP_PAIR_WINNER(cid, gid, pid)    {return "pair-member-win?cid=" + cid + "&gid=" + gid + "&pid=" + pid;},

    COMPETITION_SPORTSMEN_GET(cid, sid)         {return "competition-sports-get?cid=" + cid + "&sid=" + sid;},
    COMPETITION_SPORTSMEN_INFO_EDIT(cid, sid)   {return "competition-sports-info-edit?cid=" + cid + "&sid=" + sid;},
    COMPETITION_SPORTSMEN_GROUP_ADD(cid)        {return "competition-sports-group-add?cid=" + cid;},
    COMPETITION_SPORTSMEN_GROUP_DEL(cid, sid)   {return "competition-sports-group-del" + cid + "&sid=" + sid;},

    LOGIN:                              "admin-login",
    CLIENT_STATUS_GET:                  "client-status-get"
};

function mapToObjArray(mapArr, createObj){
    var res = new Array(0);
    mapArr.forEach(map => {
        res.push(createObj(map));
    });
    return res;
}

function mapToSportsman(map) {
    return {
        params: (map == undefined) ? (new Map()) : map,
        getId()               {return this.params.get("Id");},
        getName()             {return this.params.get("Name");},
        getSurname()          {return this.params.get("Surname");},
        getAge()              {return this.params.get("Birth");},
        getWeight()           {return this.params.get("Weight");},
        getSex()              {return this.params.get("Sex");},
        getTeam()             {return this.params.get("Team");},
        getQualification()    {return this.params.get("Qualification");},
        getAdmition()         {return this.params.get("Admited");},
        getDisciplines()      {return this.params.get("Disciplines");},
        getGroupsNum()        {return this.params.get("Groups_num");},

        setId(v)               {return this.params.set("Id", v);},
        setName(v)             {return this.params.set("Name", v);},
        setSurname(v)          {return this.params.set("Surname", v);},
        setAge(v)              {return this.params.set("Birth", v);},
        setWeight(v)           {return this.params.set("Weight", v);},
        setSex(v)              {return this.params.set("Sex", v);},
        setTeam(v)             {return this.params.set("Team", v);},
        setQualification(v)    {return this.params.set("Qualification", v);},
        setAdmition(v)         {return this.params.set("Admited", v);},
        setDisciplines(v)      {return this.params.set("Disciplines", v);},
        setGroupsNum(v)        {return this.params.set("Groups_num", v);},

        getLink()              {return "/sportsman?sid=" + this. getId(this.params);}
    };
}

function mapToPair(map) {
    return {
        params: (map == undefined) ? (new Map()) : map,
        getId()           {return this.params.get("Id");},
        getRedSp()        {return this.params.get("Sportsman_red");},
        getBlueSp()       {return this.params.get("Sportsman_blue");},
        getWinner()       {return this.params.get("Winner");},
        getNumber()       {return this.params.get("Number");},
        getFinalPart()    {return this.params.get("Final_part");},
        getChildPair()    {return this.params.get("Child_pair");},

        setId(v)           {return this.params.set("Id", v);},
        setRedSp(v)        {return this.params.set("Sportsman_red", v);},
        setBlueSp(v)       {return this.params.set("Sportsman_blue", v);},
        setWinner(v)       {return this.params.set("Winner", v);},
        setNumber(v)       {return this.params.set("Number", v);},
        setFinalPart(v)    {return this.params.set("Final_part", v);},
        setChildPair(v)    {return this.params.set("Child_pair", v);},
    };
}

function mapToGroup(map) {
    return {
        params: (map == undefined) ? (new Map()) : map,
        getId()           {return this.params.get("Id");},
        getName()         {return this.params.get("Name");},
        getFormSystem()   {return this.params.get("Form_sys");},
        getAgeMin()       {return this.params.get("Age_min");},
        getAgeMax()       {return this.params.get("Age_max");},
        getWeightMin()    {return this.params.get("Weight_min");},
        getWeightMax()    {return this.params.get("Weight_max");},
        getQualMin()      {return this.params.get("Qualification_min");},
        getQualMax()      {return this.params.get("Qualification_max");},
        getSex()          {return this.params.get("Sex");},
        getDiscipline()   {return this.params.get("Division");},
        getSportsmans()   {return mapToObjArray(this.params.get("Members"), mapToSportsman);},
        getSportsNum()    {return this.params.get("Members_num");},
        getPairs()        {return mapToObjArray(this.params.get("Pairs"), mapToPair);},

        setId(v)           {return this.params.set("Id", v);},
        setName(v)         {return this.params.set("Name", v);},
        setFormSystem(v)   {return this.params.set("Form_sys", v);},
        setAgeMin(v)       {return this.params.set("Age_min", v);},
        setAgeMax(v)       {return this.params.set("Age_max", v);},
        setWeightMin(v)    {return this.params.set("Weight_min", v);},
        setWeightMax(v)    {return this.params.set("Weight_max", v);},
        setQualMin(v)      {return this.params.set("Qualification_min", v);},
        setQualMax(v)      {return this.params.set("Qualification_max", v);},
        setSex(v)          {return this.params.set("Sex", v);},
        setDiscipline(v)   {return this.params.set("Division", v);},
        setSportsmans(v)   {return this.params.set("Members", v);},
        setSportsNum(v)    {return this.params.set("Members_num", v);},
        setPairs(v)        {return this.params.set("Pairs", v);},

        getLink()         {return "/group?gid=" + this.getId();} 
    };
}

function mapToCompetition(map) {
    return {
        params: (map == undefined) ? (new Map()) : map,
        getId()             {return this.params.get("Id");},
        getName()           {return this.params.get("Name");},
        getDescription()    {return this.params.get("Description");},
        getSportsmans()     {return mapToObjArray(this.params.get("Sportsmans"), mapToSportsman);},
        getGroups()         {return mapToObjArray(this.params.get("Groups"), mapToGroup);},

        setId(v)             {return this.params.set("Id", v);},
        setName(v)           {return this.params.set("Name", v);},
        setDescription(v)    {return this.params.set("Description", v);},
        setSportsmans(v)     {return this.params.set("Sportsmans", v);},
        setGroups(v)         {return this.params.set("Groups", v);},
        
    };
}

function mapToDepatrment(map) {
    return {
        params: (map == undefined) ? (new Map()) : map,
        getId()             {return this.params.get("Id");},
        getName()           {return this.params.get("Name");},
        getCompetitions()   {return mapToObjArray(this.params.get("Competitions"), mapToCompetition);},
        getSportsmans()     {return mapToObjArray(this.params.get("Sportsmens"), mapToSportsman);},
        getDisciplines()    {return this.params.get("Divisions");},
        getQualifications() {return this.params.get("Qualifications");},

        setId(v)             {return this.params.set("Id", v);},
        setName(v)           {return this.params.set("Name", v);},
        setCompetitions(v)   {return this.params.set("Competitions", v);},
        setSportsmans(v)     {return this.params.set("Sportsmens", v);},
        setDisciplines(v)    {return this.params.set("Divisions", v);},
        setQualifications(v) {return this.params.set("Qualifications", v);},
    };
}

export const ops = {
    createSportsman(m)      {return mapToSportsman(m);},
    createPair(m)           {return mapToPair(m);},
    createGroup(m)          {return mapToGroup(m);},
    createCompetition(m)    {return mapToCompetition(m);},
    createDepartmant(m)     {return mapToDepatrment(m);}
}

function sendRequest(request) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', request, false);
    xhr.send();
    if (xhr.status != 200)   return new Map();
    return parseAnswerParams(xhr.responseText);
}

function sendParametersList(formName, paramsMap, refresh) {
    var xhr = new XMLHttpRequest();
    var boundary = String(Math.random()).slice(2);
    var body = ['\r\n'];
    paramsMap.forEach(function(value, key) {
        body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + value + '\r\n');
    });
    body = body.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';


    xhr.onreadystatechange = function () {
        if(refresh == true && xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            refreshPage();
        };
    };
    xhr.open('POST', "/" + formName, true);
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    xhr.send(body);
    return true;
}

function sendSingleValue(link, value, refresh){
    var paramsMap = new Map();
    paramsMap.set(link, value);
    sendParametersList(link, paramsMap, refresh);
}

/* ------------------- ACCESS ----------------------------*/

function sendLogin(login, pass){
    var paramsMap = new Map();
    paramsMap.set("login",     login);
    paramsMap.set("password",  pass);
    sendParametersList(backendLinks.LOGIN, paramsMap, true);
}

/* ------------------- COMPETITION ----------------------------*/

function createCompetition(cp){
    var params = new Map();
     params.set("competition-name",  cp.getName());
     params.set("description",       cp.getDescription());
    sendParametersList(backendLinks.COMPETITION_CREATE, params, true);
}

function  editCompetition(cid, name, desc){
    var params = new Map();
     params.set("competition-name",  name);
     params.set("description",       desc);
    sendParametersList(backendLinks. COMPETITION_EDIT(cid), params, true);
}

function addCpSportsmans(cid, spArray){
    var params = new Map();

    spArray.forEach(sp => {
        var value = "admition=" + sp.getAdmition() + "<paramDivider>disciplines="
        var disciplines = sp.getDisciplines();
        var first = true;
        disciplines.forEach(d => {
            value += first ? d : (commonStrings.arrDivider + d);
            first = false;
        });
         params.set(sp.getId(), value);
    });
    console.log(params);
    sendParametersList(backendLinks. COMPETITION_SPORTSMAN_ADD(cid), params, true);
}

/* ------------------- GROUP ----------------------------*/

function createGroup(cid, gr){
    var params = new Map();
     params.set("group-name",        gr.getName());
     params.set("group-division",    gr.getDiscipline());
     params.set("form-system",       gr.getFormSystem());
    if(gr.getSex() != undefined)
         params.set("sex", gr.getSex());
    if(gr.getAgeMin() != undefined){
         params.set("age-min", gr.getAgeMin());
         params.set("age-max", gr.getAgeMax());
    }
    if(gr.getWeightMin() != undefined){
         params.set("weight-min", gr.getWeightMin());
         params.set("weight-max", gr.getWeightMax());
    }
    if(gr.getQualMin() != undefined){
         params.set("qualification-min", gr.getQualMin());
         params.set("qualification-max", gr.getQualMax());
    }
    sendParametersList(backendLinks.COMPETITION_GROUP_ADD(cid), params, true);
}

function editGroup(cid, gid, gr){
    var params = new Map();

     params.set("group-name",        gr.getName());
     params.set("group-division",    gr.getDiscipline());
     params.set("form-system",       gr.getFormSystem());

    if(gr.getSex() != undefined)         params.set("sex", gr.getSex());
    if(gr.getAgeMin() != undefined)      params.set("age-min", gr.getAgeMin());
    if(gr.getAgeMax() != undefined)      params.set("age-max", gr.getAgeMax());
    if(gr.getWeightMin() != undefined)   params.set("weight-min", gr.getWeightMin());
    if(gr.getWeightMax() != undefined)   params.set("weight-max", gr.getWeightMax());
    if(gr.getQualMin() != undefined)     params.set("qualification-min", gr.getQualMin());
    if(gr.getQualMax() != undefined)     params.set("qualification-max", gr.getQualMax());

    sendParametersList(backendLinks.GROUP_INFO_EDIT(cid, gid), params, true);
}

/* ------------------- SPORTSMAN ----------------------------*/

function createSportsman(sports){
    var params = new Map();
    params.set("member-name",    sports.getName());
    params.set("member-surname", sports.getSurname());
    params.set("member-weight",  sports.getWeight());
    params.set("member-age",     sports.getAge());
    params.set("member-team",    sports.getTeam());
    params.set("member-sex",     sports.getSex());
    params.set("member-qual",    sports.getQualification());
    sendParametersList(backendLinks.DEPARTMENT_SPORTSMEN_ADD, params, true);
}

function editSportsman(sid, sports){
    var params = new Map();
    params.set("member-name",    sports.getName());
    params.set("member-surname", sports.getSurname());
    params.set("member-weight",  sports.getWeight());
    params.set("member-age",     sports.getAge());
    params.set("member-team",    sports.getTeam());
    params.set("member-sex",     sports.getSex());
    params.set("member-qual",    sports.getQualification());
    sendParametersList(backendLinks.DEPARTMENT_SPORTSMEN_EDIT(sid), params, true);
}

export const server = {
    access: {
        login(login, pass)                  {sendLogin(login, pass);},
        getClientStatus()                   {return sendRequest(backendLinks.CLIENT_STATUS_GET).get("ClientStatus");}
    },
    department: {
        get()                               {return ops.createDepartmant(sendRequest(backendLinks.DEPARTMENT_GET));},
        edit(name)                          {sendSingleValue(backendLinks.DEPARTMENT_EDIT, name, true);},
        addQualification(value, name)       {sendSingleValue(backendLinks.DEPARTMENT_QUALIFICATION_ADD, value + " - " + name, true)},
        deleteQualification(value)          {sendSingleValue(backendLinks.DEPARTMENT_QUALIFICATION_DEL, value, true);},
        addDiscipline(name)                 {sendSingleValue(backendLinks.DEPARTMENT_DISCIPLINE_ADD, name, false);},
        deleteDiscipline(name)              {sendSingleValue(backendLinks.DEPARTMENT_DISCIPLINE_DEL, name, false);}
    },
    competition: {
        get(cid)                            {return ops.createCompetition(sendRequest(backendLinks.COMPETITION_GET(cid)));},
        edit(cid, name, desc)               {editCompetition(cid, name, desc);},
        create(cp)                          {createCompetition(cp);},
        sortSportsmans(cid)                 {return sendRequest(backendLinks.COMPETITION_MEMBERS_SORT(cid));},
        addSprotsmans(cid, ids)             {addCpSportsmans(cid, ids);},
        formPairs(cid)                      {return sendRequest(backendLinks.COMPETITION_GROUPS_PAIRS_FORM(cid));}
    },
    group: {
        get(cid, gid)                       {return ops.createGroup(sendRequest(backendLinks.GROUP_GET(cid, gid)));},
        edit(cid, gid, gr)                  {editGroup(cid, gid, gr)},
        create(cid, gr)                     {createGroup(cid, gr)},
        remove(cid, gid)                    {return sendSingleValue(backendLinks.COMPETITION_GROUP_DEL(cid), gid, false);},
        excludeSportsman(cid, gid, sid)     {sendSingleValue(backendLinks.GROUP_SPORTSMEN_DEL(cid, gid), sid, false);},
        includeSportsList(cid, gid, sids)   {sendSingleValue(backendLinks.GROUP_SPORTSMENS_ADD(cid, gid), sids, true);},
        refreshPairs(cid, gid)              {return sendRequest(backendLinks.GROUP_PAIRS_REFRESH(cid, gid));},
        setPairWinner(cid, gid, pid, color) {sendSingleValue(backendLinks.GROUP_PAIR_WINNER(cid, gid, pid), color, true);}
    },
    sportsman: {
        get(sid)                            {return ops.createSportsman(sendRequest(backendLinks.DEPARTMENT_SPORTSMEN_GET(sid)));},
        create(sp)                          {createSportsman(sp);},
        edit(sid, sp)                       {editSportsman(sid, sp);}
    }
}