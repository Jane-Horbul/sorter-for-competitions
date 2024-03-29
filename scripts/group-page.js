import {helpers,
    getLinkParams, 
    showShadows, 
    languageSwitchingOn,
    onClick,
    createPageItem,
    commonStrings,
    filtration,
    rowsComparator,
    prepareTabs,
    prepareClient,
    onPageLoad} from "./common.js"

import {ops, server} from "./communication.js"
import {markup} from "./group-page-markup.js"
const competitionLink   = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
const departmentLink    = competitionLink.substring(0, competitionLink.lastIndexOf("/"));
const pageParams        = getLinkParams(location.search);
const page = {
    cid: pageParams.get("cid"),
    gid: pageParams.get("gid")
}

const client              = server.access.getClient();
var groupInfo             = server.group.get(page.cid, page.gid);
const departmentInfo      = server.department.get();
const competitionInfo     = server.competition.get(page.cid);
const qualificationsMap   = departmentInfo.getQualifications();
var competitionSportsmans = competitionInfo.getSportsmen();
var sportsmansAddList     = new Array(0);

console.log(groupInfo);

/* ------------------- PAIRS ----------------------------*/

function pairPageElementAdd(pair){
    if(pair.getId() == undefined) return;
    var unknowWinner = helpers.isEmptyString(pair.getWinner());
    var unknowMember = !helpers.isSportsmanId(pair.getRedSp()) || !helpers.isSportsmanId(pair.getBlueSp());
    var template = markup.pairs.getTemplate();
    var placeholders = markup.pairs.getPlaceholders(pair);
    var newItem = createPageItem(template, placeholders);
    markup.pairs.getTable().append(newItem); 
    if(unknowWinner && !unknowMember) {
        onClick(markup.pairs.getRedBtnId(pair.getId()), function(){server.group.setPairWinner(page.cid, page.gid, pair.getId(), "red")});
        onClick(markup.pairs.getBlueBtnId(pair.getId()), function(){server.group.setPairWinner(page.cid, page.gid, pair.getId(), "blue")});
    }
}

function refreshPairs(){
    server.group.refreshPairs(page.cid, page.gid);
    location.reload();
}

/* ------------------- SPORTSMANS ----------------------------*/

export function getSportsName(id){
    if(!helpers.isSportsmanId(id)){
        return "Winner of " + id;
    }

    var sports = groupInfo.getSportsmen().find( sp => sp.getId() == id);
    if(sports == undefined) return "";
    return sports.getSurname() + " " + sports.getName();
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
    var spRow = markup.sportsmen.getSportsRow(id);
    var sportsmans = groupInfo.getSportsmen();
    if(null != spRow)
        spRow.parentElement.removeChild(spRow);
    for(var i = 0; i < sportsmans.length; i++){
        if(id == sportsmans[i].getId()){
            sportsmans.splice(i, 1);
            break;
        }
    }
    server.group.excludeSportsman(page.cid, page.gid, id);
}

function sportsmanAddingSelect(sid){
    var spRow   = markup.sportsmen.getAddingSportsRow(sid);
    var sp      = sportsmansAddList.find( curSp => curSp.getId() == sid);
    if(sp == undefined) {
        sp = competitionSportsmans.find( curSp => curSp.getId() == sid);
        markup.sportsmen.selectRow(spRow);
        sportsmansAddList.push(sp);
    } else {
        markup.sportsmen.deselectRow(spRow);
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
        var template = markup.sportsmen.getAddingTemplate();
        var placeholders = markup.sportsmen.getPlaceholders(sp, qualificationsMap, departmentLink);
        var newItem = createPageItem(template, placeholders);
        markup.sportsmen.getAddingTable().append(newItem);
        onClick(markup.sportsmen.getAddingSportsRow(sid), function(){sportsmanAddingSelect(sid)});
        
    }
}

