/*Naomi Zarrilli*/

function parse(){

// 1: create instance of object
request = new XMLHttpRequest();

// 3: set up way to managa response --to a function
request.onreadystatechange = parseData;

// 2: create/open HTTP request
request.open("GET", "data.json", true);

// 4: execute request
request.send();

}


function parseData() {
    if (request.readyState ==4 && request.status == 200) {
        messagesDiv = document.getElementById("messages");
        converted = JSON.parse(request.responseText);
        for (i = 0; i < converted.length; i++) {
            messagesDiv.innerHTML += "<p>" + converted [1]['content'] + "</p>";
        }

    }
    else if (request.readyState == 4 && request.status == 304) {
        alrt("No data changed, move along");
    }
    else if (request.readyState == 4 && request.status == 404) {
        alert("hacked by the chinese!");
    }

}