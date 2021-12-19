import { department, competition, arena} from "./arena.js";
import { checkers } from "./common.js";


function getSpName(sid, gid){
    var sp = department.getSportsmanById(sid);
    if(undefined != sp)
        return sp.getName() + " " + sp.getSurname();
    var pair = arena.getPairById(sid);
    return markup.common.getPairWinnerText() + " " + (pair == undefined ? sid : pair.getNumber());
}
export const markup = {
    breadcrumbs: {
        getContainer()              { return document.getElementById("bread-crumbs-container");},
        getTemplate()               { return document.getElementById("bread-crumbs-template");},
        getPlaceholders(dp, cp, ar) { return {
                                            "#depart-link":         window.location.href.substring(0, window.location.href.indexOf("/")),
                                            "#depart-name":         dp.getName(),
                                            "#competition-link":    window.location.href.substring(0, window.location.href.lastIndexOf("/")),
                                            "#competition-name":    cp.getName(),
                                            "#arena-link":          window.location.href,
                                            "#arena-name":          ar.getName()
                                        };
                                    }
    },
    common: {
        setListName(name)           {document.getElementById("list-name").innerHTML = name;},
        getPairWinnerText()         {return document.getElementById("pair-winner-text").innerHTML;}
    },
    pair: {
        getActiveContainer()        { return document.getElementById("active-pair-container");},
        getActiveTemplate()         { return document.getElementById("active-pair-template");},

        getContainer()              { return document.getElementById("arena-pairs-container");},
        getTemplate()               { return document.getElementById("pair-item-template");},

        getPlaceholders(pair, dp)   { return {
                                            "#pair-group-name": competition.getGroupById(pair.getGroupId()).getName(),
                                            "#pair-num":        pair.getNumber(),
                                            "#pair-round-num":  pair.getRound(),
                                            "#pair-red-sports": getSpName(pair.getRedSp(), pair.getGroupId()),
                                            "#pair-blue-sports": getSpName(pair.getBlueSp(), pair.getGroupId()),
                                            "#pair-red-score":  pair.getRedScore(),
                                            "#pair-blue-score": pair.getBlueScore(),
                                            "#pair-time":       checkers.getIfDefined(pair.getTime(), ""),
                                            "#pair-winner":     pair.getWinner(),
                                        };
                                    }
    }
}