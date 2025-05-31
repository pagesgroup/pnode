/**
 * --------------------------------------------------------------
 * Description:
 * Simulation of Saia PLC Boxpacking communications
 * 
 * Run script to start simulation
 * 
 * Author: Max van Kampen
 * Created: 30-05-2025
 * Updated: 30-05-2025
**/
console.log('SIM BP / Boxpacker');
const net = require('net');
const aim = require('./aim');
const config = aim.loadConfig();
const plt = aim.tcpServer(config.bp,{
  ondata(received) {
    console.log(received);
  }
});
(function({host,port}) {
  const client = new net.Socket();
  const plt = {
    finishedCartons() {
      client.write(`FinishedCartons : Bla Bla`);
    },
  }
  client.connect(port, host, () => {
    console.log(`Connected to server at ${host}:${port}`);
    (function start() {
      setTimeout(plt.finishedCartons, 4000);
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
