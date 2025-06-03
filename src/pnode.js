/**
 * --------------------------------------------------------------
 * Description:
 * Polymac Node Controller application
 * 
 * Run script as main application
 * 
 * Author: Max van Kampen
 * Created: 30-05-2025
 * Updated: 30-05-2025
**/
const net = require('net');
const fs = require('fs');
const yaml = require('js-yaml');
const mqtt = require('mqtt');

const config = yaml.load(fs.readFileSync('config/config.yaml', 'utf8'));
const cwd = process.cwd()

const lib = {
  tcpMessage(selector,properties,values) {
    return selector.padEnd(23, ' ') + ':' + Object.entries(properties).map(
      ([name,prop]) => String(values[name]||'')
      .substring(0,prop.length)
      .padEnd(prop.length, ' ')
    ).join('');
  },
  tcpMessage2(selector,properties,values) {
    return selector.padEnd(3, ' ') + ':' + Object.entries(properties).map(
      ([name,prop]) => String(values[name]||'')
      .substring(0,prop.length)
      .padEnd(prop.length, ' ')
    ).join('');
  },
  loadJson(path) {
    const content = fs.readFileSync(path, 'utf8');
    return JSON.parse(content);
  },
  /**
   * 
   */
  tcpClient(options,message) {
    const {port,host} = options;
    const client = new net.Socket();
    client.connect(port, host, () => {
      console.log(`${host}:${port} Connected`);
      client.write(message, 'ascii', () => {
        console.log(`verzonden: ${message}`);
      });
    });
    client.on('data', (data) => {
      console.log('Received from server:', data.toString());
      client.end(); // Sluit de verbinding na ontvangst
    });
    client.on('close', () => {
      console.log(`${host}:${port} Closed`);
    });  
    client.on('error', () => {
      console.log(`${host}:${port} Error`);
    });  
  },
  tcpServer(options,events) {
    const {host,port} = options;
    const server = net.createServer((socket) => {
      socket.on('data', events.ondata);
      socket.on('data', events => {
        socket.write('Data received\0', 'ascii', () => {
          console.log(`${host}:${port} Send Ack`);
        });
      });
      // socket.on('data', (data) => {
      //   let received = data.toString();
      //   events.ondata(received);
      //   console.log('Ontvangen van client:', received);
      // });
      socket.on('end', () => {});
      socket.on('close', () => {});
      socket.on('error', (err) => console.error('Socket error:', err.message));
    });
    server.on('error', (err) => console.error('Server error:', err.message));
    server.listen(port, host, () => console.log(`${host}:${port} Server Online`));
    return server;
  },
  getTimestamp() {
    return new Date().toISOString().replace(/-|\:/g,'').replace(/T/g,'_').substring(0,15);
  },
  loadConfig() {
    return this.config = yaml.load(fs.readFileSync('config/config.yaml', 'utf8'));
  },
  mqtt() {
    const {server,port,useSSL,timeout,root} = config.mqtt;
    const clientId = "myclientid_" + Math.floor(Math.random() * 100);
    const mqttClient = mqtt.connect(server, {
      port,
      useSSL,
      timeout,
      clientId,
    });
    mqttClient.on('error', (err) => console.error('Connection error: ', err));

    return {
      mqttClient,
      root,
      publish(topic, value) {
        mqttClient.publish(config.root + topic, JSON.stringify(value));
      },
    }
  },
}

