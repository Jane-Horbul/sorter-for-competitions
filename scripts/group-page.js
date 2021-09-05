import {isNumber, isEmptyString, getLinkParams, showAllIfAdmin, languageSwitchingOn, onClick, createPageItem, commonStrings, refreshPage} from "./common.js"
import {ops, server} from "./communication.js"

const competitionLink   = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
const departmentLink    = competitionLink.substr(0, competitionLink.lastIndexOf("/"));
const pageParams        = getLinkParams(location.search);
const page = {
    cid: pageParams.get("cid"),
    gid: pageParams.get("gid")
}
var groupInfo             = server.getGroup(page.cid, page.gid);
const departmentInfo      = server.getDepartment();
const competitionInfo     = server.getCompetition(page.cid);
const qualificationsMap   = ops.department.getQualifications(departmentInfo);
var competitionSportsmans = ops.competition.getSportsmans(competitionInfo);
var sportsmansAddList     = new Array(0);

console.log(groupInfo);

/* ------------------- PAIRS ----------------------------*/
const pairObjects = {
    redBtnStyle:     "red-button-style",
    blueBtnStyle:    "blue-button-style",
    redWinStyle:     "red-cell-style",
    blueWinStyle:    "blue-cell-style",

    getTable()                  { return document.getElementById("pairs-table");},
    getTemplate()               { return document.getElementById("pair-template");},

    getPlaceholders(p)          { return {
                                        "#pair-id":         ops.pair.getId(p),
                                        "#final-part":      "1/" + ops.pair.getFinalPart(p),
                                        "#red-sportsman":   getSportsName(ops.pair.getRedSp(p)),
                                        "#blue-sportsman":  getSportsName(ops.pair.getBlueSp(p)),
                                        "#pair-winner":     getPairWinner(p),
                                        "#winner-style":    getWinStyle(p)
                                    };
                                },
    createWinBtn(stl, id)       {   var res = document.createElement("button");
                                    res.setAttribute("class", stl);
                                    res.setAttribute("type", "button");
                                    res.setAttribute("id", ((stl == this.redBtnStyle) ? "red-btn-" : "blue-btn-") + id);
                                    return res;
                                },
    createWinBtns(id)           {   var redBtn = this.createWinBtn(this.redBtnStyle, id);
                                    var blueBtn = this.createWinBtn(this.blueBtnStyle, id);
                                    var ctnr = document.createElement("div");
                                    ctnr.append(redBtn);
                                    ctnr.append(blueBtn);
                                    return ctnr.innerHTML;
                                },
    confiWinBtn(id)             {onClick(document.getElementById("red-btn-" + id), function(){server.setPairWinner(page.cid, page.gid, id, "red")});
                                 onClick(document.getElementById("blue-btn-" + id), function(){server.setPairWinner(page.cid, page.gid, id, "blue")});}
}

function getSportsName(id){
    if(!isNumber(id)){
        return "Winner of " + id;
    }
    var sports = ops.group.getSportsmans(groupInfo).find( sp => ops.sportsman.getId(sp) == id);
    if(sports == undefined) return "";
    return ops.sportsman.getSurname(sports) + " " + ops.sportsman.getName(sports);
}

function getWinStyle(pair){
    var winner = ops.pair.getWinner(pair);
    if(isEmptyString(winner)){
        return "";
    } else if(winner == ops.pair.getRedSp){
        return pairObjects.redWinStyle;
    } else{
        return pairObjects.blueWinStyle;
    }
}

function getPairWinner(pair){
    var winner = ops.pair.getWinner(pair);
    if(isEmptyString(winner)){
        if(!isNumber(ops.pair.getRedSp(pair)) || !isNumber(ops.pair.getBlueSp(pair)))
            return "";
        return pairObjects.createWinBtns(ops.pair.getId(pair));
    } else {
        return getSportsName(winner);
    }
}

function pairPageElementAdd(pair){
    if(ops.pair.getId(pair) == undefined) return;
    var unknowWinner = isEmptyString(ops.pair.getWinner(pair));
    var unknowMember = !isNumber(ops.pair.getRedSp(pair)) || !isNumber(ops.pair.getBlueSp(pair));
    var template = pairObjects.getTemplate();
    var placeholders = pairObjects.getPlaceholders(pair);
    var newItem = createPageItem(template, placeholders);
    pairObjects.getTable().append(newItem); 
    if(unknowWinner && !unknowMember) {
        pairObjects.confiWinBtn(ops.pair.getId(pair));
    }
}

