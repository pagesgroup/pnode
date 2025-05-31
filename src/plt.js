/**
 * --------------------------------------------------------------
 * Description:
 * Simulation of Saia PLC PLT communications
 * 
 * Run script to start simulation
 * 
 * Author: Max van Kampen
 * Created: 30-05-2025
 * Updated: 30-05-2025
**/
console.log('SIM PLT / IML PLEA');
const net = require('net');
const aim = require('./aim');
const config = aim.loadConfig();
const {schemas} = config; 
const plt = aim.tcpServer(config.plt,{
  ondata(received) {
    console.log(received);
  }
});


(function({host,port}) {
  const client = new net.Socket();
  const plt = {
    jobchange() {
      client.write(aim.tcpMessage(
        'JobChange',
        schemas.jobChange.properties,
        {
          dataCount: 5,
          jobID: 'fdsgsdfgs',
        },
      ));
    },
    rejects() {
      client.write(aim.tcpMessage(
        'Reject',
        schemas.jobChange.properties,
        {
          jobID: 'fdsgsdfgs',
          rejectReasonCode: 1,
          quantity: 4,
        },
      ));
    },
  }
  client.connect(port, host, () => {
    console.log(`Connected to server at ${host}:${port}`);
    (function start() {
      setTimeout(plt.jobchange, 2000);
      // setTimeout(plt.finishedCartons, 4000);
      setTimeout(plt.rejects, 6000);
      setTimeout(start, 10000);
    })()
  });
  client.on('data', (data) => {
    console.log('Received from server: ' + data.toString());
    // client.destroy(); // comment dit uit als je automatisch wil sluiten
  });
  client.on('close', () => console.log('Connection closed'));
  client.on('error', (err) => console.error('Connection error: ', err.message));
})(config.pnode);
