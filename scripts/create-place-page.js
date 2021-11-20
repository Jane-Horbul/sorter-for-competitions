import {
    showShadows,
    getLinkParams,
    languageSwitchingOn,
    prepareTabs
} from "./common.js"
import {server} from "./communication.js"
import { markup } from "./create-place-page-markup.js";

const page = {
    cid: getLinkParams(location.search).get("cid")
}
var client = server.access.getClient();
const competition = server.competition.get(page.cid);
const competitionLink   = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
const departmentLink    = competitionLink.substr(0, competitionLink.lastIndexOf("/"));
const departmentInfo      = server.department.get();



function fillPageInfo(){
    markup.common.setPageHeader(competition.getName());
    markup.common.setPageHeaderLink(competitionLink);
    markup.common.setDepartmentLink(departmentInfo.getName(), departmentLink);
    markup.common.setCompetitionLink(competition.getName(), competitionLink);
}

prepareTabs();
fillPageInfo();
showShadows(client);
languageSwitchingOn();