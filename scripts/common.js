import {server, ops} from "./communication.js"


function cutPairId(id){
    var indx = id.indexOf("G")
    if(indx >= 0)
        return id.substring(indx)
    return id;
}

export const commonStrings = {
    arrDivider: ", ",
    mapDivider: " - ",
    pairWinner(id)  {return "Winner of pair " + cutPairId(id);}  
}

const errors = {
    emptyField(field)     { errorMessage("Empty field '" + field + "'"); },
    badNumber(field)      { errorMessage("Bad number in field '" + field + "'"); },
    badDate(dt)           { errorMessage("Bad date input " + dt); }
    
}

function getClientLink(cl){
    var res = window.location.href.split("/")[0];
    if(cl.isRoot()){
        return "";
    } else if(cl.isAdmin()){
        return res + "/admin?nid=" + cl.getId();;
    } else if(cl.isJudge()){
        return res + "/judge?jid=" + cl.getId();;
    } else if(cl.isTrainer()){
        return res + "/trainer?tid=" + cl.getId();
    }
    return "";
}

const markup = {
    registration: {
        getName()                   { return document.getElementById("reg-member-name").value;},
        getSurname()                { return document.getElementById("reg-member-surname").value;},
        getBirthDate()              { return document.getElementById("reg-member-age").value;},
        initBirthDate()             { datePickerInit("reg-member-age"); },
        getSex()                    { return document.getElementById("reg-member-sex-male").checked ? 
                                        document.getElementById("reg-member-sex-male").value : document.getElementById("reg-member-sex-female").value; },
        getRegion()                 { return document.getElementById("reg-member-region").value; },                                
        getStatus()                 { return document.getElementById("reg-member-status").value; },
        getEmail()                  { return document.getElementById("reg-member-email").value;},
        getPassword()               { return document.getElementById("reg-password").value;},
        getPasswordConfirm()        { return document.getElementById("reg-confirm-password").value;},
        getApplyBtn()               { return document.getElementById("reg-member-send-btn"); }
    },
    client: {
        getLoginBtn()               { return document.getElementById("login-btn");},
        getSignOutBtn()             { return document.getElementById("sign-out-btn");},
        getLogin()                  { return document.getElementById("login");},
        getPass()                   { return document.getElementById("password");},
        getClientContainer()        { return document.getElementById("client-cred-container");},
        getTemplate()               { return document.getElementById("client-data-template");},
        getPlaceholders(client)     { return {
                                            "#client-name":     client.getName() + " " + client.getSurname(),
                                            "#client-status":   client.getStatus(),
                                            "#client-link":     getClientLink(client)
                                            };
                                    },
        setPhoto(link)              { document.getElementById("client-photo").src = link;}
    },
    tabs: {
        barId:              "tab-bar-id",
        barHiddenClass:     "tabs-bar-hidden",
        linkClass:          "tablinks",
        linkHiddenClass:    "tab-hidden",
        linkActiveClass:    "active",
        contentClass:       "tabcontent",
        contentCompressed:  "tabcontent-compessed",
        indentClass:        "tab-indent",

        getLinks()          { return [].slice.call(document.getElementsByClassName(this.linkClass));},
        getContents()       { return [].slice.call(document.getElementsByClassName(this.contentClass));},
        getConent(linkId)   { return document.getElementById(this.contentClass + linkId.split("tab")[1]);},
        getCurrent()        { var t = window.location.href.split("#tab="); return t[1];},
        turnOffAll()        {
                                this.getLinks().forEach(tl => { tl.classList.remove(this.linkActiveClass);});
                                this.getContents().forEach(tc => { tc.style.display = "none";});
                            },
        hideTabsBar()       { 
                                document.getElementById(this.barId).classList.add(this.barHiddenClass);
                                this.getLinks().forEach(tl => { tl.classList.add(this.linkHiddenClass);});
                            },
        showTabsBar()       { 
                                document.getElementById(this.barId).classList.remove(this.barHiddenClass);
                                this.getLinks().forEach(tl => { tl.classList.remove(this.linkHiddenClass);});
                            },
        compressContent()   { markup.tabs.getContents().forEach(tc => {tc.classList.add(this.contentCompressed);})},
        decompressContent() { markup.tabs.getContents().forEach(tc => {tc.classList.remove(this.contentCompressed);})},
        setBarHeight(h)     { document.getElementById(this.barId).style.height = h  + "px";},
        getTogleBarBtn()    { return document.getElementsByClassName(this.indentClass)[0];},
    }
}

