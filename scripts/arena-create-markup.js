
export const markup = {
    common: {
        setPageHeader(name)             {document.getElementById("page-name").innerHTML = name;},
        setPageHeaderLink(link)         {document.getElementById("page-header-name-link").setAttribute("href", link);},
        setDepartmentLink(name, link)   {var d = document.getElementById("department-link-id"); d.setAttribute("href", link); d.innerHTML = name;},
        setCompetitionLink(name, link)  {var c = document.getElementById("competition-link-id"); c.setAttribute("href", link); c.innerHTML = name;},
        getArenaName()                  {return document.getElementById("arena-name-input").value;}
    },
    automation: {
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
        groups: {
            getActiveList()             { return document.getElementById("active-groups-list");},
            getActiveTemplate()         { return document.getElementById("active-group-template");},
            getActive(gr)               { return document.getElementById("active-group-id-" + gr.getId()); },

            getUnactiveList()           { return document.getElementById("unactive-groups-list");},
            getUnactiveTemplate()       { return document.getElementById("unactive-group-template");},
            getUnactive(gr)             { return document.getElementById("unactive-group-id-" + gr.getId()); },

            getPlaceholders(gr)         { return {
                                                "#group-name":          gr.getName(),
                                                "#group-id":            gr.getId(),
                                            };
                                        },
            getAddAllBtn()              { return document.getElementById("add-all-groups-btn"); },
            getDelAllBtn()              { return document.getElementById("delete-all-groups-btn"); }
        },
        qualifications: {
            getMinList()                { return document.getElementById("qualification-min");},
            getMaxList()                { return document.getElementById("qualification-max");},
            getTemplate()               { return document.getElementById("qual-item-template");},
            getPlaceholders(name, val)  { return {
                                                "#qual-name":         name,
                                                "#qual-value":         val,
                                            };
                                        },
        },

        getDistanceValue()              { return document.getElementById("cpl-auto-sort-criteria--dist").value;},
        getAgeMinValue()                { return document.getElementById("age-min-input").value;},
        getAgeMaxValue()                { return document.getElementById("age-max-input").value;},
        getWeightMinValue()             { return document.getElementById("weight-min-input").value;},
        getWeightMaxValue()             { return document.getElementById("weight-max-input").value;},
        getFinalMinValue()              { return document.getElementById("final-min-input").value;},
        getFinalMaxValue()              { return document.getElementById("final-max-input").value;},

        getApplyBtn()                   { return document.getElementById("automatic-apply-btn" );}
    },
    manual: {
        getDetachedPairsList()          { return document.getElementById("unactive-pairs-list"); },
        getDetachedPairTemplate()       { return document.getElementById("unactive-pair-template"); },
        getDetachedPair(pair)           { return document.getElementById("detached-pair-id-" + pair.getId()); },

        getAttachedPairsList()          { return document.getElementById("active-pairs-list"); },
        getAttachedPairTemplate()       { return document.getElementById("attached-pair-template"); },
        getAttachedPair(pair)           { return document.getElementById("attached-pair-id-" + pair.getId()); },

        getPairPlaceholders(pair)       { return {
                                                "#pair-id": pair.getId(),
                                            };
                                        },

        getAttachAllPairsBtn()          { return document.getElementById("add-all-pairs-btn"); },
        getDetachAllPairsBtn()          { return document.getElementById("delete-all-pairs-btn"); },
        getApplyBtn()                   { return document.getElementById("manual-apply-btn" );}
    }
}