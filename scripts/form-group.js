import {sendRequest} from "./common.js"

function fillDivisions(divisions){
    var divisionsList = document.getElementById("ng-division");
    divisions.forEach(div => {
        if(div == "\r\n") return;
        var opt = document.createElement('option');
        opt.value = div;
        opt.innerHTML = div;
        divisionsList.appendChild(opt);
    });
}

function fillQualifications(qualifications){
    var qualsListMin = document.getElementById("ng-members-qualification-min");
    var qualsListMax = document.getElementById("ng-members-qualification-max");
    qualifications.forEach(function(value, key) {
        var opt = document.createElement('option');
        opt.value = value;
        opt.innerHTML = value;
        qualsListMin.appendChild(opt.cloneNode(true));
        qualsListMax.appendChild(opt);
    });
}

var params = sendRequest("/group-params-get?" + "id=" + location.search.split("/")[0].split("?")[1]);

fillDivisions(params.get("Divisions"));
fillQualifications(params.get("Qualifications"));