
export const markup = {
    common: {
        setPageHeader(name)             {document.getElementById("page-header-name").innerHTML = name;},
        setPageHeaderLink(link)         {document.getElementById("page-header-name-link").setAttribute("href", link);},
        setDepartmentLink(name, link)   {var d = document.getElementById("department-link"); d.setAttribute("href", link); d.innerHTML = name;},
        setCompetitionLink(name, link)  {var c = document.getElementById("competition-link"); c.setAttribute("href", link); c.innerHTML = name;},
        getArenaName()                  {return document.getElementById("arena-name-input").value;}
    },
    automation: {
        getActiveGroupsList()           { return document.getElementById("active-groups-list");},
        getActiveGroupTemplate()        { return document.getElementById("active-group-template");},
        getUnactiveGroupsList()         { return document.getElementById("unactive-groups-list");},
        getUnactiveGroupTemplate()      { return document.getElementById("unactive-group-template");},
        getGroupPlaceholders(gr)        { return {
                                                "#group-name":          gr.getName(),
                                                "#group-id":            gr.getId(),
                                            };
                                        },
        getActiveGroup(gr)              { return document.getElementById("active-group-id-" + gr.getId()); },
        getUnactiveGroup(gr)            { return document.getElementById("unactive-group-id-" + gr.getId()); },
        getAddAllGroupsBtn()            { return document.getElementById("add-all-groups-btn"); },
        getDelAllGroupsBtn()            { return document.getElementById("delete-all-groups-btn"); },

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