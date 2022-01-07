import {getQualNameByValue} from "./trainer-page.js"

export const markup = {
    login:          {
        getLoginBtn()               { return document.getElementById("login-btn");},
        getLogin()                  { return document.getElementById("login").value;},
        getPass()                   { return document.getElementById("password").value;}
    },
    trainer: {
        setPageName(name)           {document.getElementById("page-name").innerHTML = name;},
        setPageNameLink(link)       {document.getElementById("page-name-link").setAttribute("href", link);},
        setDepartmentName(name)     {document.getElementById("department-link").innerHTML = name;},
        setDepartmentLink(link)     {document.getElementById("department-link").setAttribute("href", link);},
        setTrainerName(name)        {document.getElementById("trainer-link").innerHTML = name;},
        setTrainerLink(link)        {document.getElementById("trainer-link").setAttribute("href", link);},
        setTrainerHeader(name)      {document.getElementById("trainer-header").innerHTML = name;},
        setPhoto(link)              {if(link != undefined) document.getElementById("trainer-photo-img").setAttribute("src", link);},

        getInfoId()                 {return document.getElementById("trainer-info-id");},
        getInfoName()               {return document.getElementById("trainer-info-name");},
        getInfoSurname()            {return document.getElementById("trainer-info-surname");},
        getInfoSex()                {return document.getElementById("trainer-info-sex");},
        getInfoAge()                {return document.getElementById("trainer-info-age");},
        getInfoTeam()               {return document.getElementById("trainer-info-team");},
        getInfoRegion()             {return document.getElementById("trainer-info-region");},
        getInfoEmail()              {return document.getElementById("trainer-info-email");},
        getPhotoForm()              {return new FormData(document.forms.namedItem("fileinfo"));},

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

        getNewEmail()               { return document.getElementById("new-login").value;},
        getLoginConfirmPassword()   { return document.getElementById("login-confirm-password").value;},
        getChangeEmailBtn()         { return document.getElementById("change-email-btn");},

        getOldPassword()            { return document.getElementById("old-password").value;},
        getNewPassword()            { return document.getElementById("new-password").value;},
        getNewPasswordConfirm()     { return document.getElementById("new-password-again").value;},
        getChangePassBtn()          { return document.getElementById("change-pass-btn");},
        getChangePhotoBtn()         { return document.getElementById("change-photo-btn");}
    },
    sportsman:{
        getNameInput()                  { return document.getElementById("new-sportsman-name").value;},
        getSurnameInput()               { return document.getElementById("new-sportsman-surname").value;},
        getAgeInput()                   { return document.getElementById("new-sportsman-age").value;},
        getWeightInput()                { return document.getElementById("new-sportsman-weight").value;},
        getSexInput()                   { return document.getElementById("new-sportsman-sex-male").checked ? "male" : "female";},
        getTrainerInput()               { return document.getElementById("new-sportsman-trainer").value;},
        getQualificationInput()         { return document.getElementById("new-sportsman-qualifications").value;},
        getOneMoreInput()               { return document.getElementById("add-one-more-sp").value;},

        getTrainersList()               { return document.getElementById("new-sportsman-trainer");},
        getTrainerTemplate()            { return document.getElementById("new-sportsman-trainer-temp");},
        getTrainerPlaceholders(tr)      { return {
                                                "#sports-trainer-id":      tr.getId(),
                                                "#sports-trainer-name":    tr.getSurname() + " " + tr.getName()
                                                };
                                        },

        getQualList()                   { return document.getElementById("new-sportsman-qualifications");},
        getQualTemplate()               { return document.getElementById("new-sportsman-qual-temp");},
        getQualPlaceholders(n, v)       { return {
                                                "#sports-qual-value":      v,
                                                "#sports-qual-name":       n
                                                };
                                        },
    
        getTable()                      { return document.getElementById("sportsmen-table");},
        getTemplate()                   { return document.getElementById("sportsman-template");},
        getAddBtn()                     { return document.getElementById("sportsman-form-send-btn");},
    
        getPlaceholders(sp)             { return {
                                                "#sp-surname":      sp.getSurname(),
                                                "#sp-name":         sp.getName(),
                                                "#sp-age":          sp.getFormatedBirth("dd.mm.yy"),
                                                "#sp-weight":       sp.getWeight(),
                                                "#sp-sex":          sp.getSex(),
                                                "#sp-team":         sp.getTeam(),
                                                "#sp-qual":         getQualNameByValue(sp.getQualification()),
                                                "#sportsman-link":  window.location.href.split("/")[0] + sp.getLink()
                                            };
                                        },
    }
}