const months = {
    0: "Zeromonth",
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
};

const shortMonths = {
    0: "Zeromonth",
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"
};

export function formatDate(dateTime, format){
    if(dateTime == undefined)
        return "";
    else if(format == undefined)
        return dateTime;
    var parts = dateTime.split(" ");
    var date = parts[0].split("/");
    var time = parts[1].split(":");
    var res = format;
    res = res.replace("yy", date[2]);
    res = res.replace("mm", date[1]);
    res = res.replace("MM", months[Number(date[1])]);
    res = res.replace("SM", shortMonths[Number(date[1])]);
    res = res.replace("dd", date[0]);
    res = res.replace("hh", time[0]);
    res = res.replace("min", time[1]);
    return res;
}

function errorMessage(mess) {
    alert(mess);
}
function dateValidate(date){
    var dt = date.split("/");
    if(dt.length < 3) return false;
    var year    = Number(dt[2]);
    var month   = Number(dt[1]) - 1;
    var day     = Number(dt[0]);
    var d       = new Date(year, month, day);
    return ((d.getFullYear() == year) && (d.getMonth() == month) && (d.getDate() == day)) ? true : false;
}

function datetimeValidate(datetime){
    var parts = datetime.split(" ");
    var date = parts[0].split("/");
    var time = parts.length > 1 ? parts[1].split(":") : undefined;
    if((time == undefined) || (date.length < 3))
        return false;
    var year    = Number(date[2]);
    var month   = Number(date[1]) - 1;
    var day     = Number(date[0]);
    var hours   = Number(time[0]);
    var mins    = Number(time[1]);
    var d       = new Date(year, month, day);
    return ((d.getFullYear() == year) 
            && (d.getMonth() == month)
            && (d.getDate() == day)
            && (hours < 24) 
            && (mins < 60))
        ? true : false;
}

function datetimesCompare(dt1, dt2){
    var parts1 = dt1.split(" ");
    var date1 = parts1[0].split("/");
    var time1 = parts1.length > 1 ? parts1[1].split(":") : undefined;
    var parts2 = dt2.split(" ");
    var date2 = parts2[0].split("/");
    var time2 = parts2.length > 1 ? parts2[1].split(":") : undefined;

    if((time1 == undefined) || (date1.length < 3)) return -1;
    if((time2 == undefined) || (date2.length < 3)) return 1;
    for(var i = 0; i < 3; i++){
        if(Number(date1[i]) > Number(date2[i])) return 1;
        if(Number(date1[i]) < Number(date2[i])) return -1; 
    }
    for(var i = 0; i < 2; i++){
        if(Number(time1[i]) > Number(time2[i])) return 1;
        if(Number(time1[i]) < Number(time2[i])) return -1; 
    }
    return 0;
}

function arrToStr(arr, getter){
    var res = "";
    for(var i = 0; i < arr.length; i++)
    {
        if(i != 0)
            res += commonStrings.arrDivider;
        res += getter == undefined ? arr[i] : getter(arr[i]);
    }
    return res;
}

export const helpers = {   
    getIfDefined(val, defVal)   { return val == undefined ? defVal : val;},
    strEquals(s1, s2)           { return (s1.localeCompare(s2) == 0); },
    isNumber(num)               { return (isNaN(Number(num)) || this.strEquals(num, "")) ? false : true; },
    isEmptyString(str)          { return this.strEquals(str, "") || this.strEquals(str, "\r\n") ? true : false; },
    checkName(field, value)     { if(this.isEmptyString(value)) { errors.emptyField(field); return false; } return true; },
    checkNumber(field, value)   { if(!this.isNumber(value))     { errors.badNumber(field);  return false; } return true; },
    checkDate(date)             { if(!dateValidate(date))       { errors.badDate(date);     return false; } return true;},
    checkDateTime(dateTime)     { if(!datetimeValidate(dateTime)){ errors.badDate(dateTime);  return false; } return true;},
    compareDateTimes(dt1, dt2)  { return datetimesCompare(dt1, dt2);},
    isSportsmanId(id)           { return id.indexOf("S") < 0 ? false : true;},
    arrayToString(arr, getter)  {return arrToStr(arr, getter);}
}

export function onClick(object, action){
    object.addEventListener("click", action, false);
}

export function onEnterPress(object, action) {
    object.addEventListener('keypress', (event) => {
        if(helpers.strEquals(event.key, "Enter"))
            action();
      });
}