const aspect = {
  start() {
    const csv = require('csv-parser');
    const {createObjectCsvWriter} = require('csv-writer');

    function checkData(data) {
      return true;
    }
    function writeCsv(options,path){
      const {rows} = options;
      const header = Object.keys(rows[0]).map(id => Object({id,title: id}));
      const csvWriter = createObjectCsvWriter({path,header});
      csvWriter.writeRecords(rows).then(() => console.log(`Saved: ${path}`));
    }
    function readCsvJobInfo() {
      const filename = `${cwd}/data/JobInfo/BatchData.csv`;
      if (fs.existsSync(filename)) {
        const results = [];
        fs.createReadStream(filename)
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', () => {
          publish('/aspect/jobinfo', results);
          const destpath = `data/JobInfo/${checkData(results) ? 'Processed' : 'Error'}`;
          const destfilename = filename.replace('data/JobInfo',destpath).replace(/\.csv$/, `_${lib.getTimestamp()}.csv`);
          fs.rename(filename, destfilename, console.log);
          setTimeout(readCsvJobInfo, 10000);
        });
      } else {
        setTimeout(readCsvJobInfo, 5000);
      }
    }

    console.log('Aspect Service');
    const {mqttClient,root,publish} = lib.mqtt();
    mqttClient.on('message', (topic, message) => {
      const path = topic.split(root).pop();
      console.log(`Received path: ${path}`);
      const data = JSON.parse(message);
      switch (path) {
        case '/aspect/jobchange': {
          return writeCsv(data, `${cwd}/data/JobChange/JobChange_${lib.getTimestamp()}.csv`);
        }
        case '/aspect/finishedcartons': {
          return writeCsv(data, `${cwd}/data/FinishedCartons/FinishedCartons_${lib.getTimestamp()}.csv`);
        }
        case '/aspect/rejects': {
          return writeCsv(data, `${cwd}/data/Rejects/Rejects_${lib.getTimestamp()}.csv`);
        }
        case '/aspect/error': {
          return writeCsv(data, `${cwd}/data/ErrorInfo/ErrorInfo_${lib.getTimestamp()}.csv`);
        }
      }
    });

    mqttClient.on('connect', () => {
      console.log('Aspect Connected to MQTT broker');
      mqttClient.subscribe(root + '/aspect/#', (err) => readCsvJobInfo());
    });
  },
  sim(){
    console.log('Aspect SIMULATION');
    const fs = require('fs');
    (function copyBatchDataDummy() {
      const filename = './data/JobInfo/BatchData.csv';
      if (!fs.existsSync(filename)) {
        console.log('Create data/JobInfo/BatchData.csv');
        fs.copyFile ('./test/data/BatchData.csv', filename, console.log);
      }
      setTimeout(copyBatchDataDummy, 30000);
    })()
  },

}