function sportsmanAdmitChange(sp, admitCheckbox){
    markup.sportsmen.getAdmitLabel(sp).innerHTML = markup.sportsmen.getYesNoWord(admitCheckbox.checked);
    server.sportsman.admitChange(sp.getId(), page.cid, "" + admitCheckbox.checked);
}

function sportsmanPageElementAdd(sp){
    if(sp.getId() != undefined){
        excludeCompetitionSportsman(sp);
        var template = markup.sportsmen.getTemplate();
        var placeholders = markup.sportsmen.getPlaceholders(sp, qualificationsMap, departmentLink);
        var newItem = createPageItem(template, placeholders);
        markup.sportsmen.getTable().append(newItem); 
        

        var admitCheckbox = markup.sportsmen.getAdmitBtn(sp);
        admitCheckbox.checked = sp.getAdmition();
        markup.sportsmen.getAdmitLabel(sp).innerHTML = markup.sportsmen.getYesNoWord(admitCheckbox.checked);
        if(client.isRoot() || client.isAdmin()){
            admitCheckbox.disabled = false;
            onClick(admitCheckbox, function(){sportsmanAdmitChange(sp, admitCheckbox);});
            onClick(markup.sportsmen.getDelBtn(sp), function(){sportsmanRemove(sp.getId())});
        }
    }
}

function addSportsmansList()
{
    var sids = "";
    sportsmansAddList.forEach(sp =>   sids += sp.getId() + commonStrings.arrDivider);
    server.group.includeSportsList(page.cid, page.gid, sids);
}

/* ------------------- PAIRS GRID ----------------------------*/

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
    var finalPair = pairs.find( pr => (markup.grid.isFinalPair(pr)) );;
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
    var startX  = shiftX + markup.grid.getPairWidh();
    var midleX  = startX + markup.grid.getDistanceWidh() / 2;
    var endX    = startX + markup.grid.getDistanceWidh();
    var startY  = shiftY + markup.grid.getPairHeight() / 2;

    if((row % 2) == 1)
    {
        var color   = markup.grid.blueFillColor;
        var endY    = startY - lineHigh + markup.grid.getPairHeight() / 4;
    }
    else
    {
        var color   = markup.grid.redFillColor;
        var endY    = startY + lineHigh - markup.grid.getPairHeight() / 4;
    }

    drawLine({x: startX, y: startY}, {x: midleX, y: startY}, ctx, color);
    drawLine({x: midleX, y: startY}, {x: midleX, y: endY}, ctx, color);
    drawLine({x: midleX, y: endY},   {x: endX,   y: endY}, ctx, color);
}

function getGridPairNames(pair)
{
    var redId = pair.getRedSp();
    var blueId = pair.getBlueSp();
    var spRed    = groupInfo.getSportsmen().find( sp => (sp.getId() == redId));
    var spBlue   = groupInfo.getSportsmen().find( sp => (sp.getId() == blueId));
    var names = {red: "", blue: "", num: "", arena: "", time: ""}; 

    if(spRed == undefined)
        names.red = commonStrings.pairWinner(redId);
    else
        names.red = spRed.getSurname() + " " + spRed.getName();

    if(spBlue == undefined)
        names.blue = commonStrings.pairWinner(blueId);
    else
        names.blue = spBlue.getSurname() + " " + spBlue.getName();
    if(pair.getNumber() != undefined)
        names.num = pair.getNumber();
    if(pair.getArena() != undefined)
        names.arena = pair.getArena();
    if(pair.getTime() != undefined)
        names.time = pair.getTime("hh:min");
    return names;
}

