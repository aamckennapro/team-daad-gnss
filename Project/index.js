// index.js
// $ node index.js
// http://localhost:3000/
// index.js written by Daniel Lipec (dlipec), Aaron McKenna (aamckennapro)

let express = require('express');
let app = express();
let https = require('https');
let fs = require('fs');

// Test call to generadte daily csv, will be scheduled eventually
var getDataDaily = require('./csvGen');


var date_time = new Date();

console.log(date_time);

getDataDaily(date_time);

app.use('/view', express.static('view')); // serves static files found in view subdirectory
app.use('/data', express.static('data')); // serves static files found in data subdirectory
app.use(express.static(__dirname)); // serves static files found in starting directory

/*https.createServer({ // this is here for a real ssl, currently the ones used are 
  key: fs.readFileSync('server.key'), // self-signed. website is https, but most 
  cert: fs.readFileSync('server.cert') // browsers won't like it due to it being
}, app).listen(3000, function () { // self-signed.
  console.log('Second-Generation GNSS Performance Monitor listening on port 3000!'); 
});*/

app.listen(4000, function () {
  console.log('Second-Generation GNSS Performance Monitor listening on port 4000!');
});

app.get("/", (req, res) => { // when you open the website, sends you to index.html
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => { // this is for the HTTP POST method, in case we need it (routing)
  res.sendFile(__dirname + "index.html"); // this is going to be the default 
                                          // reaction to any HTTP methods as 
                                          // we do not know if we need them yet
});

app.put("/", (req, res) => { // HTTP PUT
  res.sendFile(__dirname + "/index.html");
});

app.delete("/", (req, res) => { // HTTP DELETE
  res.sendFile(__dirname + "/index.html");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Error 500: There's a problem and we're fixing it as soon as possible!");
});

app.use(function (req, res, next){ // keep this at the bottom, since it's the *very*
  res.status(404).send("Error 404: Page not found!"); // last thing that needs checked
});

// const brushButton = toolsList.select('#brush').on('click', () => {
//    toolsList.selectAll('.active').classed('active', false);
//    brushButton.classed('active', true);
//    canvasChart.style('z-index', 0);
//    svgChartParent.style('z-index', 1);
// });