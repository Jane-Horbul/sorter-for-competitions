import {sendRequest} from "./common.js"
import {getLinkParams} from "./common.js"
import {isNumber} from "./common.js"
import {languageSwitchingOn} from "./common.js"

var pageParams = getLinkParams(location.search);
var pageInfo = sendRequest("/group-get?cid=" + pageParams.get("cid") + "&gid=" + pageParams.get("gid"));
var prevPage = window.location.href.substr(0, window.location.href.lastIndexOf("/"));

function memberNameGet(id){
    console.log(id);
    if(!isNumber(id)){
        return "Winner of " + id;
    }
    var member = pageInfo.get("Members").find( memb => memb.get("id") == id );
    if(member == undefined){
        return "";
    }
    return member.get("name") + " " + member.get("surname");
}

function drawLine(start, end, ctx, color){
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
}

function drawConnection(container, table, sizes, lineHigh, up){
    lineHigh = lineHigh * sizes.scale + (sizes.scale / 2);

    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var halfW = sizes.pairWidth/2
    var fullW = sizes.pairWidth
    var halfH = (sizes.pairHeight / 2) + (up ? lineHigh : 0)
    var fullH = halfH + (up ? -lineHigh : lineHigh)
    var color = up ? "blue" : "red";

    canvas.style.position = 'absolute'
    canvas.style.left = sizes.pairWidth + table.offsetLeft + "px"
    canvas.style.top =(table.offsetTop - (up ? lineHigh : 0)) + "px"
    canvas.width = sizes.pairWidth
    canvas.height = lineHigh + sizes.pairHeight;

    drawLine({x: 0,     y: halfH}, {x: halfW, y: halfH}, ctx, color);
    drawLine({x: halfW, y: halfH}, {x: halfW, y: fullH}, ctx, color);
    drawLine({x: halfW, y: fullH}, {x: fullW, y: fullH}, ctx, color);
    container.append(canvas);
}

function drawPair(sizes, pair){
    var container = document.getElementById("pairs-grid");
    var template = document.getElementById("pair-tab-temp").content.cloneNode(true);
    var table = template.getElementById('pair-table');
    var memberRed = template.getElementById('member-red-name');
    var memberBlue = template.getElementById('member-blue-name');
    var col = pair.get("col")
    var row = pair.get("row")
    var red_name = memberNameGet(pair.get("member_red"))
    var blue_name = memberNameGet(pair.get("member_blue"))

    var pairsDistY = Math.pow(2, (col + 2));
    var tabPosX = 12 * sizes.scale * col;
    var tabPosY = (((pairsDistY / 2) - 2) + (row * pairsDistY)) * sizes.scale ;

    table.setAttribute("width", String(sizes.pairWidth));
    table.setAttribute("height", String(sizes.pairHeight));
    table.style.position = 'absolute';
    table.style.left = tabPosX + "px";
    table.style.top = tabPosY + "px";
    
    memberRed.innerHTML = (red_name == "") ? ("Winner of " + pair.get("member_red")) : red_name;
    memberBlue.innerHTML = (blue_name == "") ? ("Winner of " + pair.get("member_blue")) : blue_name;
    container.append(table);
    if(pair.get("final_part") != "1"){
        drawConnection(container, table, sizes, (Math.pow(2, (col + 1)) - 1), ((row % 2) == 0) ? false : true);
    }
}

function setColsForPairs(){
    var maxPart = 1;
    console.log(pageInfo.get("Pairs"));
    pageInfo.get("Pairs").forEach(pair =>  {
        console.log("Pair part " + pair.get("final_part"));
        if(Number(pair.get("final_part")) > maxPart){
            maxPart = Number(pair.get("final_part"));
        }
    });
    var colMap = new Map();
    var curCol = 0;

    for(var i = maxPart; i >= 1; i /= 2){
        colMap.set("" + i, curCol);
        curCol++;
    }
    console.log(colMap);
    pageInfo.get("Pairs").forEach(pair =>  {
        pair.set("col", colMap.get(pair.get("final_part")))
    });
}

function getParentPair(childPair, memberColor){
    var memberId = memberColor == "red" ? childPair.get("member_red") : childPair.get("member_blue");
    var res = pageInfo.get("Pairs").find(pair => {
        if(childPair.get("id") != pair.get("child_pair")) return false;
        if(memberId == pair.get("winner")) return true;
        if(memberId == pair.get("member_red")) return true;
        if(memberId == pair.get("member_blue")) return true;
        if(memberId == pair.get("id")) return true;
        return false;
    });
    return res;
}

function setRowsForPairs(){
    var pairsArray = new Array(0);
    var finalPair = pageInfo.get("Pairs").find( pr => (pr.get("final_part") == "1") );
    finalPair.set("row", 0);
    pairsArray.push(finalPair);

    while(pairsArray.length > 0){
        var firstPair = pairsArray[0];
        var rowNum = firstPair.get("row");
        var redPair = getParentPair(firstPair, "red");
        var bluePair =  getParentPair(firstPair, "blue");

        if(redPair != undefined){
            redPair.set("row", (rowNum * 2));
            pairsArray.push(redPair);
        }
        if(bluePair != undefined){
            bluePair.set("row", ((rowNum * 2) + 1));
            pairsArray.push(bluePair);
        }
        pairsArray.shift();
    }
}

function drawGrid(){
    var sc = 30;
    var sizes = {
        scale: sc, 
        pairWidth: (6 * sc), 
        pairHeight: (2 * sc)
    };
    setColsForPairs();
    setRowsForPairs();
    console.log(pageInfo.get("Pairs"));

    pageInfo.get("Pairs").forEach(pair =>  {
        drawPair(sizes, pair);
    });
}
document.getElementById("group-name").innerHTML = pageInfo.get("Name");
document.getElementById("group-link").setAttribute("href", prevPage);

drawGrid();
languageSwitchingOn();