function refreshPairs(){
    server.refreshPairs(page.cid, page.gid);
    refreshPage();
}

/* ------------------- SPORTSMANS ----------------------------*/
const sportsmanObjects = {
    sportsmanRowId:     "sports-row-id-",
    removeBtnId:        "remove-gr-sports-",
    addBtnId:           "sportsmans-add-list-send-btn",

    getTable()                  { return document.getElementById("members-table");},
    getTemplate()               { return document.getElementById("group-member-template");},

    getAddingTable()            { return document.getElementById("add-sportsman-table");},
    getAddingTemplate()         { return document.getElementById("add-sportsman-template");},
    getAddingSportsRow(id)      { return document.getElementById("add-sports-" + id)},

    getPlaceholders(sp)         { return {
                                        "#sp-id":           ops.sportsman.getId(sp),
                                        "#sp-surname":      ops.sportsman.getSurname(sp),
                                        "#sp-name":         ops.sportsman.getName(sp),
                                        "#sp-age":          ops.sportsman.getAge(sp),
                                        "#sp-weight":       ops.sportsman.getWeight(sp),
                                        "#sp-sex":          ops.sportsman.getSex(sp),
                                        "#sp-team":         ops.sportsman.getTeam(sp),
                                        "#sp-qual":         qualificationsMap.get(ops.sportsman.getQualification(sp)),
                                        "#sp-admit":        ops.sportsman.getAdmition(sp),
                                        "#sp-gr-num":       ops.sportsman.getGroupsNum(sp),
                                        "#sportsman-link":  competitionLink + ops.sportsman.getLinkFromCompetition(sp),
                                        "#sports-row-id":   this.sportsmanRowId + ops.sportsman.getId(sp)
                                    };
                                },
    getSportsRow(id)            { return document.getElementById(this.sportsmanRowId + id);},
    getAddBtn()                 { return document.getElementById(this.addBtnId);},
    configDelBtn(item, sp)      {var btn = item.getElementById(this.removeBtnId); 
                                    onClick(btn, function(){sportsmanRemove(ops.sportsman.getId(sp))});
                                    btn.id = this.removeBtnId + ops.sportsman.getId(sp);
                                },
    getDelBtn()                 { return document.getElementById("member-dell-btn");}
}

function excludeCompetitionSportsman(sp){
    for(var i = 0; i < competitionSportsmans.length; i++){
        if(ops.sportsman.getId(sp) == ops.sportsman.getId(competitionSportsmans[i])){
            competitionSportsmans.splice(i, 1);
            return;
        }
    }
}

function sportsmanRemove(id){
    var spRow = sportsmanObjects.getSportsRow(id);
    var sportsmans = ops.group.getSportsmans(groupInfo);
    if(null != spRow)
        spRow.parentElement.removeChild(spRow);
    for(var i = 0; i < sportsmans.length; i++){
        if(id == ops.sportsman.getId(sportsmans[i])){
            sportsmans.splice(i, 1);
            break;
        }
    }
    console.log("Del id: " + id);
    server.removeGroupSportsman(page.cid, page.gid, id);
}

function sportsmanAddingSelect(sid){
    var spRow   = sportsmanObjects.getAddingSportsRow(sid);
    var sp      = sportsmansAddList.find( curSp => ops.sportsman.getId(curSp) == sid);
    console.log("Select callback: " + sid);
    if(sp == undefined) {
        sp = competitionSportsmans.find( curSp => ops.sportsman.getId(curSp) == sid);
        spRow.setAttribute("class", "add-sportsman-table-tr--selected");
        sportsmansAddList.push(sp);
    } else {
        spRow.setAttribute("class", "");
        for(var i = 0; i < sportsmansAddList.length; i++){
            if(sid == ops.sportsman.getId(sportsmansAddList[i])){
                sportsmansAddList.splice(i, 1);
                break;
            }
        }
    }
}

