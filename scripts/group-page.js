import {isNumber, isEmptyString, getLinkParams, showAllIfAdmin, languageSwitchingOn, onClick, createPageItem, commonStrings, refreshPage} from "./common.js"
import {ops, server} from "./communication.js"

const competitionLink   = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
const departmentLink    = competitionLink.substr(0, competitionLink.lastIndexOf("/"));
const pageParams        = getLinkParams(location.search);
const page = {
    cid: pageParams.get("cid"),
    gid: pageParams.get("gid")
}
var groupInfo             = server.group.get(page.cid, page.gid);
const departmentInfo      = server.department.get();
const competitionInfo     = server.competition.get(page.cid);
const qualificationsMap   = departmentInfo.getQualifications();
var competitionSportsmans = competitionInfo.getSportsmans();
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
                                        "#pair-num":        Number(p.getNumber()) > 0 ? p.getNumber() : "",
                                        "#pairs-list":      p.getPairsList() != undefined ? p.getPairsList() : "",
                                        "#time":            p.getFormatedTime("hh:min (dd/mm)"),
                                        "#final-part":      "1/" + p.getFinalPart(),
                                        "#red-sportsman":   getSportsName(p.getRedSp()),
                                        "#blue-sportsman":  getSportsName(p.getBlueSp()),
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
    confiWinBtn(id)             {onClick(document.getElementById("red-btn-" + id), function(){server.group.setPairWinner(page.cid, page.gid, id, "red")});
                                 onClick(document.getElementById("blue-btn-" + id), function(){server.group.setPairWinner(page.cid, page.gid, id, "blue")});}
}

function getSportsName(id){
    if(!isNumber(id)){
        return "Winner of " + id;
    }
    var sports = groupInfo.getSportsmans().find( sp => sp.getId() == id);
    if(sports == undefined) return "";
    return sports.getSurname() + " " + sports.getName();
}

function getWinStyle(pair){
    var winner = pair.getWinner();
    if(isEmptyString(winner)){
        return "";
    } else if(winner == pair.getRedSp()){
        return pairObjects.redWinStyle;
    } else{
        return pairObjects.blueWinStyle;
    }
}

function getPairWinner(pair){
    var winner = pair.getWinner();
    if(isEmptyString(winner)){
        if(!isNumber(pair.getRedSp()) || !isNumber(pair.getBlueSp()))
            return "";
        return pairObjects.createWinBtns(pair.getId());
    } else {
        return getSportsName(winner);
    }
}

function pairPageElementAdd(pair){
    if(pair.getId() == undefined) return;
    var unknowWinner = isEmptyString(pair.getWinner());
    var unknowMember = !isNumber(pair.getRedSp()) || !isNumber(pair.getBlueSp());
    var template = pairObjects.getTemplate();
    var placeholders = pairObjects.getPlaceholders(pair);
    var newItem = createPageItem(template, placeholders);
    pairObjects.getTable().append(newItem); 
    if(unknowWinner && !unknowMember) {
        pairObjects.confiWinBtn(pair.getId());
    }
}

function refreshPairs(){
    server.group.refreshPairs(page.cid, page.gid);
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
                                        "#sp-id":           sp.getId(),
                                        "#sp-surname":      sp.getSurname(),
                                        "#sp-name":         sp.getName(),
                                        "#sp-age":          sp.getAge(),
                                        "#sp-weight":       sp.getWeight(),
                                        "#sp-sex":          sp.getSex(),
                                        "#sp-team":         sp.getTeam(),
                                        "#sp-qual":         qualificationsMap.get(sp.getQualification()),
                                        "#sp-admit":        sp.getAdmition(),
                                        "#sp-gr-num":       sp.getGroupsNum(),
                                        "#sportsman-link":  departmentLink + sp.getLink(),
                                        "#sports-row-id":   this.sportsmanRowId + sp.getId()
                                    };
                                },
    getSportsRow(id)            { return document.getElementById(this.sportsmanRowId + id);},
    getAddBtn()                 { return document.getElementById(this.addBtnId);},
    configDelBtn(item, sp)      {var btn = item.getElementById(this.removeBtnId); 
                                    onClick(btn, function(){sportsmanRemove(sp.getId())});
                                    btn.id = this.removeBtnId + sp.getId();
                                },
    getDelBtn()                 { return document.getElementById("member-dell-btn");}
}

