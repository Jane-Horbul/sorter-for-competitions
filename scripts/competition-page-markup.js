import {getQualificationInterval, getQualNameByValue} from "./competition-page.js"

export const markup = {
    sportsmen: {
        getTable()                  { return document.getElementById("members-table");},
        getTemplate()               { return document.getElementById("member-template");},

        getAddingTable()            { return document.getElementById("add-sportsman-table");},
        getAddingTemplate()         { return document.getElementById("add-sportsman-template");},
        getAddSportsRowId(id)       { return "add-sports-" + id},

        getAddingRow(id)            { return document.getElementById("adding-row-sportsman-" + id);},
        setAddingRowId(row, id)     { row.setAttribute("id", "adding-row-sportsman-" + id);},
        getAddingRowTemplate()      { return document.getElementById("add-settings-template");},
        getSportsAdmition(row, sid) { return row.querySelector('#admitted-' + sid).checked ? "true" : "false";},
        isCheckedDisc(row, sid, num){ return row.querySelector("#discipline-" + sid + "-" + num).checked;},

        getPlaceholders(sp, dpLink) { return {
                                            "#sp-id":           sp.getId(),
                                            "#sp-surname":      sp.getSurname(),
                                            "#sp-name":         sp.getName(),
                                            "#sp-age":          sp.getAge(),
                                            "#sp-weight":       sp.getWeight(),
                                            "#sp-sex":          sp.getSex(),
                                            "#sp-team":         sp.getTeam(),
                                            "#sp-qual":         getQualNameByValue(sp.getQualification()),
                                            "#sp-admit":        sp.getAdmition(),
                                            "#sp-gr-num":       sp.getGroupsNum(),
                                            "#sportsman-link":  dpLink + sp.getLink(),
                                            "#disc-list-id":    "sports-disc-list-" + sp.getId(),
                                            "#admitted-id":     "admitted-" + sp.getId()
                                        };
                                    },
        getDisciplinesList(spId)            {return document.getElementById("sports-disc-list-" + spId);},
        getDisciplineTemplate()             {return document.getElementById("add-discipline-template");},
        getDiscPlaceholders(n, id, spId)    {return {   "#disc-name":   n, 
                                                        "#disc-id":     ("discipline-" + spId + "-" + id)};
                                                },
        
        getAddBtn()                 { return document.getElementById("sportsmans-add-list-send-btn");},
        getSortSpBtn()              { return document.getElementById("sort-members-btn");}
    },

    groups: {
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
        
        getTable()                  { return document.getElementById("groups-table");},
        getTemplate()               { return document.getElementById("group-template");},
        getAddBtn()                 { return document.getElementById("group-form-send-btn");},
        getFormPairsBtn()           { return document.getElementById("form-pairs-btn");},
        getPlaceholders(gr)         { return {
                                            "#group-name":          gr.getName(),
                                            "#group-age":           gr.getAgeMin() + " - " + gr.getAgeMax(),
                                            "#group-weight":        gr.getWeightMin() + " - " + gr.getWeightMax(),
                                            "#group-qualification": getQualificationInterval(gr.getQualMin(), gr.getQualMax()),
                                            "#group-sex":           gr.getSex(),
                                            "#group-discipline":    gr.getDiscipline(),
                                            "#group-sp-num":        gr.getSportsNum(),
                                            "#group-link":          window.location.href.split("#")[0] + gr.getLink()
                                        };
                                    },

        getDisciplinesList()        {return document.getElementById("group-input-discipline");},
        getDisciplineTemplate()     {return document.getElementById("create-group-div-temp");},
        getDiscPlaceholders(name)   {return {
                                                "#group-disc-value": name,
                                                "#group-disc-name": name
                                            };
                                    },

        getQualMinList()            {return document.getElementById("group-input-qulification-min");},
        getQualMaxList()            {return document.getElementById("group-input-qulification-max");},
        createOption(id, name, val) { var res = document.createElement("option");
                                        res.setAttribute("id", id);
                                        res.value = val;
                                        res.innerHTML = name;
                                        return res;
                                    },
        getQualPlaceholders(v, n)   {return {  
                                                "#qual-value-ph": v,
                                                "#qual-name-ph": n
                                            };
                                    },

        alertNameFormat()           {alert("Empty group name!");},
        alertAgeMinFormat()         {alert("Bad minimal age!");},
        alertAgeMaxFormat()         {alert("Bad maximal age!");},
        alertAgeIntervalFormat()    {alert("Maximal age must be greater than minimal!");},
        alertWeightMinFormat()      {alert("Bad minimal weight!");},
        alertWeightMaxFormat()      {alert("Bad maximal weight!");},
        alertWeightIntervalFormat() {alert("Maximal weight must be greater than minimal!");},
        alertQualificationFormat()  {alert("Undefined qualifications value!");},
        alertQualificationInterval() {alert("Maximal value must greater than minimal!");}
    },

    competitions: {
        nameInputId:        "name-info-input",
        descInputId:        "desc-info-input",
        startDateInputId:   "start-date-input",
        endDateInputId:     "end-date-input",
    
        namePlaceId:        "competition-name-info",
        descPlaceId:        "competition-desc-info",
        startDatePlaceId:   "competition-start-date-info",
        endDatePlaceId:     "competition-end-date-info",
    
        depLinkId:          "department-link-id",
        compLinkId:         "competition-link-id",
        createInput(id)         { var res = document.createElement("input"); res.setAttribute("id", id); return res;},
    
        getNameInput()          { return document.getElementById(this.nameInputId);},
        getDescInput()          { return document.getElementById(this.descInputId);},
        getStartDateInput()     { return document.getElementById(this.startDateInputId);},
        getEndDateInput()       { return document.getElementById(this.endDateInputId);},
        
        createNameInput()       { return this.createInput(this.nameInputId);},
        createDescInput()       {   var res = document.createElement("textarea"); 
                                    res.setAttribute("id", this.descInputId); 
                                    res.setAttribute("rows", "3"); 
                                    return res;
                                },
        createDateInput(id)     {
                                    var res = document.createElement("input"); 
                                    res.setAttribute("id",      id); 
                                    res.setAttribute("type",    "datetime-local");
                                    res.setAttribute("class",   "create-ng--interval-min sportsman-info-item--input");
                                    res.setAttribute("pattern", "[0-9]+");
                                    res.setAttribute("required","required");
                                    return res;
                                },
    
        getNamePlace()          { return document.getElementById(this.namePlaceId);},
        getDescPlace()          { return document.getElementById(this.descPlaceId);},
        getStartDatePlace()     {return document.getElementById(this.startDatePlaceId);},
        getEndDatePlace()       {return document.getElementById(this.endDatePlaceId);},
        
        setName(name)           {document.getElementById(this.namePlaceId).innerHTML = name;},
        setDescription(desc)    {document.getElementById(this.descPlaceId).innerHTML = desc;},
        setStartDate(val)       {document.getElementById(this.startDatePlaceId).innerHTML = val;},
        setEndDate(val)         {document.getElementById(this.endDatePlaceId).innerHTML = val;},
        setPageName(name)       {document.getElementById("competition-name").innerHTML = name;},
        setId(id)               {document.getElementById("competition-id-info").innerHTML = id;},
        setDepartmentName(name) {document.getElementById(this.depLinkId).innerHTML = name;},
        setDepartmentLink(link) {document.getElementById(this.depLinkId).setAttribute("href", link);},
        setCompetitionName(name){document.getElementById(this.compLinkId).innerHTML = name;},
        setCompetitionLink(link){document.getElementById(this.compLinkId).setAttribute("href", link);},
    
    
        getEditBtn()            { return document.getElementById("competition-edit-btn");}
    }    
}