import {getIfDefined, createPageItem} from "./common.js"

function getPlaceImage(pl){
    if(pl == "1")
        return "./img/gold-m-2.png";
    else if(pl == "2")
        return "./img/silver-m.png";
    else if(pl == "3")
        return "./img/cooper-m.png";
    return "";
    
}

export const markup = {
    statistics: {
        competitionsListId:         "tabcontent2",
        competitionStatTemplate:    "competition-item-template-id",
        getAdmitionId(cs)           { return "comp-admition-" + cs.getCompetitionId(); },
        setAdmition(cs)             { document.getElementById(this.getAdmitionId(cs)).checked = cs.isAdmitted(); },
        getCompStatsList()              { return document.getElementById(this.competitionsListId); },
        createCompStatisticItem(cs)     { return createPageItem(document.getElementById(this.competitionStatTemplate), this.getCompStatPlaceholders(cs)); },
        getCompStatPlaceholders(cs)     { return {
                "#competition-name":    cs.getCompetitionName(),
                "#groups-list-id":      this.getGroupsListId(cs),
                "#disc-list-id":        this.getDiscListId(cs),
                "#admition-id":         this.getAdmitionId(cs)
            };
        },
    
        disciplinesListId:          "competition-disciplines-list-",
        disciplineStatTemplate:     "discipline-item-template-id",
        getDiscListId(cs)           { return this.disciplinesListId + cs.getCompetitionId(); },
        getDisciplineId(cs, d)      { return d + "-" + cs.getCompetitionId(); },
        setDiscipline(cs, d)        { document.getElementById(this.getDisciplineId(cs, d)).checked = true;},
        getDisciplinesList(cs)          { return document.getElementById(this.getDiscListId(cs)); },
        createDisciplineItem(cs, d)     { return createPageItem(document.getElementById(this.disciplineStatTemplate), this.getDisciplinePlaceholders(cs, d)); },
        getDisciplinePlaceholders(cs, d){ return {
                "#disc-name":           d,
                "#disc-id":             this.getDisciplineId(cs, d),
            };
        },
        
        groupsListId:               "comptition-groups-list-",
        groupStatTemplate:          "group-item-template-id",
        getGroupsListId(cs)         { return this.groupsListId + cs.getCompetitionId(); },
        getGroupStatsList(cs)           { return document.getElementById(this.getGroupsListId(cs)); },
        createGroupStatItem(cs, gs)     { return createPageItem(document.getElementById(this.groupStatTemplate), this.getGroupStatPlaceholders(cs, gs)); },
        getGroupStatPlaceholders(cs, gs){ return { 
                "#group-name":          gs.getGroupName(),
                "#group-link":          gs.getGroupLink(),
                "#place-image":         getPlaceImage(gs.getPlace()),
                "#pairs-num":           gs.getPairsNum(),
                "#wins-num":            gs.getWinsNum(),
                "#score":               gs.getScore(),
                "#discipline":          gs.getDiscipline(),
                "#place-num":           (gs.getPlace() == "-1") ? "" : gs.getPlace(),
                "#pairs-list-id":        this.getPairsListId(cs, gs)
            };
        },
    
        pairsListId:                "group-pairs-list-",
        pairStatTemplate:           "pair-item-template-id",
        getPairsListId(cs, gs)      { return this.pairsListId + cs.getCompetitionId() + "-" + gs.getGroupId(); },
        getPairsList(cs, gs)        { return document.getElementById(this.getPairsListId(cs, gs)); },
        createPairsItem(pair)       { return createPageItem(document.getElementById(this.pairStatTemplate), this.getPairPlaceholders(pair)); },
        getPairPlaceholders(pair)   { return {
                "#pair-number":     getIfDefined(pair.getNumber(), ""),
                "#pairs-list":      getIfDefined(pair.getPairsList(), ""),
                "#pair-time":       "00:00 (20.10)",
                "#pair-result":     "Lose",
                "#pair-style":      "sp-st-group-card-table--red"
            };
        },
    },

    sportsman: {
        pageNameId:         "page-name",
        pageNameLinkId:     "page-name-link",
        depLinkId:          "department-link",
        sportsLinkId:       "sportsman-link",
        sportsHeaderId:     "sportsman-header",
    
        setPageName(name)           {document.getElementById(this.pageNameId).innerHTML = name;},
        setPageNameLink(link)       {document.getElementById(this.pageNameLinkId).setAttribute("href", link);},
        setDepartmentName(name)     {document.getElementById(this.depLinkId).innerHTML = name;},
        setDepartmentLink(link)     {document.getElementById(this.depLinkId).setAttribute("href", link);},
        setSportsmanName(name)      {document.getElementById(this.sportsLinkId).innerHTML = name;},
        setSportsmanLink(link)      {document.getElementById(this.sportsLinkId).setAttribute("href", link);},
        setSportsmanHeader(name)    {document.getElementById(this.sportsHeaderId).innerHTML = name;},
    
        infoIdId:           "sportsman-info-id",
        infoNameId:         "sportsman-info-name",
        infoSurnameId:      "sportsman-info-surname",
        infoSexId:          "sportsman-info-sex",
        infoAgeId:          "sportsman-info-age",
        infoWeightId:       "sportsman-info-weight",
        infoQualId:         "sportsman-info-qual",
        infoTeamId:         "sportsman-info-team",
    
        setInfoId(val)              {document.getElementById(this.infoIdId).innerHTML = val;},
        setInfoName(val)            {document.getElementById(this.infoNameId).innerHTML = val;},
        setInfoSurname(val)         {document.getElementById(this.infoSurnameId).innerHTML = val;},
        setInfoSex(val)             {document.getElementById(this.infoSexId).innerHTML = val;},
        setInfoAge(val)             {document.getElementById(this.infoAgeId).innerHTML = val;},
        setInfoWeight(val)          {document.getElementById(this.infoWeightId).innerHTML = val;},
        setInfoQual(val)            {document.getElementById(this.infoQualId).innerHTML = val;},
        setInfoTeam(val)            {document.getElementById(this.infoTeamId).innerHTML = val;},
    
        inputNameId:         "sports-input-name",
        inputSurnameId:      "sports-input-surname",
        inputSexId:          "sports-input-sex",
        inputAgeId:          "sports-input-age",
        inputWeightId:       "sports-input-weight",
        inputQualId:         "sports-input-qulification",
        inputTeamId:         "sports-input-team",
    
        getNameInput()          { return document.getElementById(this.inputNameId);},
        getSurnameInput()       { return document.getElementById(this.inputSurnameId);},
        getSexInput()           { return document.getElementById(this.inputSexId);},
        getAgeInput()           { return document.getElementById(this.inputAgeId);},
        getWeightInput()        { return document.getElementById(this.inputWeightId);},
        getQualInput()          { return document.getElementById(this.inputQualId);},
        getTeamInput()          { return document.getElementById(this.inputTeamId);},
    
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
    
        setDelBtnLink(link)         {this.getDelBtn().setAttribute("href", link);},
        getDelBtn()                 { return document.getElementById(this.delBtnId);},
        getEditBtn()                { return document.getElementById(this.editBtnId);},
    }
}