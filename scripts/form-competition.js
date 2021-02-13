function createDivRow(division){
    var template = document.getElementById("div-row-template").content.cloneNode(true);
    template.getElementById("div-name").innerHTML = division;
    template.getElementById("div-dell-btn").addEventListener("click", function(){deleteDivision(division)}, false);
    return template;
}

function addDivision() {
    var el = document.getElementById("division-name");
    var table = document.getElementById("divisions-table");
    if(el.value.localeCompare("") == 0) return;
    for(var i = 2; i < table.rows.length; i++) {
        if(table.rows[i].cells[0].innerHTML.localeCompare(el.value) == 0) return;
    }
    table.append(createDivRow(el.value));
    el.value= "";
}

function deleteDivision(division){
    var table = document.getElementById("divisions-table");
    for(var i = 2; i < table.rows.length; i++) {
        if(table.rows[i].cells[0].innerHTML.localeCompare(division) == 0){
            table.deleteRow(i);
            return;
        }
    }
}

function createQualRow(value, name){
    var template = document.getElementById("qual-row-template").content.cloneNode(true);
    template.getElementById("qual-name").innerHTML = name;
    template.getElementById("qual-value").innerHTML = value;
    template.getElementById("qual-dell-btn").addEventListener("click", function(){deleteQualification(value)}, false);
    return template;
}

function addQualification() {
    var qValue = document.getElementById("qualification-value");
    var qName = document.getElementById("qualification-name");
    var table = document.getElementById("qualifications-table");

    if(isNaN(Number(qValue.value)) || (qName.value.localeCompare("") == 0)) return;
    for(var i = 2; i < table.rows.length; i++) {
        if(Number(table.rows[i].cells[0].innerHTML) == Number(qValue.value)) return;
        if(table.rows[i].cells[1].innerHTML.localeCompare(qName.value) == 0) return;
    }
    table.append(createQualRow(qValue.value, qName.value));
    qValue.value = "";
    qName.value = "";
}

function deleteQualification(qValue){
    var table = document.getElementById("qualifications-table");
    for(var i = 3; i < table.rows.length; i++) {
        if(table.rows[i].cells[0].innerHTML.localeCompare(qValue) == 0){
            table.deleteRow(i);
            return;
        }
    }
}

function sendForm() {
    var compName = document.getElementById("competition-name");
    var compDescription = document.getElementById("description");
    var divisionsTable = document.getElementById("divisions-table");
    var divisionsStr = "";
    var qualificationsTable = document.getElementById("qualifications-table");
    var qualificationsStr = "";
    var boundary = String(Math.random()).slice(2);
    var body = ['\r\n'];

    body.push('Content-Disposition: form-data; name="competition-name"\r\n\r\n' + compName.value + '\r\n');
    body.push('Content-Disposition: form-data; name="description"\r\n\r\n' + compDescription.value + '\r\n');

    for(var i = 2; i < divisionsTable.rows.length; i++) {
        divisionsStr += divisionsTable.rows[i].cells[0].innerHTML + ", ";
    }
    body.push('Content-Disposition: form-data; name="divisions"\r\n\r\n' + divisionsStr + '\r\n');

    for(var i = 3; i < qualificationsTable.rows.length; i++) {
        qualificationsStr += qualificationsTable.rows[i].cells[0].innerHTML + " - " + qualificationsTable.rows[i].cells[1].innerHTML + ", ";
    }
    body.push('Content-Disposition: form-data; name="qualifications"\r\n\r\n' + qualificationsStr + '\r\n');

    
    body = body.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/competition-form', true);
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        alert( this.responseText );
    }
    xhr.send(body);
}

function setBtnActions(){
    document.getElementById("qualification-value").addEventListener("keydown", function(event){
        if (event.defaultPrevented) return;
        if ("Enter" == event.key){
            addQualification();
            event.preventDefault();
        } 
      }, true);

    document.getElementById("qualification-name").addEventListener("keydown", function(event){
        if (event.defaultPrevented) return;
        if ("Enter" == event.key){
            addQualification();
            event.preventDefault();
        } 
      }, true);

      document.getElementById("division-name").addEventListener("keydown", function(event){
        if (event.defaultPrevented) return;
        if ("Enter" == event.key){
            addDivision();
            event.preventDefault();
        } 
      }, true);
    
    document.getElementById("add-qual-btn").addEventListener("click", addQualification, false);
    document.getElementById("add-div-btn").addEventListener("click", addDivision, false);
    document.getElementById("send-form-btn").addEventListener("click", sendForm, false);
}

setBtnActions();