function drawPair(ctx, shiftX, shiftY, pair){
    var width       = markup.grid.getPairWidh();
    var height      = markup.grid.getPairHeight();
    var midleHeight = height / 2;
    var midleY      = shiftY + midleHeight;
    var names       = getGridPairNames(pair);
    
    ctx.fillStyle = markup.grid.redFillColor;
    ctx.fillRect(shiftX, shiftY, width, midleHeight);
    ctx.fillStyle = markup.grid.blueFillColor;
    ctx.fillRect(shiftX, midleY, width, midleHeight);

    ctx.fillStyle   = "black";
    ctx.strokeStyle = "black";
    ctx.strokeRect(shiftX, shiftY, width, midleHeight);
    ctx.strokeRect(shiftX, midleY, width, midleHeight);

    markup.grid.printText(ctx, names.red,  shiftX, shiftY + midleHeight);
    markup.grid.printText(ctx, names.blue, shiftX, midleY + midleHeight);
    markup.grid.printText(ctx, names.time + " " + names.arena, shiftX, shiftY);
    markup.grid.printText(ctx, names.num, shiftX + width, shiftY + midleHeight);
}

function drawGrid(ctx, grid){
    var shiftX      = 0;
    var pairH       = markup.grid.getPairHeight();
    var distH       = markup.grid.getDistanceHeight();
    var powNum      = 1;

    for(var col = 0; col < grid.length; col++){
        var firstSpace = ((powNum - 1) / 2) * (pairH + distH);
        var stepY = powNum * (pairH + distH);
        var shiftY = firstSpace;
        for(var row = 0; row < grid[col].length; row++){
            if(grid[col][row] != undefined){
                drawPair(ctx, shiftX, shiftY, grid[col][row]);
                if(!markup.grid.isFinalPair(grid[col][row]))
                    drawConnection(ctx, shiftX, shiftY, row, stepY / 2);
            }
            shiftY += stepY;
        }
        powNum *= 2;
        shiftX += markup.grid.getPairWidh() + markup.grid.getDistanceWidh();
    }
}

function formPairsGrid(){
    var pairsGrid           = createPairsGrid(groupInfo.getPairs());
    var canvas              = markup.grid.createCanvas(groupInfo.getPairs().length);

    drawGrid(canvas.getContext('2d'), pairsGrid);
    markup.grid.getContainer().append(canvas);
}

/* ------------------- COMMON ----------------------------*/

function formulaToString(formula){
    return formula.getPreparation() + "/" + formula.getRoundsNum() + "/" + formula.getRound() + "/" + formula.getRest() 
    + "/" + formula.getAfterhold() + "/" + formula.getFinalMin() + "/" + formula.getFinalMax();
}

function removeFormula(indx, formula){
    var fTable  = markup.group.getFormulasTable();
    server.group.deleteFormula(page.cid, page.gid, formulaToString(formula));
    fTable.rows[indx].remove();
}

function formulaPageElementAdd(formula){
    var fTable  = markup.group.getFormulasTable();
    var indx = fTable.rows.length - 1;
    var newItem = createPageItem(markup.group.getFormulaTemplate(), markup.group.getFormulaPlaceholders(formula, indx));
    var fRow    =  fTable.insertRow(fTable.rows.length - 1);
    fRow.append(newItem);
    onClick(markup.group.getDelFormulaBtn(indx), function(){removeFormula(indx, formula)});
}

function addNewFormula(){
    var formula = server.group.createFormula();

    formula.setPreparation(markup.group.getFormulaPrepareInput().value);
    formula.setRoundsNum(markup.group.getFormulaRoundsNumInput().value);
    formula.setRound(markup.group.getFormulaRoundInput().value);
    formula.setRest(markup.group.getFormulaRestInput().value);
    formula.setAfterhold(markup.group.getFormulaHoldInput().value);
    formula.setFinalMin(markup.group.getFormulaFinalMinInput().value);
    formula.setFinalMax(markup.group.getFormulaFinalMaxInput().value);
    if(formula.getFinalMin() == "")
        formula.setFinalMin("-1");
    if(formula.getFinalMax() == "")
        formula.setFinalMax("-1");

    if(!helpers.isNumber(formula.getPreparation())){
        return;
    } else if(!helpers.isNumber(formula.getRoundsNum())){
        return;
    } else if(!helpers.isNumber(formula.getRound())){
        return;
    } else if(!helpers.isNumber(formula.getRest())){
        return;
    } else if(!helpers.isNumber(formula.getAfterhold())){
        return;
    } else if(!helpers.isNumber(formula.getFinalMin())){
        return;
    } else if(!helpers.isNumber(formula.getFinalMax())){
        return;
    }
    server.group.addFormula(page.cid, page.gid, formulaToString(formula));
    formulaPageElementAdd(formula);
}