export function rowsComparator(row, val){
    for(let cell of row.cells)
        if(cell.innerHTML.includes(val))
            return "table-row";
    return "none";
}

export function filtration(object, container, comparator){
    object.addEventListener("keyup", (e) => {
        var items = container.querySelectorAll('.search-item');
        for (let item of items)
            item.style.display = comparator(item, e.target.value);
    }, false);
}

export function getLinkParams(link) {
    var paramsMap = new Map();
    var sectors = link.split("/");
    sectors.forEach(sect => {
        var params = sect.split("?");
        params.forEach(param => {
            param.split("&").forEach(pair => {
                var field = pair.split("=");
                if(field.length == 2){
                    paramsMap.set(field[0], field[1]);
                }
            });
        });
    });
    return paramsMap;
}

function logIn() {
    var client = ops.createClient();
    client.setLogin(markup.client.getLogin().value);
    client.setPassword(markup.client.getPass().value);
    server.access.login(client)
}

function clientRegister() {
    var pass = markup.registration.getPassword();
    var confirmPass = markup.registration.getPasswordConfirm();
    if(!helpers.strEquals(pass, confirmPass)) {
        alert("Mistmatch passwords!");
        return;
    }

    var newClient = ops.createClient();
    newClient.setStatus(markup.registration.getStatus());
    newClient.setLogin(markup.registration.getEmail());
    newClient.setPassword(pass);

    if(newClient.isTrainer()) {
        var member = ops.createTrainer(); 
    } else if(newClient.isJudge()) {
        var member = ops.createJudge(); 
    } else if(newClient.isAdmin()) {
        var member = ops.createAdmin(); 
    } else {
        alert("Undefined status");
        return;
    }
    member.setName(markup.registration.getName());
    member.setSurname(markup.registration.getSurname());
    member.setBirth(markup.registration.getBirthDate());
    member.setSex(markup.registration.getSex());
    member.setRegion(markup.registration.getRegion());
    member.setEmail(markup.registration.getEmail());
    member.setPassword(pass);
    
    if(newClient.isTrainer()) {
        server.trainer.create(member);
    } else if(newClient.isJudge()) {
        server.judge.create(member);
    } else if(newClient.isAdmin()) {
        server.admin.create(member);
    }
    server.access.login(newClient);
}

export function prepareClient(cl){
    if(cl.isGuest()) {
        markup.registration.initBirthDate();
        onClick(markup.registration.getApplyBtn(), clientRegister);
        onClick(markup.client.getLoginBtn(), logIn);
        onEnterPress(markup.client.getLogin(), logIn);
        onEnterPress(markup.client.getPass(), logIn);
    } else {
        var clContainer =  markup.client.getClientContainer();
        clContainer.innerHTML = "";
        clContainer.append(createPageItem(markup.client.getTemplate(), markup.client.getPlaceholders(cl)));
        onClick(markup.client.getSignOutBtn(), function(){server.access.logout();});
        if(cl.getPhoto() != undefined)
            markup.client.setPhoto(cl.getPhoto());
    }
}

export function unhideSubelements(elem){
    var shadows = elem.querySelectorAll(".js-hidden-element");
    for (let shadow of shadows){
        if(shadow.classList.contains("js-hiden-strict"))
            continue;
        shadow.classList.remove("js-hidden-element");
        shadow.disabled = false;
    }
}

export function showShadows(client, myTrainer){
    var shadows = undefined;
    var myShadows = undefined;

    if(client.isRoot())
        shadows = document.querySelectorAll(".js-root-view");
    else if(client.isAdmin())
        shadows = document.querySelectorAll(".js-admin-view");
    else if(client.isTrainer()){
        shadows = document.querySelectorAll(".js-trainer-view");
        if(myTrainer != undefined && helpers.strEquals(myTrainer, client.getId()))
            myShadows = document.querySelectorAll(".js-my-trainer-view");
    }
    else if(client.isJudge())
        shadows = document.querySelectorAll(".js-judge-view");

    if(shadows != undefined){
        for (let shadow of shadows){
            shadow.disabled = false;
            shadow.classList.remove("js-hidden-element");
        }
    }
    if(myShadows != undefined){
        for (let shadow of myShadows){
            shadow.disabled = false;
            shadow.classList.remove("js-hidden-element");
        }
    }
    
    var hiddens = document.querySelectorAll(".js-hidden-element");
    for (var i = 0; i <  hiddens.length; i++){
        hiddens[i].remove();
    }
}

