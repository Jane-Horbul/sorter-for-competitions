import { department, competition, arena} from "./arena.js";
import { helpers, formatDate } from "./common.js";

var aLink = window.location.href;
var cLink = aLink.substring(0, aLink.lastIndexOf("/"));
var dLink = cLink.substring(0, cLink.lastIndexOf("/"));


function getSpName(sid){
    if(helpers.isEmptyString(sid))
        return "";
    var sp = department.getSportsmanById(sid);
    if(undefined != sp)
        return sp.getName() + " " + sp.getSurname();
    var pair = arena.getPairById(sid);
    return markup.common.getPairWinnerText() + " " + (pair == undefined ? sid : pair.getNumber());
}

export const markup = {
    competitionLink:                cLink,
    selectedStyle:                  "lp-select-pair",
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
                                            "#pair-time":       helpers.getIfDefined(pair.getTime("hh:min dd/mm"), ""),
                                            "#pair-winner":     getSpName(pair.getWinner()),
                                            "#pair-id":         pair.getId(),
                                        };
                                    },
        getDeleteBtn(pair)          { return document.getElementById("delete-pair-" + pair.getId());}, 
        removeFromList(pair)        { document.getElementById("pair-row-" + pair.getId()).remove(); },
        
        getUnattachedItem(pair)     { return document.getElementById("unattached-pair-" + pair.getId()); },
        getAddBtn()                 { return document.getElementById("pairs-add-btn");}, 
        setUpdateCallback(cback)    { $("#arena-pairs-container").sortable({ update: function( event, ui ){ cback(); }}); },
        getNumbers()                {
                                        var items = this.getContainer().getElementsByTagName("li");
                                        var res = new Array(0);
                                        for(var i = 0; i < items.length; i++)
                                            res.push(Number(items[i].querySelectorAll(".lp-list-table-td1")[0].innerHTML));
                                        return res;
                                    },                            
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
        insertNewInterval(interv)   {   var header = document.getElementById("intervals-header");
                                        header.after(interv);
                                    },
        getPlaceholders(s, e, i)    { return {
                                            "#interval-start-time": formatDate(s, "hh:min dd SM"),
                                            "#interval-end-time":   formatDate(e, "hh:min dd SM"),
                                            "#row-num":             i
                                        }; 
                                    },
        getDelBtn(rn)               { return document.getElementById("interval-delete-btn-" + rn);},
    },
    groups: {
        getContainer()              { return document.getElementById("groups-container");},
        getTemplate()               { return document.getElementById("group-item-template");},

        getUnattachedContainer()    { return document.getElementById("unattached-grous-container");},
        getUnattachedTemplate()     { return document.getElementById("unattached-group-template");},
        getUnattachedItem(gp)       { return document.getElementById("unattached-group-" + gp.getId()); },
        getPlaceholders(gp)         { return {
                                            "#group-name": gp.getName(),
                                            "#group-id":   gp.getId()
                                        }; 
                                    },
        
        getAttached(gid)            { return document.getElementById(gid); },
        setUpdateCallback(cback)    { $("#groups-container").sortable({ update: function( event, ui ){ cback(); }}); },
        getAddBtn()                 { return document.getElementById("groups-add-btn");},
        getApplyBtn()                 { return document.getElementById("apply-configs-btn");},
        getDelBtn(gp)               { return document.getElementById("group-del-btn-" + gp.getId());},
        getContainerIds()           {
                                        var items = this.getContainer().getElementsByTagName("li");
                                        var res = new Array(0);
                                        for(var i = 0; i < items.length; i++)
                                            res.push(items[i].id);
                                        return res;
                                    },   
    },
}