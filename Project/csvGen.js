// csvGen.js
// Author: Daniel Lipec (dlipec)
// Exports functions that generate csv 
// files for the d3 graphs, currently 
// just daily data 


function getDataDaily(date_time) {
  var fs = require("fs");
  var fileStream;
  const csv = require('fast-csv');

  const csvStream = csv.format({ headers: true });
  fileStream = fs.createWriteStream("src/generatedDataDaily.csv");
  
  // Pipe the csvStream to the fileStream
  csvStream.pipe(fileStream).on('end', () => process.exit())

  // Initiate connection to database
  const mariadb = require('mariadb');
  mariadb.createConnection({
    socketPath: '/run/mysqld/mysqld.sock',
    user: 'node',
    password: 'password',
    database: 'GNSS'
  })
  .then(conn => {
    console.log("Database connection successful")
    conn.query({ rowsAsArray: true, sql: "SELECT timestamp, east, north from GPS where timestamp > '2021-11-26 00:00:00' and timestamp < '2021-11-26 23:59:59' "})
    .then((rows) => {
      for (let x of rows) {
        csvStream.write({ timestamp: x[0], horizontalerror: x[1] , verticalerror: x[2], satellite: 'GPS'});
      }
    })
    conn.query({ rowsAsArray: true, sql: "SELECT timestamp, east, north from Galileo where timestamp > '2021-11-26 00:00:00' and timestamp < '2021-11-26 23:59:59'"})
    .then((rows) => {
      for (let x of rows) {
        csvStream.write({ timestamp: x[0], horizontalerror: x[1] , verticalerror: x[2], satellite: 'Galileo'});
      }
    })
    conn.query({ rowsAsArray: true, sql: "SELECT timestamp, east, north from GLONASS where timestamp > '2021-11-26 00:00:00' and timestamp < '2021-11-26 23:59:59'"})
    .then((rows) => {
      for (let x of rows) {
        csvStream.write({ timestamp: x[0], horizontalerror: x[1] , verticalerror: x[2], satellite: 'GLONASS'});
      }
    })
    conn.query({ rowsAsArray: true, sql: "SELECT timestamp, east, north from BeiDou where timestamp > '2021-11-26 00:00:00' and timestamp < '2021-11-26 23:59:59'"})
    .then((rows) => {
      for (let x of rows) {
        csvStream.write({ timestamp: x[0], horizontalerror: x[1] , verticalerror: x[2], satellite: 'BeiDou'});
      }
    csvStream.end()
    console.log("CSV generation complete")
    })
  }).catch(function () {
    console.log("Could not connect to database.")
  });
}

module.exports = getDataDaily