function formatLangItem(state) {
    if (!state.id)
        return state.text;
    var url = "./img/" + state.element.value.toLowerCase() + ".png";
    var $state = $('<span><img class="hdr-lang-image"/><span class="hdr-lang-name"></span></span>');
    $state.find("span").text(state.text);
    $state.find("img").attr("src", url);
    return $state;
};

export function languageSwitchingOn(curLang){
    import("https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js").then(m1 => {
        import("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js").then(m2 => {
            import("https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js").then(m3 => {
                document.querySelectorAll(".hdr-lang-select")[0].value = curLang;
                $(".hdr-lang-select").select2({
                    templateResult: formatLangItem,
                    templateSelection: formatLangItem
                });
                $('.hdr-lang-select').on('select2:select', function (e) {
                    server.access.changeLang(e.params.data.id);
                });
            })
        })
    }).catch(err => {
        console.log(err.message);
    });
}


export function datePickerInit(id, plusTime){
    id = "#" + id
    import("../datetimepicker-master/jquery.js").then(m1 => {
        import("../datetimepicker-master/build/jquery.datetimepicker.full.min.js").then(m2 => {
            import("https://code.jquery.com/ui/1.13.0/jquery-ui.js").then(m3 => {
                if(plusTime != undefined){
                    $(id).datetimepicker({ format: "d/m/Y H:i"});
                } else {
                    $(id).datepicker({
                        changeMonth: true,
                        changeYear: true,
                        yearRange: "c-100:c",
                        dateFormat: "dd/mm/yy"
                    });
                }
            })
        })
    }).catch(err => {
        console.log(err.message);
    });
}

export function datetimePickerInit(id){
    datePickerInit(id, true);
}

export function createPageItem(item, values){
    var template = item.cloneNode(true);

    for (let ph in values) {
        template.innerHTML = template.innerHTML.replaceAll(ph, values[ph]);
    }
    return template.content;
}



/**********************************
 * TABS BAR*
 * ****************************** */
var tabsBarActive = false;
var activeTab = undefined;

function openTab(tabId) {
    var tab = document.getElementById(tabId);
    var content = markup.tabs.getConent(tabId);
    markup.tabs.turnOffAll();
    content.style.display = "block";
    tab.classList.add("active");
    markup.tabs.setBarHeight(content.offsetHeight > window['innerHeight'] ? content.offsetHeight : window['innerHeight']);
    window.location.href = window.location.href.split("#tab=")[0] + "#tab=" + tabId;
    activeTab = tabId;
}

function hideTabs(){
    markup.tabs.hideTabsBar();
    markup.tabs.decompressContent();
    tabsBarActive = false;
}

function showTabs(){
    markup.tabs.showTabsBar();
    markup.tabs.compressContent();
    var content = markup.tabs.getConent(activeTab);
    markup.tabs.setBarHeight(content.offsetHeight > window['innerHeight'] ? content.offsetHeight : window['innerHeight']);
    tabsBarActive = true;
}

function togleBar(){
    if(tabsBarActive)
        hideTabs();
    else
        showTabs();
}

export function prepareTabs() {
    var links = markup.tabs.getLinks();
    for (var i = 0; i < links.length; i++) (
        function(i) { links[i].onclick = function(){openTab(links[i].id)}; }
    )(i);
    var curTabId = markup.tabs.getCurrent();
    openTab(curTabId == undefined ? links[0].id : curTabId);
    if(window['innerWidth'] > 700)
        showTabs();
    else
        hideTabs()
    onClick(markup.tabs.getTogleBarBtn(), togleBar)
}

/* *******************
 * COMMON HTML LOADER
 * *******************/

function loadResources(array, indx, handler){
    console.log("Load " + array[indx].source);
    $(array[indx].dest).load(array[indx].source, function() {
        console.log("Resource " + array[indx].source + " loaded");
        if(indx == (array.length - 1))
            handler();
        else
            loadResources(array, indx + 1, handler)
    });
}

export function onPageLoad(handler) {
    var htmlImportPairs = [
        { source: "imports.html #temp-header-id", dest: "#page-header-id"},
        { source: "imports.html #popup_6", dest: "#client-registration-id"},
        { source: "imports.html #popup_1", dest: "#sportsman-create-id"},
        { source: "imports.html #popup_7", dest: "#client-popup"}
    ];

    import("https://code.jquery.com/jquery-3.5.0.js").then(m1 => {
        loadResources(htmlImportPairs, 0, handler);
    }).catch(err => {
        console.log("!ERR: " + err.message);
    });
}