/**
 * --------------------------------------------------------------
 * Script: aspects.js
 * Description:
 * converts MQTT messages to Aspects CSV files
 *
 * Usage:
 * Run this script as part of the application to 
 * create and read CSV data files for interfacing with the Aspect MES application 
 *
 * Author: Max van Kampen
 * Created: 30-05-2025
 * Updated: 30-05-2025
**/
console.log('Aspect Filesave');
const fs = require('fs');
const csv = require('csv-parser');
const {createObjectCsvWriter} = require('csv-writer');
const aim = require('./aim');
const config = aim.loadConfig();
const {root} = config;
const {mqttClient,publish} = aim.mqtt();
const aspect = {
  writeCsv(options){
    const {path,rows} = options;
    const header = Object.keys(rows[0]).map(id => Object({id,title: id}));
    const csvWriter = createObjectCsvWriter({
      path: './data' + path,
      header,
    });
    csvWriter.writeRecords(rows).then(() => console.log('CSV opgeslagen als output.csv'));
  },
  readCsvJobInfo() {
    const filename = './data/BatchData.csv';
    if (fs.existsSync(filename)) {
      const results = [];
      fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => {
        console.log('SET /aspect/jobinfo');
        publish('/aspect/jobinfo', results);
        const destfilename = filename.replace(/data/,'data/processed').replace(/csv$/,aim.getTimestamp() + '.csv');
        fs.rename(filename, destfilename, (err) => err ? console.log(err) : null);
        setTimeout(aspect.readCsvJobInfo, 10000);
      });
    } else {
      setTimeout(aspect.readCsvJobInfo, 5000);
    }
  },
}

mqttClient.on('message', (topic, message) => {
  const path = topic.split(root).pop();
  console.log(`Received path: ${path}`);
  const data = JSON.parse(message);
  switch (path) {
    case '/aspect/jobchange': {
      return aspect.writeCsv(data);
    }
    case '/aspect/finishedcartons': {
      return aspect.writeCsv(data);
    }
    case '/aspect/rejects': {
      return aspect.writeCsv(data);
    }
  }
});

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe(root + '/aspect/#', (err) => {
    if (err) return;
    aspect.readCsvJobInfo();
  });
});

