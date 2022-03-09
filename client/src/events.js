//Communication Abstraction Library by Evan Cheung


//Globals
const eventsEle = document.getElementById("events");


//Listens for an event and executes a function with the data as an argument.
function listen(type,func) {
    document.addEventListener("EV:"+type,(e) => {func(e.detail);});
}

//Sends data to all listeners
function send(type,data) {
    let localevent = new CustomEvent("EV:"+type,{detail:data})
    document.dispatchEvent(localevent);
}

//Listens to an event once, and then deletes this listener
function listenOnce(type,func) {
    let once = (e) => {
        func(e.detail);
        document.removeEventListener("EV:"+type,once);
    }

    document.addEventListener("EV:"+type,once);
}

//Posts data that can be read at any time.
function post(name,data) {
    name = "EV:" + name;
    let findEle = document.getElementById(name);
    if (findEle != undefined) {
        findEle.setAttribute("data",JSON.stringify(data))
    } else {
        let ele = document.createElement("div");
        ele.setAttribute("id",name);
        ele.setAttribute("data",JSON.stringify(data));
        eventsEle.appendChild(ele)
    }
}

//Read posted data at any time. If no data, return an empty object.
function read(name) {
    name = "EV:" + name;
    let findEle = document.getElementById(name);
    if (findEle != undefined) {
        console.log("found element!");
        return JSON.parse(findEle.getAttribute("data"));
    }
    return undefined;
}

function clear(name, data) {
    var ele = document.getElementById(name);
    if (ele != undefined) {
        ele.parentNode.removeChild(ele);
    }
}
export {listen, send, listenOnce, post, read, clear}