const pnode = {
  config,
  tcpServer() {
      lib.tcpServer(config.pnode, {
      ondata(data) {
        let received = data.toString();
        console.log('Ontvangen van client:', received);

        function getPart(len) {
          const part = received.substring(0, len).trim();
          received = received.substring(len);
          return part;
        }
        function getData(source,properties) {
          const data = {};
          Object.entries(properties).forEach(([name,prop])=>{
            data[name] = getPart(prop.length);
          })
          return data;
        }

        // const selector = getPart(23);
        const selector = getPart(10);
        getPart(14);
        console.log('Ontvangen:', selector);
        // const dataCount = getPart(4);
        // console.log({selector});
        switch(selector) {
          case 'JobChange': {
            const {currentJobId} = pnode;
            console.log(`Active JobID     : ${currentJobId}`);
            const data = getData(received, schemas.jobChange.properties);
            const {jobID} = data;
            pnode.currentJobId = jobID;
            console.log(`New Active JobID : ${jobID}`);
            pnode.jobinfo.sort((a,b) => a.scheduleIndex - b.scheduleIndex);
            const newjob = pnode.jobinfo.find(r => r.JobID == jobID) || {};

            const newnextjob = pnode.jobinfo
            .filter(r => r.JobID != currentJobId && r.JobID != jobID)
            .shift() || {};
            const jobIdNext = newnextjob.JobID;
            console.log(`Next JobID       : ${jobIdNext}`);

            // /**
            //  * SIMULATIE
            //  */
            // function sim(){
            //   console.log(`Wis : ${currentJobId}`);
            //   const fn = '/node/tcpip2/sim/aspect-jobinfo.json';
            //   const rows = loadJson(fn);
            //   fs.writeFileSync(fn, JSON.stringify(rows.filter(r => r.JobID != currentJobId), null, 2));
            // }
            // sim();


            const writerecords = [{
              JobID: newjob.JobID,
              JobRun: newjob.JobRun,
              WorkOrderID: newjob.WorkOrderID,
              MachineID: newjob.MachineID,
              Timestamp: new Date().toISOString().substring(0,20),
            }]
            const csvWriter = createCsvWriter({
              path: `./data/20-JobChange/JobChange-${getTimestamp()}.csv`,
              header: 'JobID,JobRun,WorkOrderID,MachineID,Timestamp'.split(',').map(name => Object({
                id: name, 
                title: name 
              })),
            });
            csvWriter.writeRecords(writerecords).then(() => {
              console.log('CSV opgeslagen als output.csv');
            });

            const client = new Client();
            const row = {
              jobIdCurrent: newjob.JobID,
              desiredYieldCurrent: newjob.DesiredYield,
              materialId: newjob.MaterialID,
              lblName: newjob.LBLNAME,
              lblBarcodeCurrent: newjob.LBLBARCODE,
              imlBarcodeCurrent: newjob.IMLBARCODE,
              imlBarcodeLocCurrent: newjob.IMLBARCODELOC,
              jobIdNext: newnextjob.JobID,
              lblBarcodeNext: newnextjob.LBLBARCODE,
              imlBarcodeNext: newnextjob.IMLBARCODE,
              imlBarcodeLocNext: newnextjob.IMLBARCODELOC,
              desiredYieldNext: newnextjob.DesiredYield,
              dateTime: new Date().toLocaleString(),
            }
            // console.log({row})
            client.init(config.plt).then(e => {
              client.send('JobInfo', schemas.jobInfo.properties, row).then(e => client.socket.end());
            });
            // Lees JSON file met JobInfo
            return;
          }
          case 'FinishedCartons': {
            const data = getData(received, schemas.finishedCartons.properties);
            // console.log(data)
            return;
          }
        }


        // Stuur een bevestiging terug (zoals de PLC verwacht)
        socket.write('Data received\0', 'ascii');
      }
    })
  },
  webserver() {
    const express = require('express');
    const app = express();
    const port = 80;

    app.use(express.static('public'));
    // Home route
    app.get('/api', (req, res) => {
      res.send('Hello World from Express!');
    });

    // Start server
    app.listen(port, () => {
      console.log(`Express server listening at http://localhost:${port}`);
    });
  },
  mqttserver() {
    const aedes = require('aedes')();
    const net = require('net');

    const server = net.createServer(aedes.handle);
    const port = 1883;

    server.listen(port, () => {
      console.log(`MQTT broker draait op poort ${port}`);
    });

    aedes.on('client', (client) => {
      console.log(`Client verbonden: ${client.id}`);
    });

    aedes.on('publish', (packet, client) => {
      if (client) {
        console.log(`Bericht van client ${client.id}: ${packet.topic} - ${packet.payload.toString()}`);
      }
    });
  },
  opcserver() {
    const opcua = require("node-opcua");

    // Server setup
    const server = new opcua.OPCUAServer({
      port: 4334, // poort waar de server op draait
      resourcePath: "/UA/NodeServer", // URL path
      buildInfo: {
        productName: "MyOPCUAServer",
        buildNumber: "001",
        buildDate: new Date()
      }
    });

    // Initialiseer address space en start server
    server.initialize(() => {
      const addressSpace = server.engine.addressSpace;
      const namespace = addressSpace.getOwnNamespace();

      // Voeg een variabele toe
      let variableValue = 100;

      const device = namespace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
        browseName: "MyDevice"
      });

      namespace.addVariable({
        componentOf: device,
        browseName: "MyVariable",
        nodeId: "ns=1;s=MyVariable",
        dataType: "Double",
        minimumSamplingInterval: 500, // bijvoorbeeld 500 ms
        value: {
          get: () => new opcua.Variant({ dataType: opcua.DataType.Double, value: variableValue }),
          set: (variant) => {
            variableValue = variant.value;
            return opcua.StatusCodes.Good;
          }
        }
      });

      server.start(() => {
        console.log("Server draait op:", server.endpoints[0].endpointDescriptions()[0].endpointUrl);
      });
    });
  },
  sql() {
    (async function connectAndQuery(config) {
      if (config) {
        try {
          const sql = require('mssql');
          // Maak connectie
          let pool = await sql.connect(config);
          console.log('Verbinding met MSSQL succesvol!');

          // Voer een query uit
          let result = await pool.request().query('SELECT 1 AS a');
          console.log(result.recordset);

          // Sluit connectie
          await pool.close();
        } catch (err) {
          console.error('Fout bij verbinden of query uitvoeren:', err);
        }
      }
    })(config.mssql);
  },
  aspect,
  start() {
    const {mqttClient,root,publish} = lib.mqtt();
    mqttClient.subscribe(root + '/pnode/#', (err) => {
      if (!err) {
        console.log('Subscribed to topic');
      }
    });
    mqttClient.on('message', (topic, message) => {
      console.log(`Received message on ${topic}: ${message.toString()}`);
    });
  }
}
module.exports = pnode;