function groupInfoEdit(){
    var nameInput = markup.group.getNameInput();
    
    if(nameInput != null){
        var newGroup = ops.createGroup();
        newGroup.setName(nameInput.value);
        newGroup.setDiscipline(markup.group.getDisciplineInput().value);
        newGroup.setFormSystem(markup.group.getSystemInput().value);
        if(markup.group.getSexInput().value != "Not applicable")
            newGroup.setSex(markup.group.getSexInput().value);
        if(markup.group.getAgeMinInput().value != "")
            newGroup.setAgeMin(markup.group.getAgeMinInput().value);
        if(markup.group.getAgeMaxInput().value != "")
            newGroup.setAgeMax(markup.group.getAgeMaxInput().value);
        if(markup.group.getWeightMinInput().value != "")
            newGroup.setWeightMin(markup.group.getWeightMinInput().value);
        if(markup.group.getWeightMaxInput().value != "")
            newGroup.setWeightMax(markup.group.getWeightMaxInput().value);
        if(markup.group.getQualMinInput().value != "Not applicable")
            newGroup.setQualMin(markup.group.getQualMinInput().value);
        if(markup.group.getQualMaxInput().value != "Not applicable")
            newGroup.setQualMax(markup.group.getQualMaxInput().value);
        server.group.edit(page.cid, page.gid, newGroup);
        return;
    }
    var namePlace       = markup.group.getAndCleanPlace(markup.group.infoNameId);
    var systemPlace     = markup.group.getAndCleanPlace(markup.group.infoSystemId);
    var sexPlace        = markup.group.getAndCleanPlace(markup.group.infoSexId);
    var disciplinePlace = markup.group.getAndCleanPlace(markup.group.infoDisciplineId);
    var ageMinPlace     = markup.group.getAndCleanPlace(markup.group.infoAgeMinId);
    var ageMaxPlace     = markup.group.getAndCleanPlace(markup.group.infoAgeMaxId);
    var weightMinPlace  = markup.group.getAndCleanPlace(markup.group.infoWeightMinId);
    var weightMaxPlace  = markup.group.getAndCleanPlace(markup.group.infoWeightMaxId);
    var qualMinPlace    = markup.group.getAndCleanPlace(markup.group.infoQualMinId);
    var qualMaxPlace    = markup.group.getAndCleanPlace(markup.group.infoQualMaxId);

    namePlace.appendChild(      markup.group.createInput(markup.group.inputNameId));
    systemPlace.appendChild(    markup.group.createInput(markup.group.inputSystemId));
    sexPlace.appendChild(       markup.group.createInput(markup.group.inputSexId));
    disciplinePlace.appendChild(markup.group.createInput(markup.group.inputDisciplineId));
    ageMinPlace.appendChild(    markup.group.createInput(markup.group.inputAgeMinId));
    ageMaxPlace.appendChild(    markup.group.createInput(markup.group.inputAgeMaxId));
    weightMinPlace.appendChild( markup.group.createInput(markup.group.inputWeightMinId));
    weightMaxPlace.appendChild( markup.group.createInput(markup.group.inputWeightMaxId));
    qualMinPlace.appendChild(   markup.group.createInput(markup.group.inputQualMinId));
    qualMaxPlace.appendChild(   markup.group.createInput(markup.group.inputQualMaxId));

    markup.group.getNameInput().value       = groupInfo.getName();
    markup.group.getAgeMinInput().value     = groupInfo.getAgeMin();
    markup.group.getAgeMaxInput().value     = groupInfo.getAgeMax();
    markup.group.getWeightMinInput().value  = groupInfo.getWeightMin();
    markup.group.getWeightMaxInput().value  = groupInfo.getWeightMax();
    markup.group.getSystemInput().value = groupInfo.getFormSystem();
    if(groupInfo.getSex() != "")
        markup.group.getSexInput().value = groupInfo.getSex();

    var discList = markup.group.getDisciplineInput();
    departmentInfo.getDisciplines().forEach(dsc => {
        var opt = markup.group.createOption(dsc + "-id", dsc, dsc);
        discList.appendChild(opt);
        if(groupInfo.getDiscipline() == dsc)
            discList.value = dsc;
    });
    var qualMinList = markup.group.getQualMinInput();
    var qualMaxList = markup.group.getQualMaxInput();
    qualificationsMap.forEach(function(name, value) {
        var optMin = markup.group.createOption(name + "-min-id", name, value);
        var optMax = markup.group.createOption(name + "-max-id", name, value);
        qualMinList.appendChild(optMin);
        qualMaxList.appendChild(optMax);
        if(groupInfo.getQualMin() == value)
            qualMinList.value = value;

        if(groupInfo.getQualMax() == value)
            qualMaxList.value = value;
    });
}


