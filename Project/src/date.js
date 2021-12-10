// datse.js
// Written by Aaron McKenna
// Used for generating data by date and restricting the datasets for the date picker
const mariadb = require('mariadb');
require('dotenv').config(); // used for secure db login -> db.env cannot be pushed to repo!
import * as d3 from "https://cdn.skypack.dev/d3@7"; // I used D3 in place of a Node Event Emitter just because
                                                    // it's more consistent than Node.

var dateSet = function() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd; // this is now date objects work, so it has to be formatted this way

    document.getElementById("beg-date").setAttribute("max", today);
    document.getElementById("beg-date").setAttribute("value", today);

    document.getElementById("end-date").setAttribute("max", today);
    document.getElementById("end-date").setAttribute("value", today);
}

dateSet(); // sets the date

var getDateValues = function() {
    let beg = document.getElementById("beg-date").valueAsDate;
    let end = document.getElementById("end-date").valueAsDate;
    let begD = beg.getDate() + 1;
    let begM = beg.getMonth() + 1;
    let begY = beg.getFullYear();
    let endD = end.getDate() + 1;
    let endM = end.getMonth() + 1;
    let endY = end.getFullYear();
    //console.log(begD, begM, begY);
    //console.log(endD, endM, endY);
    d3.select(".date-submit").on("click", function(event, d) {
        beg = document.getElementById("beg-date").valueAsDate; // on submit, dates get updated
        end = document.getElementById("end-date").valueAsDate; 
        begD = beg.getDate() + 1;
        begM = beg.getMonth() + 1;
        begY = beg.getFullYear();
        endD = end.getDate() + 1;
        endM = end.getMonth() + 1;
        endY = end.getFullYear();
        //console.log(begD, begM, begY);
        //console.log(endD, endM, endY);
    })
    return [begM, begD, begY, endM, endD, endY]; // returns an array of beginning and end dates 
                                                 // *** FROM HERE ON OUT THEY WILL ALWAYS BE IN M/D/Y ORDER ***
}

let [begMonth, begDay, begYear, endMonth, endDay, endYear] = getDateValues(); // pass these values into CSV generator