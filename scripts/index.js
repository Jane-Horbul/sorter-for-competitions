import {sendForm} from "./common.js"
import {languageSwitchingOn} from "./common.js"

function sendLogin() {
    var paramsMap = new Map();
    paramsMap.set("login",     document.getElementById("login").value);
    paramsMap.set("password",  document.getElementById("password").value);
    sendForm("/admin-login", paramsMap, true);
}
document.getElementById("login-btn").addEventListener("click", sendLogin, false);
languageSwitchingOn();