function fillPageInfo(){
    /*--------------------------------Main tables--------------------------------------------------------------------------------*/
    var qualMax = qualificationsMap.get(groupInfo.getQualMax());
    var qualMin = qualificationsMap.get(groupInfo.getQualMin());

    markup.group.setPageName(groupInfo.getName());
    markup.breadcrumbs.setDpLink();
    markup.breadcrumbs.setCompLink();
    markup.breadcrumbs.setCompName(competitionInfo.getName());
    markup.breadcrumbs.setGroupName(groupInfo.getName());

    markup.group.setDelBtnLink(competitionLink);

    markup.group.setInfoName(       groupInfo.getName());
    markup.group.setInfoSystem(     groupInfo.getFormSystem());
    markup.group.setInfoDiscipline( groupInfo.getDiscipline());
    markup.group.setInfoSex(        groupInfo.getSex());
    markup.group.setInfoAgeMin(     groupInfo.getAgeMin());
    markup.group.setInfoAgeMax(     groupInfo.getAgeMax());
    markup.group.setInfoWeightMin(  groupInfo.getWeightMin());
    markup.group.setInfoWeightMax(  groupInfo.getWeightMax());
    markup.group.setInfoQulificationMin((qualMin == undefined) ? "" : qualMin);
    markup.group.setInfoQulificationMax((qualMax == undefined) ? "" : qualMax);

    groupInfo.getFormulas().forEach(f => formulaPageElementAdd(f));
    groupInfo.getSportsmen().forEach(sp => sportsmanPageElementAdd(sp));
    competitionSportsmans.forEach(sp => competitionSportsmanElementAdd(sp));
    
    var sortedPairs = groupInfo.getPairs().sort(function (p1, p2) { return Number(p1.getNumber()) - Number(p2.getNumber()); });
    sortedPairs.forEach(pair =>   pairPageElementAdd(pair));
}

function setBtnActions(){
    onClick(markup.sportsmen.getAddBtn(),       addSportsmansList);
    onClick(markup.group.getDelBtn(),           function(){server.group.remove(page.cid, page.gid)});
    onClick(markup.group.getEditBtn(),          groupInfoEdit);
    onClick(markup.group.getUpdatePairsBtn(),   refreshPairs);
    onClick(markup.group.getAddFormulaBtn(),    addNewFormula);

    filtration(markup.sportsmen.getSearchInput(), markup.sportsmen.getTable(), rowsComparator);
    filtration(markup.sportsmen.getAddingSearchInput(), markup.sportsmen.getAddingTable(), rowsComparator);
    filtration(markup.pairs.getSearchInput(), markup.pairs.getTable(), rowsComparator);
}

function main() {
    prepareClient(client);
    prepareTabs()
    fillPageInfo();
    setBtnActions();
    formPairsGrid();
    showShadows(client);
    languageSwitchingOn(client.getLang());    
}

onPageLoad(main);