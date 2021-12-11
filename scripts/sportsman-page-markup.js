import {checkers, createPageItem} from "./common.js"

const medals = {
    "1": "./img/gold-m-2.png",
    "2": "./img/silver-m.png",
    "3": "./img/copper-m.png"
}

export const markup = {
    login:          {
        getLoginBtn()               { return document.getElementById("login-btn");},
        getLogin()                  { return document.getElementById("login").value;},
        getPass()                   { return document.getElementById("password").value;}
    },

    statistics: {
        competitionsListId:         "tabcontent2",
        competitionStatTemplate:    "competition-item-template-id",
        getAdmitionId(cs)                   { return "comp-admition-" + cs.getCompetitionId(); },
        getAdmitionObj(cs)                  { return document.getElementById(this.getAdmitionId(cs)); },
        setAdmition(cs)                     { this.getAdmitionObj(cs).checked = cs.isAdmitted(); },
        getCompStatsList()                  { return document.getElementById(this.competitionsListId); },
        createCompStatisticItem(cs, spId)   { return createPageItem(document.getElementById(this.competitionStatTemplate), this.getCompStatPlaceholders(cs, spId)); },
        getCompStatPlaceholders(cs, spId)   { return {
                "#competiton-link":     cs.getCompetitionLink(),
                "#competition-name":    cs.getCompetitionName(),
                "#groups-num":          "" + cs.getGroupsStats().length,
                "#pairs-num":           "" + cs.getPairs().length,
                "#wins-num":            "" + cs.getPairs().filter(pair => pair.getWinner().localeCompare(spId) == 0).length,
                "#score":               "" + 0,
                "#groups-list-id":      this.getGroupsListId(cs),
                "#disc-list-id":        this.getDiscListId(cs),
                "#admition-id":         this.getAdmitionId(cs)
            };
        },
    
        disciplinesListId:          "competition-disciplines-list-",
        disciplineStatTemplate:     "discipline-item-template-id",
        getDiscListId(cs)           { return this.disciplinesListId + cs.getCompetitionId(); },
        getDisciplineId(cs, d)      { return d + "-" + cs.getCompetitionId(); },
        getDisciplineObj(cs, d)     { return document.getElementById(this.getDisciplineId(cs, d)); },
        setDiscipline(cs, d)        { this.getDisciplineObj(cs, d).checked = true;},
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
                "#place-image":         medals[gs.getPlace()] == undefined ? "" : medals[gs.getPlace()],
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
                "#pair-number":     checkers.getIfDefined(pair.getNumber(), ""),
                "#pairs-list":      checkers.getIfDefined(pair.getPairsList(), ""),
                "#pair-time":       "00:00 (20.10)",
                "#pair-result":     "Lose",
                "#pair-style":      "sp-st-group-card-table--red"
            };
        },
    },

    sportsman: {
        setPageName(name)           {document.getElementById("page-name").innerHTML = name;},
        setPageNameLink(link)       {document.getElementById("page-name-link").setAttribute("href", link);},
        setDepartmentName(name)     {document.getElementById("department-link").innerHTML = name;},
        setDepartmentLink(link)     {document.getElementById("department-link").setAttribute("href", link);},
        setSportsmanName(name)      {document.getElementById("sportsman-link").innerHTML = name;},
        setSportsmanLink(link)      {document.getElementById("sportsman-link").setAttribute("href", link);},
        setSportsmanHeader(name)    {document.getElementById("sportsman-header").innerHTML = name;},
        setPhoto(link)              {if(link != undefined) document.getElementById("sportsman-photo-img").setAttribute("src", link);},

        getInfoId()                 {return document.getElementById("sportsman-info-id");},
        getInfoName()               {return document.getElementById("sportsman-info-name");},
        getInfoSurname()            {return document.getElementById("sportsman-info-surname");},
        getInfoSex()                {return document.getElementById("sportsman-info-sex");},
        getInfoAge()                {return document.getElementById("sportsman-info-age");},
        getInfoWeight()             {return document.getElementById("sportsman-info-weight");},
        getInfoQual()               {return document.getElementById("sportsman-info-qual");},
        getInfoTrainer()            {return document.getElementById("sportsman-info-trainer");},
        getInfoTeam()               {return document.getElementById("sportsman-info-team");},
        getInfoRegion()             {return document.getElementById("sportsman-info-region");},
        getPhotoForm()              {return new FormData(document.forms.namedItem("fileinfo"));},
        
        getNameInput()              { return document.getElementById("sports-input-name");},
        getNameInputTemplate()      { return document.getElementById("sports-input-name-template").cloneNode(true).content;},
        getSurnameInput()           { return document.getElementById("sports-input-surname");},
        getSurnameInputTemplate()   { return document.getElementById("sports-input-surname-template").cloneNode(true).content;},
        getSexInput()               { return document.getElementById("sports-input-sex");},
        getSexInputTemplate()       { return document.getElementById("sports-input-sex-template").cloneNode(true).content;},
        getAgeInput()               { return document.getElementById("sports-input-age");},
        getAgeInputTemplate()       { return document.getElementById("sports-input-age-template").cloneNode(true).content;},
        getWeightInput()            { return document.getElementById("sports-input-weight");},
        getWeightInputTemplate()    { return document.getElementById("sports-input-weight-template").cloneNode(true).content;},
        getQualInput()              { return document.getElementById("sports-input-qulification");},
        getQualInputTemplate()      { return document.getElementById("sports-input-qulification-template").cloneNode(true).content;},
        getTrainerInput()           { return document.getElementById("sports-input-trainer");},
        getTrainerInputTemplate()   { return document.getElementById("sports-input-trainer-template").cloneNode(true).content;},
    
        createOption(name, val) { var res = document.createElement("option");
                                        res.value = val;
                                        res.innerHTML = name;
                                        return res;
                                    },
    
        delBtnId:           "del-btn-link",
        editBtnId:          "sportsman-edit-btn",
    
        setDelBtnLink(link)         {this.getDelBtn().setAttribute("href", link);},
        getDelBtn()                 { return document.getElementById(this.delBtnId);},
        getEditBtn()                { return document.getElementById(this.editBtnId);},
        getChangePhotoBtn()         { return document.getElementById("change-photo-btn");}
    }
}