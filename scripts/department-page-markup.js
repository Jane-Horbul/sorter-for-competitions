import {getQualNameByValue} from "./department-page.js"

export const markup = {
    qualifications: {
        getNameInput()                  { return document.getElementById("add-qualification-name").value;},
        getValueInput()                 { return document.getElementById("add-qualification-value").value;},
        getTable()                      { return document.getElementById("qualification-table");},
        getTemplate()                   { return document.getElementById("qualification-template");},
        getDelBtn(item)                 { return item.getElementById("qual-dell-btn");},
        getAddBtn()                     { return document.getElementById("qual-add-btn");},
    
        getPlaceholders(name, value)    { return {
                                                "#qualification-value": value,
                                                "#qualification-name":  name,
                                                };
                                        },
        getAddingRow()                  { return document.getElementById("qualification-add-row");},
        setAddingRowId(row)             { return row.setAttribute("id", "qualification-add-row");},
        getAddingRowOkBtn()             { return document.getElementById("qual-ok-btn");},
        getAddingRowTemplate()          { return document.getElementById("qualification-adding-template");},
    
        nameExistAlert()                {alert("Qualification name already exists!");},
        valueExistAlert()               {alert("Qualification value already exists!");},
        valueFormatAlert()              {alert("Incorrect qualification value! Please, enter the number.");},
    },
    discipline: {
        getDisciplineInput()            { return document.getElementById("add-division").value;},
        getTable()                      { return document.getElementById("divisions-table");},
        getTemplate()                   { return document.getElementById("division-template");},
        getDelBtn(item)                 { return item.getElementById("div-dell-btn");},
        getAddBtn()                     { return document.getElementById("div-add-btn")},
        getPlaceholders(div)            { return {"#division-name": div};},
    
        getAddingRow()                  { return document.getElementById("division-add-field");},
        setAddingRowId(row)             { return row.setAttribute("id", "division-add-field");},
        getAddingRowOkBtn()             { return document.getElementById("div-ok-btn");},
        getAddingRowTemplate()          { return document.getElementById("division-adding-template");},
    },
    competition: {
        getNameInput()                  { return document.getElementById("competition-name-input").value;},
        getDescriptionInput()           { return document.getElementById("competition-desc-input").value;},
        getStartDateInput()             { return document.getElementById("competition-start-date-input").value;},
        getEndDateInput()               { return document.getElementById("competition-end-date-input" ).value;},
    
        getTable()                      { return document.getElementById("competitions-list");},
        getTemplate()                   { return document.getElementById("competition-template");},
        getAddBtn()                     { return document.getElementById("send-competition-form-btn");},
    
        getDateInterval(d1, d2)         { return (0 == d1.localeCompare(d2)) ? d1 : d1 + " - " + d2;},
        getPlaceholders(cp, dp)         { return {
                                                "#departmentId":        dp.getId(),
                                                "#competitionId":       cp.getId(),
                                                "#competition-name":    cp.getName(),
                                                "#competition-date":    this.getDateInterval(cp.getFormatedStartDate("dd.mm.yy"), cp.getFormatedEndDate("dd.mm.yy")),
                                                "#competition-desc":    cp.getDescription()
                                                };
                                        }
    },
    sportsman: {
        getNameInput()                  { return document.getElementById("new-member-name").value;},
        getSurnameInput()               { return document.getElementById("new-member-surname").value;},
        getAgeInput()                   { return document.getElementById("new-member-age").value;},
        getWeightInput()                { return document.getElementById("new-member-weight").value;},
        getSexInput()                   { return document.getElementById("new-member-sex-male").checked ? "male" : "female";},
        getTeamInput()                  { return document.getElementById("new-member-team").value;},
        getQualificationInput()         { return document.getElementById("new-member-qualifications").value;},
        
        getQualList()                   { return document.getElementById("new-member-qualifications");},
        getQualTemplate()               { return document.getElementById("new-member-qual-temp");},
        getQualPlaceholders(n, v)       { return {
                                                "#sports-qual-value":      v,
                                                "#sports-qual-name":       n
                                                };
                                        },
    
        getTable()                      { return document.getElementById("members-table");},
        getTemplate()                   { return document.getElementById("member-template");},
        getAddBtn()                     { return document.getElementById("member-form-send-btn");},
    
        getPlaceholders(sp)             { return {
                                                "#sp-surname":      sp.getSurname(),
                                                "#sp-name":         sp.getName(),
                                                "#sp-age":          sp.getFormatedBirth("dd.mm.yy"),
                                                "#sp-weight":       sp.getWeight(),
                                                "#sp-sex":          sp.getSex(),
                                                "#sp-team":         sp.getTeam(),
                                                "#sp-qual":         getQualNameByValue(sp.getQualification()),
                                                "#sportsman-link":  window.location.href + sp.getLink()
                                            };
                                        },
        nameAlert()                     { alert("Empty member name!"); },
        surnameAlert()                  { alert("Empty member surname!"); },
        weightAlert()                   { alert("Bad weight value. Enter number only."); },
        ageAlert()                      { alert("Bad Date of Birth value. Enter it in format dd.mm.yy"); },
    },
    departament: {
        getNameInput()                  { return document.getElementById("name-info-input");},
        createNameInput()               { var res = document.createElement("input"); res.setAttribute("id", "name-info-input"); return res;},
        getNamePlace()                  { return document.getElementById("department-name-set");},
        getEditBtn()                    { return document.getElementById("department-edit-btn");},
    
        setPageName(name)               {document.getElementById("department-name").innerHTML = name;},
        setName(name)                   {document.getElementById("department-name-set").innerHTML = name;},
        setId(id)                       {document.getElementById("department-id").innerHTML = id;}
    }
};