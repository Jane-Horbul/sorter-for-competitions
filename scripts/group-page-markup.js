

import {getSportsName} from "./group-page.js"
import {helpers, createPageItem} from "./common.js"

function getWinStyle(pair){
    var winner = pair.getWinner();
    return helpers.isEmptyString(winner) ? "" : ((winner == pair.getRedSp()) ? markup.pairs.redWinStyle : markup.pairs.blueWinStyle);
}

function getPairWinner(pair){
    var winner = pair.getWinner();
    if(helpers.isEmptyString(winner)){
        if(!helpers.isSportsmanId(pair.getRedSp()) || !helpers.isSportsmanId(pair.getBlueSp()))
            return "";
        return markup.pairs.createWinBtns(pair.getId());
    } else {
        return getSportsName(winner);
    }
}

export const markup = {
    pairs: {
        redBtnStyle:     "red-button-style",
        blueBtnStyle:    "blue-button-style",
        redWinStyle:     "red-cell-style",
        blueWinStyle:    "blue-cell-style",
    
        getTable()                  { return document.getElementById("pairs-table");},
        getTemplate()               { return document.getElementById("pair-template");},
        getPlaceholders(p)          { return {
                                            "#pair-num":        Number(p.getNumber()) > 0 ? p.getNumber() : "",
                                            "#pairs-list":      p.getArena() != undefined ? p.getArena() : "",
                                            "#time":            p.getTime("hh:min (dd/mm)"),
                                            "#final-part":      "1/" + p.getFinalPart(),
                                            "#red-sportsman":   getSportsName(p.getRedSp()),
                                            "#blue-sportsman":  getSportsName(p.getBlueSp()),
                                            "#pair-winner":     getPairWinner(p),
                                            "#winner-style":    getWinStyle(p)
                                        };
                                    },
        createWinBtns(id)           { return document.getElementById("win-btn-template").innerHTML.replaceAll("#pair-id", id);},
        getRedBtnId(spId)           { return document.getElementById("red-btn-" + spId); },
        getBlueBtnId(spId)          { return document.getElementById("blue-btn-" + spId); }       
    },
    sportsmen: {
        sportsmanRowId:     "sports-row-id-",
        removeBtnId:        "remove-gr-sports-",
        addBtnId:           "sportsmans-add-list-send-btn",
    
        getTable()                  { return document.getElementById("members-table");},
        getTemplate()               { return document.getElementById("group-member-template");},
    
        getAddingTable()            { return document.getElementById("add-sportsman-table");},
        getAddingTemplate()         { return document.getElementById("add-sportsman-template");},
        getAddingSportsRow(id)      { return document.getElementById("add-sports-" + id)},
    
        getPlaceholders(sp, quals, dlink)  { return {
                                            "#sp-id":           sp.getId(),
                                            "#sp-surname":      sp.getSurname(),
                                            "#sp-name":         sp.getName(),
                                            "#sp-age":          sp.getAge(),
                                            "#sp-weight":       sp.getWeight(),
                                            "#sp-sex":          sp.getSex(),
                                            "#sp-team":         sp.getTeam(),
                                            "#sp-qual":         quals.get("" + sp.getQualification()),
                                            "#sp-admit":        sp.getAdmition(),
                                            "#sp-gr-num":       sp.getGroupsNum(),
                                            "#sportsman-link":  dlink + sp.getLink(),
                                            "#sports-row-id":   this.sportsmanRowId + sp.getId()
                                        };
                                    },
        getSportsRow(id)            { return document.getElementById(this.sportsmanRowId + id);},
        getAddBtn()                 { return document.getElementById(this.addBtnId);},
        getDelBtn(sp)               { return document.getElementById(markup.sportsmen.removeBtnId + sp.getId());},
        getAdmitLabel(sp)           { return document.getElementById("label-admit-sp-" + sp.getId());},
        getAdmitBtn(sp)             { return document.getElementById("admit-sp-" + sp.getId());},
        getYesNoWord(val)           { return (val ? document.getElementById("yes-template") : document.getElementById("no-template")).innerHTML;}
    },
    grid: {
        scale:          30,
        final:          1,
        whiteFillColor: "rgb(255,255,255)",
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
        createCanvas(pairs_num)     { 
                                        var canvas              = document.createElement('canvas');
                                        canvas.style.position   = 'relative'
                                        canvas.width            = this.getGridWidh(pairs_num);
                                        canvas.height           = this.getGridHeight(pairs_num);
                                        
                                        var ctx                 = canvas.getContext('2d');
                                        ctx.font                = "17px serif";
                                        ctx.lineWidth           = 3;
                                        return canvas;
                                    },
        printText(ctx, text, x, y)  {ctx.fillText(text, x + this.shiftTextX, y - this.shiftTextY);}
    },
    group: {
        pageNameId:         "page-name",
        pageNameLinkId:     "page-name-link",
        compLinkId:         "competition-link",
        depLinkId:          "department-link",
        groupLinkId:        "group-link",
    
        setPageName(name)           {document.getElementById(this.pageNameId).innerHTML = name;},
        setDepartmentName(name)     {document.getElementById(this.depLinkId).innerHTML = name;},
        setDepartmentLink(link)     {document.getElementById(this.depLinkId).setAttribute("href", link);},
        setCompetitionName(name)    {document.getElementById(this.compLinkId).innerHTML = name;},
        setCompetitionLink(link)    {document.getElementById(this.compLinkId).setAttribute("href", link);},
        setGroupName(name)          {document.getElementById(this.groupLinkId).innerHTML = name;},
        setGroupLink(link)          {document.getElementById(this.groupLinkId).setAttribute("href", link);},
    
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
        getDelFormulaBtn(n)         { return document.getElementById(this.getDelFrmlBtnId(n)); },
    
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
}