function excludeCompetitionSportsman(sp){
    for(var i = 0; i < competitionSportsmans.length; i++){
        if(sp.getId() == competitionSportsmans[i].getId()){
            competitionSportsmans.splice(i, 1);
            return;
        }
    }
}

function sportsmanRemove(id){
    var spRow = sportsmanObjects.getSportsRow(id);
    var sportsmans = groupInfo.getSportsmans();
    if(null != spRow)
        spRow.parentElement.removeChild(spRow);
    for(var i = 0; i < sportsmans.length; i++){
        if(id == sportsmans[i].getId()){
            sportsmans.splice(i, 1);
            break;
        }
    }
    console.log("Del id: " + id);
    server.group.excludeSportsman(page.cid, page.gid, id);
}

function sportsmanAddingSelect(sid){
    var spRow   = sportsmanObjects.getAddingSportsRow(sid);
    var sp      = sportsmansAddList.find( curSp => curSp.getId() == sid);
    console.log("Select callback: " + sid);
    if(sp == undefined) {
        sp = competitionSportsmans.find( curSp => curSp.getId() == sid);
        spRow.setAttribute("class", "add-sportsman-table-tr--selected");
        sportsmansAddList.push(sp);
    } else {
        spRow.setAttribute("class", "");
        for(var i = 0; i < sportsmansAddList.length; i++){
            if(sid == sportsmansAddList[i].getId()){
                sportsmansAddList.splice(i, 1);
                break;
            }
        }
    }
}

function competitionSportsmanElementAdd(sp){
    var sid = sp.getId();
    if(sid != undefined){
        var template = sportsmanObjects.getAddingTemplate();
        var placeholders = sportsmanObjects.getPlaceholders(sp);
        var newItem = createPageItem(template, placeholders);
        sportsmanObjects.getAddingTable().append(newItem);
        onClick(sportsmanObjects.getAddingSportsRow(sid), function(){sportsmanAddingSelect(sid)});
        
    }
}

function sportsmanPageElementAdd(sp){
    if(sp.getId() != undefined){
        excludeCompetitionSportsman(sp);
        var template = sportsmanObjects.getTemplate();
        var placeholders = sportsmanObjects.getPlaceholders(sp);
        var newItem = createPageItem(template, placeholders);
        sportsmanObjects.getTable().append(newItem); 
        onClick(document.getElementById(sportsmanObjects.removeBtnId + sp.getId()), function(){sportsmanRemove(sp.getId())});
    }
}

function addSportsmansList()
{
    var sids = "";
    sportsmansAddList.forEach(sp =>   sids += sp.getId() + commonStrings.arrDivider);
    server.group.includeSportsList(page.cid, page.gid, sids);
}

/* ------------------- PAIRS GRID ----------------------------*/
const gridObjects = {
    scale:          30,
    final:          1,
    redFillColor:   "rgb(255,96,90)",
    blueFillColor:  "rgb(0,148,204)",
    shiftTextX:     10,
    shiftTextY:     10,
    
    isFinalPair(pair)           {return (pair.getFinalPart() == "1");},
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
                                    canvas.width            = this.getGridWidh(groupInfo.getPairs().length);
                                    canvas.height           = this.getGridHeight(groupInfo.getPairs().length);
                                    
                                    var ctx                 = canvas.getContext('2d');
                                    ctx.font                = "17px serif";
                                    ctx.lineWidth           = 3;
                                    return canvas;
                                },
    printText(ctx, text, x, y)  {ctx.fillText(text, x + this.shiftTextX, y - this.shiftTextY);}
}

