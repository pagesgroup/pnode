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
  checkData(data) {
    return true;
  },
  writeCsv(options,path){
    const {rows} = options;
    const header = Object.keys(rows[0]).map(id => Object({id,title: id}));
    const csvWriter = createObjectCsvWriter({path,header});
    csvWriter.writeRecords(rows).then(() => console.log(`Saved: ${path}`));
  },
  readCsvJobInfo() {
    const filename = './data/JobInfo/BatchData.csv';
    if (fs.existsSync(filename)) {
      const results = [];
      fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => {
        publish('/aspect/jobinfo', results);
        const destpath = `data/JobInfo/${aspect.checkData(results) ? 'Processed' : 'Error'}`;
        const destfilename = filename.replace('data/JobInfo',destpath).replace(/\.csv$/, `_${aim.getTimestamp()}.csv`);
        fs.rename(filename, destfilename, console.log);
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
      return aspect.writeCsv(data, `./data/JobChange/JobChange_${aim.getTimestamp()}.csv`);
    }
    case '/aspect/finishedcartons': {
      return aspect.writeCsv(data, `./data/FinishedCartons/FinishedCartons_${aim.getTimestamp()}.csv`);
    }
    case '/aspect/rejects': {
      return aspect.writeCsv(data, `./data/Rejects/Rejects_${aim.getTimestamp()}.csv`);
    }
    case '/aspect/error': {
      return aspect.writeCsv(data, `./data/ErrorInfo/ErrorInfo_${aim.getTimestamp()}.csv`);
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

