
export const markup = {
    trainer: {
        setPageName(name)           {document.getElementById("page-name").innerHTML = name;},
        setPageNameLink(link)       {document.getElementById("page-name-link").setAttribute("href", link);},
        setDepartmentName(name)     {document.getElementById("department-link").innerHTML = name;},
        setDepartmentLink(link)     {document.getElementById("department-link").setAttribute("href", link);},
        setTrainerName(name)        {document.getElementById("trainer-link").innerHTML = name;},
        setTrainerLink(link)        {document.getElementById("trainer-link").setAttribute("href", link);},
        setTrainerHeader(name)      {document.getElementById("trainer-header").innerHTML = name;},
        
        getInfoId()                 {return document.getElementById("trainer-info-id");},
        getInfoName()               {return document.getElementById("trainer-info-name");},
        getInfoSurname()            {return document.getElementById("trainer-info-surname");},
        getInfoSex()                {return document.getElementById("trainer-info-sex");},
        getInfoAge()                {return document.getElementById("trainer-info-age");},
        getInfoTeam()               {return document.getElementById("trainer-info-team");},
        getInfoRegion()             {return document.getElementById("trainer-info-region");},
        getInfoEmail()              {return document.getElementById("trainer-info-email");},

        getNameInput()              { return document.getElementById("trainer-input-name");},
        getNameInputTemplate()      { return document.getElementById("trainer-input-name-template").cloneNode(true).content;},
        getSurnameInput()           { return document.getElementById("trainer-input-surname");},
        getSurnameInputTemplate()   { return document.getElementById("trainer-input-surname-template").cloneNode(true).content;},
        getSexInput()               { return document.getElementById("trainer-input-sex");},
        getSexInputTemplate()       { return document.getElementById("trainer-input-sex-template").cloneNode(true).content;},
        getAgeInput()               { return document.getElementById("trainer-input-age");},
        getAgeInputTemplate()       { return document.getElementById("trainer-input-age-template").cloneNode(true).content;},
        getTeamInput()              { return document.getElementById("trainer-input-team");},
        getTeamInputTemplate()      { return document.getElementById("trainer-input-team-template").cloneNode(true).content;},
        getRegionInput()            { return document.getElementById("trainer-input-region");},
        getRegionInputTemplate()    { return document.getElementById("trainer-input-region-template").cloneNode(true).content;},
        
        createOption(name, val) { var res = document.createElement("option");
                                        res.value = val;
                                        res.innerHTML = name;
                                        return res;
                                    },
        setDelBtnLink(link)         {this.getDelBtn().setAttribute("href", link);},
        getDelBtn()                 { return document.getElementById("del-btn-link");},
        getEditBtn()                { return document.getElementById("trainer-edit-btn");},
    }
}