function getParentPair(pairs, childId, spId){
    var res = pairs.find(pair => {
        if(childId  != pair.getChildPair()) return false;
        if(spId     == pair.getWinner())    return true;
        if(spId     == pair.getRedSp())     return true;
        if(spId     == pair.getBlueSp())    return true;
        if(spId     == pair.getId())        return true;
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
            var spRed = getParentPair(pairs, curPair.getId(), curPair.getRedSp());
            var spBlu = getParentPair(pairs, curPair.getId(), curPair.getBlueSp());
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
    var redId = pair.getRedSp();
    var blueId = pair.getBlueSp();
    var spRed    = groupInfo.getSportsmans().find( sp => (sp.getId() == redId));
    var spBlue   = groupInfo.getSportsmans().find( sp => (sp.getId() == blueId));
    var names = {red: "", blue: ""}; 

    if(spRed == undefined)
        names.red = commonStrings.pairWinner(redId);
    else
        names.red = spRed.getSurname() + " " + spRed.getName();

    if(spBlue == undefined)
        names.blue = commonStrings.pairWinner(blueId);
    else
        names.blue = spBlue.getSurname() + " " + spBlue.getName();
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
    var pairsGrid           = createPairsGrid(groupInfo.getPairs());
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

    inputFormulaPrepare:    "add-formula-preparation",
    inputFormulaRounsNum:   "add-formula-rounds-num",
    inputFormulaRound:      "add-formula-rounds-dur",
    inputFormulaRest:       "add-formula-rest-dur",
    inputFormulaHold:       "add-formula-after-hold",
    inputFormulaFinalMin:   "add-formula-final-min",
    inputFormulaFinalMax:   "add-formula-final-max",

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

    getFormulaPrepareInput()    { return document.getElementById(this.inputFormulaPrepare);},
    getFormulaRoundsNumInput()  { return document.getElementById(this.inputFormulaRounsNum);},
    getFormulaRoundInput()      { return document.getElementById(this.inputFormulaRound);},
    getFormulaRestInput()       { return document.getElementById(this.inputFormulaRest);},
    getFormulaHoldInput()       { return document.getElementById(this.inputFormulaHold);},
    getFormulaFinalMinInput()   { return document.getElementById(this.inputFormulaFinalMin);},
    getFormulaFinalMaxInput()   { return document.getElementById(this.inputFormulaFinalMax);},

    createInput(id)             { return document.getElementById((id + "-template")).cloneNode(true).content;},
    createOption(id, name, val) { var res = document.createElement("option");
                                    res.setAttribute("id", id);
                                    res.value = val;
                                    res.innerHTML = name;
                                    return res;
                                },
    getAndCleanPlace(id)        { var pl= document.getElementById(id); pl.innerHTML = ""; return pl;},
    
    getDelFrmlBtnId(num)        { return "formula-del-btn-" + num;},
    setDelFormulaHandle(n, hndl){ onClick(document.getElementById(this.getDelFrmlBtnId(n)), hndl)},

    getFormulasTable()          { return document.getElementById("formulas-table");},
    getFormulaTemplate()        { return document.getElementById("formula-row-template");},
    getFormulaPlaceholders(f, n){ return {
                                            "#preparation": f.getPreparation(),
                                            "#rounds-num":  f.getRoundsNum(),
                                            "#round-dur":   f.getRound(),
                                            "#rest-dur":    f.getRest(),
                                            "#after-hold":  f.getAfterhold(),
                                            "#final-min":   Number(f.getFinalMin()) < 0 ? "" : f.getFinalMin(),
                                            "#final-max":   Number(f.getFinalMax()) < 0 ? "" : f.getFinalMax(),
                                            "#dell-btn_id": this.getDelFrmlBtnId(n)
                                        };
                                    },

    delBtnId:           "del-btn-link",
    editBtnId:          "group-edit-btn",
    updatePairsBtnId:   "update-pairs-btn",
    addFormulaBtnId:    "formula-add-btn",

    setDelBtnLink(link)         {this.getDelBtn().setAttribute("href", link);},
    getDelBtn()                 { return document.getElementById(this.delBtnId);},
    getEditBtn()                { return document.getElementById(this.editBtnId);},
    getUpdatePairsBtn()         { return document.getElementById(this.updatePairsBtnId);},
    getAddFormulaBtn()          { return document.getElementById(this.addFormulaBtnId);}
}

function formulaToString(formula){
    return formula.getPreparation() + "/" + formula.getRoundsNum() + "/" + formula.getRound() + "/" + formula.getRest() 
    + "/" + formula.getAfterhold() + "/" + formula.getFinalMin() + "/" + formula.getFinalMax();
}

function removeFormula(indx, formula){
    var fTable  = groupObjects.getFormulasTable();
    server.group.deleteFormula(page.cid, page.gid, formulaToString(formula));
    fTable.rows[indx].remove();
}

function formulaPageElementAdd(formula){
    var fTable  = groupObjects.getFormulasTable();
    var indx = fTable.rows.length - 1;
    var newItem = createPageItem(groupObjects.getFormulaTemplate(), groupObjects.getFormulaPlaceholders(formula, indx));
    var fRow    =  fTable.insertRow(fTable.rows.length - 1);
    fRow.append(newItem);
    groupObjects.setDelFormulaHandle(indx, function(){removeFormula(indx, formula)});
    
}

function addNewFormula(){
    var formula = server.group.createFormula(undefined);

    formula.setPreparation(groupObjects.getFormulaPrepareInput().value);
    formula.setRoundsNum(groupObjects.getFormulaRoundsNumInput().value);
    formula.setRound(groupObjects.getFormulaRoundInput().value);
    formula.setRest(groupObjects.getFormulaRestInput().value);
    formula.setAfterhold(groupObjects.getFormulaHoldInput().value);
    formula.setFinalMin(groupObjects.getFormulaFinalMinInput().value);
    formula.setFinalMax(groupObjects.getFormulaFinalMaxInput().value);
    if(formula.getFinalMin() == "")
        formula.setFinalMin("-1");
    if(formula.getFinalMax() == "")
        formula.setFinalMax("-1");

    if(!isNumber(formula.getPreparation())){
        return;
    } else if(!isNumber(formula.getRoundsNum())){
        return;
    } else if(!isNumber(formula.getRound())){
        return;
    } else if(!isNumber(formula.getRest())){
        return;
    } else if(!isNumber(formula.getAfterhold())){
        return;
    } else if(!isNumber(formula.getFinalMin())){
        return;
    } else if(!isNumber(formula.getFinalMax())){
        return;
    }
    server.group.addFormula(page.cid, page.gid, formulaToString(formula));
    formulaPageElementAdd(formula);
}

function groupInfoEdit(){
    var nameInput = groupObjects.getNameInput();
    
    if(nameInput != null){
        var newGroup = ops.createGroup(undefined);
        newGroup.setName(nameInput.value);
        newGroup.setDiscipline(groupObjects.getDisciplineInput().value);
        newGroup.setFormSystem(groupObjects.getSystemInput().value);
        if(groupObjects.getSexInput().value != "Not applicable")
            newGroup.setSex(groupObjects.getSexInput().value);
        if(groupObjects.getAgeMinInput().value != "")
            newGroup.setAgeMin(groupObjects.getAgeMinInput().value);
        if(groupObjects.getAgeMaxInput().value != "")
            newGroup.setAgeMax(groupObjects.getAgeMaxInput().value);
        if(groupObjects.getWeightMinInput().value != "")
            newGroup.setWeightMin(groupObjects.getWeightMinInput().value);
        if(groupObjects.getWeightMaxInput().value != "")
            newGroup.setWeightMax(groupObjects.getWeightMaxInput().value);
        if(groupObjects.getQualMinInput().value != "Not applicable")
            newGroup.setQualMin(groupObjects.getQualMinInput().value);
        if(groupObjects.getQualMaxInput().value != "Not applicable")
            newGroup.setQualMax(groupObjects.getQualMaxInput().value);
        server.group.edit(page.cid, page.gid, newGroup);
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

    groupObjects.getNameInput().value       = groupInfo.getName();
    groupObjects.getAgeMinInput().value     = groupInfo.getAgeMin();
    groupObjects.getAgeMaxInput().value     = groupInfo.getAgeMax();
    groupObjects.getWeightMinInput().value  = groupInfo.getWeightMin();
    groupObjects.getWeightMaxInput().value  = groupInfo.getWeightMax();
    groupObjects.getSystemInput().value = groupInfo.getFormSystem();
    if(groupInfo.getSex() != "")
        groupObjects.getSexInput().value = groupInfo.getSex();

    var discList = groupObjects.getDisciplineInput();
    departmentInfo.getDisciplines().forEach(dsc => {
        var opt = groupObjects.createOption(dsc + "-id", dsc, dsc);
        discList.appendChild(opt);
        if(groupInfo.getDiscipline() == dsc)
            discList.value = dsc;
    });
    var qualMinList = groupObjects.getQualMinInput();
    var qualMaxList = groupObjects.getQualMaxInput();
    qualificationsMap.forEach(function(name, value) {
        var optMin = groupObjects.createOption(name + "-min-id", name, value);
        var optMax = groupObjects.createOption(name + "-max-id", name, value);
        qualMinList.appendChild(optMin);
        qualMaxList.appendChild(optMax);
        if(groupInfo.getQualMin() == value)
            qualMinList.value = value;

        if(groupInfo.getQualMax() == value)
            qualMaxList.value = value;
    });
}


function fillPageInfo(){
    /*--------------------------------Main tables params--------------------------------------------------------------------------------*/
    var qualMax = qualificationsMap.get(groupInfo.getQualMax());
    var qualMin = qualificationsMap.get(groupInfo.getQualMin());

    groupObjects.setPageName(competitionInfo.getName());
    groupObjects.setPageNameLink(competitionLink);
    groupObjects.setCompetitionName(competitionInfo.getName());
    groupObjects.setCompetitionLink(competitionLink);
    groupObjects.setDepartmentName(departmentInfo.getName());
    groupObjects.setDepartmentLink(departmentLink);
    groupObjects.setGroupName(groupInfo.getName());
    groupObjects.setGroupLink(window.location.href);

    groupObjects.setDelBtnLink(competitionLink);
    groupObjects.setGroupHeader(groupInfo.getName());

    groupObjects.setInfoName(       groupInfo.getName());
    groupObjects.setInfoSystem(     groupInfo.getFormSystem());
    groupObjects.setInfoDiscipline( groupInfo.getDiscipline());
    groupObjects.setInfoSex(        groupInfo.getSex());
    groupObjects.setInfoAgeMin(     groupInfo.getAgeMin());
    groupObjects.setInfoAgeMax(     groupInfo.getAgeMax());
    groupObjects.setInfoWeightMin(  groupInfo.getWeightMin());
    groupObjects.setInfoWeightMax(  groupInfo.getWeightMax());
    groupObjects.setInfoQulificationMin((qualMin == undefined) ? "" : qualMin);
    groupObjects.setInfoQulificationMax((qualMax == undefined) ? "" : qualMax);

    groupInfo.getFormulas().forEach(f => formulaPageElementAdd(f));
    groupInfo.getSportsmans().forEach(sp => sportsmanPageElementAdd(sp));
    competitionSportsmans.forEach(sp => competitionSportsmanElementAdd(sp));
    groupInfo.getPairs().forEach(pair =>   pairPageElementAdd(pair));
}

function setBtnActions(){
    onClick(sportsmanObjects.getAddBtn(),       addSportsmansList);
    onClick(groupObjects.getDelBtn(),           function(){server.group.remove(page.cid, page.gid)});
    onClick(groupObjects.getEditBtn(),          groupInfoEdit);
    onClick(groupObjects.getUpdatePairsBtn(),   refreshPairs);
    onClick(groupObjects.getAddFormulaBtn(),   addNewFormula);
}

fillPageInfo();
setBtnActions();
formPairsGrid();
showAllIfAdmin();
languageSwitchingOn();
