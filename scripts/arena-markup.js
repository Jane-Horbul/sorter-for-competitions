import { department, competition, arena} from "./arena.js";
import { checkers } from "./common.js";

var aLink = window.location.href;
var cLink = aLink.substring(0, aLink.lastIndexOf("/"));
var dLink = cLink.substring(0, cLink.lastIndexOf("/"));


function getSpName(sid){
    if(checkers.isEmptyString(sid))
        return "";
    var sp = department.getSportsmanById(sid);
    if(undefined != sp)
        return sp.getName() + " " + sp.getSurname();
    var pair = arena.getPairById(sid);
    return markup.common.getPairWinnerText() + " " + (pair == undefined ? sid : pair.getNumber());
}

export const markup = {
    login:          {
        getLoginBtn()               { return document.getElementById("login-btn");},
        getLogin()                  { return document.getElementById("login").value;},
        getPass()                   { return document.getElementById("password").value;}
    },
    
    competitionLink:                cLink,
    breadcrumbs: {
        getContainer()              { return document.getElementById("bread-crumbs-container");},
        getTemplate()               { return document.getElementById("bread-crumbs-template");},
        getPlaceholders(dp, cp, ar) { return {
                                            "#depart-link":         dLink,
                                            "#depart-name":         dp.getName(),
                                            "#competition-link":    cLink,
                                            "#competition-name":    cp.getName(),
                                            "#arena-link":          aLink,
                                            "#arena-name":          ar.getName()
                                        };
                                    }
    },
    common: {
        setListName(name)           { document.getElementById("list-name").innerHTML = name;},
        getPairWinnerText()         { return document.getElementById("pair-winner-text").innerHTML;},
        getDeleteBtn()              { return document.getElementById("delete-arena-btn");}, 
        getRefilterBtn()            { return document.getElementById("refilter-pairs-btn");}, 
    },
    pair: {
        selectedStyle:              "lp-select-pair",

        getActiveContainer()        { return document.getElementById("active-pair-container");},
        getActiveTemplate()         { return document.getElementById("active-pair-template");},

        getContainer()              { return document.getElementById("arena-pairs-container");},
        getTemplate()               { return document.getElementById("pair-item-template");},

        getUnattachedContainer()    { return document.getElementById("unattached-pairs-container");},
        getUnattachedTemplate()     { return document.getElementById("unattached-pair-template");},

        getPlaceholders(pair)       { return {
                                            "#pair-group-name": competition.getGroupById(pair.getGroupId()).getName(),
                                            "#pair-num":        pair.getNumber(),
                                            "#pair-round-num":  pair.getRound(),
                                            "#pair-red-sports": getSpName(pair.getRedSp()),
                                            "#pair-blue-sports":getSpName(pair.getBlueSp()),
                                            "#pair-red-score":  pair.getRedScore(),
                                            "#pair-blue-score": pair.getBlueScore(),
                                            "#pair-time":       checkers.getIfDefined(pair.getFormatedTime("hh:min (dd/mm)"), ""),
                                            "#pair-winner":     getSpName(pair.getWinner()),
                                            "#pair-id":         pair.getId(),
                                        };
                                    },
        getDeleteBtn(pair)          { return document.getElementById("delete-pair-" + pair.getId());}, 
        removeFromList(pair)        { document.getElementById("pair-row-" + pair.getId()).remove(); },
        
        getUnattachedItem(pair)     { return document.getElementById("unattached-pair-" + pair.getId()); },
        getAddBtn()                 { return document.getElementById("pairs-add-btn");}, 
    },
    settings: {
        getNameInput()      { return document.getElementById("arena-name-input");},
        getDistanceInput()  { return document.getElementById("distance-filter-input");},
        getAgeMinInput()    { return document.getElementById("age-min-input");},
        getAgeMaxInput()    { return document.getElementById("age-max-input");},
        getWeightMinInput() { return document.getElementById("weight-min-input");},
        getWeightMaxInput() { return document.getElementById("weight-max-input");},
        getFinalMinInput()  { return document.getElementById("final-min-input");},
        getFinalMaxInput()  { return document.getElementById("final-max-input");},
        getQualMinInput()   { return document.getElementById("qualification-min");},
        getQualMaxInput()   { return document.getElementById("qualification-max");},
        getQualTemplate()   { return document.getElementById("qual-item-template");},
        getQualPlaceholders(n, v)   { return { "#qual-name": n, "#qual-value": v }; },
    },
    schedule: {
        getContainer()              { return document.getElementById("schedule-container");},
        getStartIntervalInput()     { return document.getElementById("schedule-interval-start");},
        getEndIntervalInput()       { return document.getElementById("schedule-interval-end");},
        getAddBtn()                 { return document.getElementById("schedule-interval-add-btn");},
        getTemplate()               { return document.getElementById("schedule-interval-template");},
        insertNewInterval(interv)   {   var before = document.getElementById("interval-input-row");
                                        before.parentNode.insertBefore(interv, before);
                                    },
        getPlaceholders(s, e, i)    { return {
                                            "#interval-start-time": s,
                                            "#interval-end-time":   e,
                                            "#row-num":             i
                                        }; 
                                    },
        getDelBtn(rn)               { return document.getElementById("interval-delete-btn-" + rn);},
    },
}