function competitionSportsmanElementAdd(sp){
    var sid = ops.sportsman.getId(sp);
    if(sid != undefined){
        var template = sportsmanObjects.getAddingTemplate();
        var placeholders = sportsmanObjects.getPlaceholders(sp);
        var newItem = createPageItem(template, placeholders);
        sportsmanObjects.getAddingTable().append(newItem);
        onClick(sportsmanObjects.getAddingSportsRow(sid), function(){sportsmanAddingSelect(sid)});
        
    }
}

function sportsmanPageElementAdd(sp){
    if(ops.sportsman.getId(sp) != undefined){
        excludeCompetitionSportsman(sp);
        var template = sportsmanObjects.getTemplate();
        var placeholders = sportsmanObjects.getPlaceholders(sp);
        var newItem = createPageItem(template, placeholders);
        sportsmanObjects.getTable().append(newItem); 
        onClick(document.getElementById(sportsmanObjects.removeBtnId + ops.sportsman.getId(sp)), function(){sportsmanRemove(ops.sportsman.getId(sp))});
    }
}

function addSportsmansList()
{
    var sids = "";
    sportsmansAddList.forEach(sp =>   sids += ops.sportsman.getId(sp) + commonStrings.arrDivider);
    server.addGroupSportsList(page.cid, page.gid, sids);
}

/* ------------------- PAIRS GRID ----------------------------*/
const gridObjects = {
    scale:          30,
    final:          1,
    redFillColor:   "rgb(255,96,90)",
    blueFillColor:  "rgb(0,148,204)",
    shiftTextX:     10,
    shiftTextY:     10,
    
    isFinalPair(pair)           {return (ops.pair.getFinalPart(pair) == "1");},
    getPow(pair_num)            {
                                    for(var i = 1, pn = 2; ; i++, pn *=2)
                                        if(pn > pair_num)
                                            return {pow: i, num: pn};
                                },
    
    getGridWidh(pair_num)       {return ((this.getPairWidh() + this.getDistanceWidh())      * this.getPow(pair_num).pow);},
    getGridHeight(pair_num)     {return ((this.getPairHeight() + this.getDistanceHeight())  * this.getPow(pair_num).num / 2);},

    getPairWidh()               { return 6 * this.scale; },
    getPairHeight()             { return 2 * this.scale; },
    
    getDistanceWidh()           { return this.getPairWidh() / 2; },
    getDistanceHeight()         { return this.getPairHeight(); },
    getContainer()              { return document.getElementById("pairs-grid"); },
    createCanvas()              { 
                                    var canvas              = document.createElement('canvas');
                                    canvas.style.position   = 'fixed'
                                    canvas.width            = this.getGridWidh(ops.group.getPairs(groupInfo).length);
                                    canvas.height           = this.getGridHeight(ops.group.getPairs(groupInfo).length);
                                    
                                    var ctx                 = canvas.getContext('2d');
                                    ctx.font                = "17px serif";
                                    ctx.lineWidth           = 3;
                                    return canvas;
                                },
    printText(ctx, text, x, y)  {ctx.fillText(text, x + this.shiftTextX, y - this.shiftTextY);}
}

function getParentPair(pairs, childId, spId){
    var res = pairs.find(pair => {
        if(childId  != ops.pair.getChildPair(pair)) return false;
        if(spId     == ops.pair.getWinner(pair))    return true;
        if(spId     == ops.pair.getRedSp(pair))     return true;
        if(spId     == ops.pair.getBlueSp(pair))    return true;
        if(spId     == ops.pair.getId(pair))        return true;
        return false;
    });
    return res;
}

function createPairsGrid(pairs) {
    var grid = new Array(0);
    var finalPair = pairs.find( pr => (gridObjects.isFinalPair(pr)) );;
    var lastCol = new Array(1);
    var maxPairsInCol = 1;

    lastCol[0] = finalPair;
    grid.push(lastCol);
    for(var i = 0; i < grid.length; i++)
    {
        var curCol = new Array(maxPairsInCol);
        var found = false;
        for(var j = 0; j < maxPairsInCol; j++)
        {
            var curPair = grid[0][j];
            if(undefined == curPair) continue;
            var spRed = getParentPair(pairs, ops.pair.getId(curPair), ops.pair.getRedSp(curPair));
            var spBlu = getParentPair(pairs, ops.pair.getId(curPair), ops.pair.getBlueSp(curPair));
            if(spRed != undefined)
            {
                found = true;
                curCol[j * 2] = spRed;
            }
            if(spBlu != undefined)
            {
                found = true;
                curCol[j * 2 + 1] = spBlu;
            }   
        }
        if(found)
            grid.unshift(curCol);
        maxPairsInCol *=2;
    }
    return grid;
}

