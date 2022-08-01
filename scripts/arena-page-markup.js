import { department, competition, arena} from "./arena-page.js";
import { helpers, formatDate, datetimePickerInit } from "./common.js";

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

function setSortableCallback(id, cback){
    id = "#" + id;
    import("../datetimepicker-master/jquery.js").then(m1 => {
        import("../scripts/sortable-jquery-ui.js").then(m2 => {
            $(id).sortable({ update: function( event, ui ){ cback(); }});
        })
    }).catch(err => {
        console.log(err.message);
    });
}

export const markup = {
    competitionLink:                cLink,
    selectedStyle:                  "lp-select-pair",
    breadcrumbs: {
        setDpLink()                 { document.getElementById("department-link-id").setAttribute("href", dLink); },
        setCompLink()               { document.getElementById("competition-link-id").setAttribute("href", cLink); },
        setCompName(name)           { document.getElementById("competition-name-id").innerHTML = name; },
        setArenaName(name)          { document.getElementById("arena-name-id").innerHTML = name; }
    },
    common: {
        setPageName(name)           { document.getElementById("page-name").innerHTML = name;},
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
        setUpdateCallback(cback)    { setSortableCallback("arena-pairs-container", cback); },
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
        startInputId:   "schedule-interval-start",
        endInputId:     "schedule-interval-end",

        startCalendarInit()         { datetimePickerInit(this.startInputId) },
        endCalendarInit()           { datetimePickerInit(this.endInputId) },
        getStartIntervalInput()     { return document.getElementById(this.startInputId);},
        getEndIntervalInput()       { return document.getElementById(this.endInputId);},
        insertNewInterval(interv)   {   var header = document.getElementById("intervals-header");
                                        header.after(interv);
                                    },

        getContainer()              { return document.getElementById("schedule-container");},
        getTemplate()               { return document.getElementById("schedule-interval-template");},
        getPlaceholders(s, e, i)    { return {
                                            "#interval-start-time": formatDate(s, "hh:min dd SM"),
                                            "#interval-end-time":   formatDate(e, "hh:min dd SM"),
                                            "#row-num":             i
                                        }; 
                                    },
        getAddBtn()                 { return document.getElementById("schedule-interval-add-btn");},
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
        setUpdateCallback(cback)    { setSortableCallback("groups-container", cback);},
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