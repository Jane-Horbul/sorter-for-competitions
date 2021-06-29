import {sendLogin} from "./communication.js"
import {languageSwitchingOn} from "./common.js"

function login() {
    sendLogin(document.getElementById("login").value, document.getElementById("password").value);
}
document.getElementById("login-btn").addEventListener("click", login, false);
languageSwitchingOn();