function drawLine(start, end, ctx, color){
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

function drawConnection(ctx, shiftX, shiftY, row, lineHigh){
    var startX  = shiftX + gridObjects.getPairWidh();
    var midleX  = startX + gridObjects.getDistanceWidh() / 2;
    var endX    = startX + gridObjects.getDistanceWidh();
    var startY  = shiftY + gridObjects.getPairHeight() / 2;

    if((row % 2) == 1)
    {
        var color   = gridObjects.blueFillColor;
        var endY    = startY - lineHigh + gridObjects.getPairHeight() / 4;
    }
    else
    {
        var color   = gridObjects.redFillColor;
        var endY    = startY + lineHigh - gridObjects.getPairHeight() / 4;
    }

    drawLine({x: startX, y: startY}, {x: midleX, y: startY}, ctx, color);
    drawLine({x: midleX, y: startY}, {x: midleX, y: endY}, ctx, color);
    drawLine({x: midleX, y: endY},   {x: endX,   y: endY}, ctx, color);
}

function getGridPairNames(pair)
{
    var redId = ops.pair.getRedSp(pair);
    var blueId = ops.pair.getBlueSp(pair);
    var spRed    = ops.group.getSportsmans(groupInfo).find( sp => (ops.sportsman.getId(sp) == redId));
    var spBlue   = ops.group.getSportsmans(groupInfo).find( sp => (ops.sportsman.getId(sp) == blueId));
    var names = {red: "", blue: ""}; 

    if(spRed == undefined)
        names.red = commonStrings.pairWinner(redId);
    else
        names.red = ops.sportsman.getSurname(spRed) + " " + ops.sportsman.getName(spRed);

    if(spBlue == undefined)
        names.blue = commonStrings.pairWinner(blueId);
    else
        names.blue = ops.sportsman.getSurname(spBlue) + " " + ops.sportsman.getName(spBlue);
    return names;
}

function drawPair(ctx, shiftX, shiftY, pair){
    var width       = gridObjects.getPairWidh();
    var height      = gridObjects.getPairHeight();
    var midleHeight = height / 2;
    var midleY      = shiftY + midleHeight;
    var names       = getGridPairNames(pair);
    
    ctx.fillStyle = gridObjects.redFillColor;
    ctx.fillRect(shiftX, shiftY, width, midleHeight);
    ctx.fillStyle = gridObjects.blueFillColor;;
    ctx.fillRect(shiftX, midleY, width, midleHeight);

    ctx.fillStyle   = "black";
    ctx.strokeStyle = "black";
    ctx.strokeRect(shiftX, shiftY, width, midleHeight);
    ctx.strokeRect(shiftX, midleY, width, midleHeight);

    gridObjects.printText(ctx, names.red,  shiftX, shiftY + midleHeight);
    gridObjects.printText(ctx, names.blue, shiftX, midleY + midleHeight);
}

function drawGrid(ctx, grid){
    var shiftX      = 0;
    var pairH       = gridObjects.getPairHeight();
    var distH       = gridObjects.getDistanceHeight();
    var powNum      = 1;

    for(var col = 0; col < grid.length; col++){
        var firstSpace = ((powNum - 1) / 2) * (pairH + distH);
        var stepY = powNum * (pairH + distH);
        var shiftY = firstSpace;
        for(var row = 0; row < grid[col].length; row++){
            if(grid[col][row] != undefined)
            {
                drawPair(ctx, shiftX, shiftY, grid[col][row]);
                if(!gridObjects.isFinalPair(grid[col][row]))
                    drawConnection(ctx, shiftX, shiftY, row, stepY / 2);
            }
            shiftY += stepY;
        }
        powNum *= 2;
        shiftX += gridObjects.getPairWidh() + gridObjects.getDistanceWidh();
    }
}

function formPairsGrid(){
    var pairsGrid           = createPairsGrid(ops.group.getPairs(groupInfo));
    var canvas              = gridObjects.createCanvas();

    drawGrid(canvas.getContext('2d'), pairsGrid);
    gridObjects.getContainer().append(canvas);
}

/* ------------------- COMMON ----------------------------*/

const groupObjects = {
    pageNameId:         "page-name",
    pageNameLinkId:     "page-name-link",
    compLinkId:         "competition-link",
    depLinkId:          "department-link",
    groupLinkId:        "group-link",
    groupHeaderId:      "group-name-header",

    setPageName(name)           {document.getElementById(this.pageNameId).innerHTML = name;},
    setPageNameLink(link)       {document.getElementById(this.pageNameLinkId).setAttribute("href", link);},
    setDepartmentName(name)     {document.getElementById(this.depLinkId).innerHTML = name;},
    setDepartmentLink(link)     {document.getElementById(this.depLinkId).setAttribute("href", link);},
    setCompetitionName(name)    {document.getElementById(this.compLinkId).innerHTML = name;},
    setCompetitionLink(link)    {document.getElementById(this.compLinkId).setAttribute("href", link);},
    setGroupName(name)          {document.getElementById(this.groupLinkId).innerHTML = name;},
    setGroupLink(link)          {document.getElementById(this.groupLinkId).setAttribute("href", link);},
    setGroupHeader(name)        {document.getElementById(this.groupHeaderId).innerHTML = name;},

    infoNameId:         "group-info-name",
    infoSystemId:       "group-info-system",
    infoSexId:          "group-info-sex",
    infoDisciplineId:   "group-info-discipline",
    infoAgeMinId:       "group-info-age-min",
    infoAgeMaxId:       "group-info-age-max",
    infoWeightMinId:    "group-info-weight-min",
    infoWeightMaxId:    "group-info-weight-max",
    infoQualMinId:      "group-info-qulification-min",
    infoQualMaxId:      "group-info-qulification-max",

    setInfoName(val)            {document.getElementById(this.infoNameId).innerHTML = val;},
    setInfoSystem(val)          {document.getElementById(this.infoSystemId).innerHTML = val;},
    setInfoSex(val)             {document.getElementById(this.infoSexId).innerHTML = val;},
    setInfoDiscipline(val)      {document.getElementById(this.infoDisciplineId).innerHTML = val;},
    setInfoAgeMin(val)          {document.getElementById(this.infoAgeMinId).innerHTML = val;},
    setInfoAgeMax(val)          {document.getElementById(this.infoAgeMaxId).innerHTML = val;},
    setInfoWeightMin(val)       {document.getElementById(this.infoWeightMinId).innerHTML = val;},
    setInfoWeightMax(val)       {document.getElementById(this.infoWeightMaxId).innerHTML = val;},
    setInfoQulificationMin(val) {document.getElementById(this.infoQualMinId).innerHTML = val;},
    setInfoQulificationMax(val) {document.getElementById(this.infoQualMaxId).innerHTML = val;},

    inputNameId:         "group-input-name",
    inputSystemId:       "group-input-system",
    inputSexId:          "group-input-sex",
    inputDisciplineId:   "group-input-discipline",
    inputAgeMinId:       "group-input-age-min",
    inputAgeMaxId:       "group-input-age-max",
    inputWeightMinId:    "group-input-weight-min",
    inputWeightMaxId:    "group-input-weight-max",
    inputQualMinId:      "group-input-qulification-min",
    inputQualMaxId:      "group-input-qulification-max",

    getNameInput()          { return document.getElementById(this.inputNameId);},
    getSystemInput()        { return document.getElementById(this.inputSystemId);},
    getSexInput()           { return document.getElementById(this.inputSexId);},
    getDisciplineInput()    { return document.getElementById(this.inputDisciplineId);},
    getAgeMinInput()        { return document.getElementById(this.inputAgeMinId);},
    getAgeMaxInput()        { return document.getElementById(this.inputAgeMaxId);},
    getWeightMinInput()     { return document.getElementById(this.inputWeightMinId);},
    getWeightMaxInput()     { return document.getElementById(this.inputWeightMaxId);},
    getQualMinInput()       { return document.getElementById(this.inputQualMinId);},
    getQualMaxInput()       { return document.getElementById(this.inputQualMaxId);},

    createInput(id)             { return document.getElementById((id + "-template")).cloneNode(true).content;},
    createOption(id, name, val) { var res = document.createElement("option");
                                    res.setAttribute("id", id);
                                    res.value = val;
                                    res.innerHTML = name;
                                    return res;
                                },
    getAndCleanPlace(id)        { var pl= document.getElementById(id); pl.innerHTML = ""; return pl;},

    delBtnId:           "del-btn-link",
    editBtnId:          "group-edit-btn",
    updatePairsBtnId:   "update-pairs-btn",
    formGridBtnId:      "group-grid-btn",

    setDelBtnLink(link)         {this.getDelBtn().setAttribute("href", link);},
    getDelBtn()                 { return document.getElementById(this.delBtnId);},
    getEditBtn()                { return document.getElementById(this.editBtnId);},
    getUpdatePairsBtn()         { return document.getElementById(this.updatePairsBtnId);},
    getFormGridBtn()            { return document.getElementById(this.formGridBtnId);},

    pairsTableId:       "pairs-table",
}

function groupInfoEdit(){
    var nameInput = groupObjects.getNameInput();
    
    if(nameInput != null){
        var discipline = groupObjects.getDisciplineInput().value;
        var system = groupObjects.getSystemInput().value;
        var sex = groupObjects.getSexInput().value;
        var ageMin = groupObjects.getAgeMinInput().value;
        var ageMax = groupObjects.getAgeMaxInput().value;
        var weightMin = groupObjects.getWeightMinInput().value;
        var weightMax = groupObjects.getWeightMaxInput().value;
        var qualMin = groupObjects.getQualMinInput().value;
        var qualMax = groupObjects.getQualMaxInput().value;
        server.editGroup(page.cid, page.gid, nameInput.value,
            discipline, system,
            sex == "Not applicable" ? undefined : sex,
            ageMin == "" ? undefined : ageMin,
            ageMax == "" ? undefined : ageMax,
            weightMin == "" ? undefined : weightMin,
            weightMax == "" ? undefined : weightMax,
            qualMin == "Not applicable" ? undefined : qualMin,
            qualMax == "Not applicable" ? undefined : qualMax);
            return;
    }
    var namePlace       = groupObjects.getAndCleanPlace(groupObjects.infoNameId);
    var systemPlace     = groupObjects.getAndCleanPlace(groupObjects.infoSystemId);
    var sexPlace        = groupObjects.getAndCleanPlace(groupObjects.infoSexId);
    var disciplinePlace = groupObjects.getAndCleanPlace(groupObjects.infoDisciplineId);
    var ageMinPlace     = groupObjects.getAndCleanPlace(groupObjects.infoAgeMinId);
    var ageMaxPlace     = groupObjects.getAndCleanPlace(groupObjects.infoAgeMaxId);
    var weightMinPlace  = groupObjects.getAndCleanPlace(groupObjects.infoWeightMinId);
    var weightMaxPlace  = groupObjects.getAndCleanPlace(groupObjects.infoWeightMaxId);
    var qualMinPlace    = groupObjects.getAndCleanPlace(groupObjects.infoQualMinId);
    var qualMaxPlace    = groupObjects.getAndCleanPlace(groupObjects.infoQualMaxId);

    namePlace.appendChild(      groupObjects.createInput(groupObjects.inputNameId));
    systemPlace.appendChild(    groupObjects.createInput(groupObjects.inputSystemId));
    sexPlace.appendChild(       groupObjects.createInput(groupObjects.inputSexId));
    disciplinePlace.appendChild(groupObjects.createInput(groupObjects.inputDisciplineId));
    ageMinPlace.appendChild(    groupObjects.createInput(groupObjects.inputAgeMinId));
    ageMaxPlace.appendChild(    groupObjects.createInput(groupObjects.inputAgeMaxId));
    weightMinPlace.appendChild( groupObjects.createInput(groupObjects.inputWeightMinId));
    weightMaxPlace.appendChild( groupObjects.createInput(groupObjects.inputWeightMaxId));
    qualMinPlace.appendChild(   groupObjects.createInput(groupObjects.inputQualMinId));
    qualMaxPlace.appendChild(   groupObjects.createInput(groupObjects.inputQualMaxId));

    groupObjects.getNameInput().value       = ops.group.getName(groupInfo);
    groupObjects.getAgeMinInput().value     = ops.group.getAgeMin(groupInfo);
    groupObjects.getAgeMaxInput().value     = ops.group.getAgeMax(groupInfo);
    groupObjects.getWeightMinInput().value  = ops.group.getWeightMin(groupInfo);
    groupObjects.getWeightMaxInput().value  = ops.group.getWeightMax(groupInfo);
    groupObjects.getSystemInput().value = ops.group.getFormSystem(groupInfo);
    if(ops.group.getSex(groupInfo) != "")
        groupObjects.getSexInput().value = ops.group.getSex(groupInfo);

    var discList = groupObjects.getDisciplineInput();
    ops.department.getDisciplines(departmentInfo).forEach(dsc => {
        var opt = groupObjects.createOption(dsc + "-id", dsc, dsc);
        discList.appendChild(opt);
        if(ops.group.getDiscipline(groupInfo) == dsc)
            discList.value = dsc;

    });
    var qualMinList = groupObjects.getQualMinInput();
    var qualMaxList = groupObjects.getQualMaxInput();
    qualificationsMap.forEach(function(name, value) {
        var optMin = groupObjects.createOption(name + "-min-id", name, value);
        var optMax = groupObjects.createOption(name + "-max-id", name, value);
        qualMinList.appendChild(optMin);
        qualMaxList.appendChild(optMax);
        if(ops.group.getQualMin(groupInfo) == value)
            qualMinList.value = value;

        if(ops.group.getQualMax(groupInfo) == value)
            qualMaxList.value = value;
    });
}


function fillPageInfo(){
    /*--------------------------------Main tables params--------------------------------------------------------------------------------*/
    var qualMax = qualificationsMap.get(ops.group.getQualMax(groupInfo));
    var qualMin = qualificationsMap.get(ops.group.getQualMin(groupInfo));

    groupObjects.setPageName(ops.competition.getName(competitionInfo));
    groupObjects.setPageNameLink(competitionLink);
    groupObjects.setCompetitionName(ops.competition.getName(competitionInfo));
    groupObjects.setCompetitionLink(competitionLink);
    groupObjects.setDepartmentName(ops.department.getName(departmentInfo));
    groupObjects.setDepartmentLink(departmentLink);
    groupObjects.setGroupName(ops.group.getName(groupInfo));
    groupObjects.setGroupLink( window.location.href);

    groupObjects.setDelBtnLink(competitionLink);
    groupObjects.setGroupHeader(ops.group.getName(groupInfo));

    groupObjects.setInfoName(       ops.group.getName(groupInfo));
    groupObjects.setInfoSystem(     ops.group.getFormSystem(groupInfo));
    groupObjects.setInfoDiscipline( ops.group.getDiscipline(groupInfo));
    groupObjects.setInfoSex(        ops.group.getSex(groupInfo));
    groupObjects.setInfoAgeMin(     ops.group.getAgeMin(groupInfo));
    groupObjects.setInfoAgeMax(     ops.group.getAgeMax(groupInfo));
    groupObjects.setInfoWeightMin(  ops.group.getWeightMin(groupInfo));
    groupObjects.setInfoWeightMax(  ops.group.getWeightMax(groupInfo));
    groupObjects.setInfoQulificationMin((qualMin == undefined) ? "" : qualMin);
    groupObjects.setInfoQulificationMax((qualMax == undefined) ? "" : qualMax);

    ops.group.getSportsmans(groupInfo).forEach(sp => sportsmanPageElementAdd(sp));
    competitionSportsmans.forEach(sp => competitionSportsmanElementAdd(sp));
    ops.group.getPairs(groupInfo).forEach(pair =>   pairPageElementAdd(pair));
}

function setBtnActions(){
    onClick(sportsmanObjects.getAddBtn(),       addSportsmansList);
    onClick(groupObjects.getDelBtn(),           function(){server.delGroup(page.cid, page.gid)});
    onClick(groupObjects.getEditBtn(),          groupInfoEdit);
    onClick(groupObjects.getUpdatePairsBtn(),   refreshPairs);
    onClick(groupObjects.getFormGridBtn(),      {});

}

fillPageInfo();
setBtnActions();
formPairsGrid();
showAllIfAdmin();
languageSwitchingOn();
