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
const aim = require('../src/aim');
const config = aim.loadConfig();
const {schemas} = config; 

const plt = {
  tcpServer: aim.tcpServer(config.plt, {
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
      const selector = getPart(10).trim();
      getPart(14);
      console.log(`Ontvangen: "${selector}"`);
      switch(selector) {
        case 'JobInfo': {
          function finishedCartons() {
            aim.tcpClient(config.pnode, aim.tcpMessage('FinishedCart', schemas.finishedCartons.properties, {
              JobID: '',
              NumberOfFinishedCartons: 24,
              BoxQtyActual: 234,
            }))
          }
          function rejects() {
            aim.tcpClient(config.pnode, aim.tcpMessage('Rejects', {
              JobID: {
                length: 40,
                name: 'JobID',
              },
              RejectReasonCode: {
                length: 40,
                name: 'RejectReasonCode',
              },
              Quantity: {
                length: 40,
                name: 'Quantity',
              }
            }, {
              JobID: '',
              RejectReasonCode: 24,
              Quantity: 4,
            }))
          }
          function requestBoxInfo() {
            aim.tcpClient(config.pnode, aim.tcpMessage('RequestBoxInfo', {
            }, {
            }))
          }
          setTimeout(finishedCartons, 1000);
          setTimeout(finishedCartons, 2000);
          setTimeout(rejects, 2500);
          setTimeout(finishedCartons, 3000);
          setTimeout(rejects, 3500);
          setTimeout(finishedCartons, 4000);
          setTimeout(requestBoxInfo, 2000);
        }
      }
    }
  })
};

aim.tcpClient(config.pnode, aim.tcpMessage('JobChange             no:', schemas.jobChange.properties, {
  DataCount: 5,
  JobID: 'fdsgsdfgs',
}));




// (function({host,port}) {
//   const client = new net.Socket();
//   const plt = {
//     jobchange() {
//       client.write(aim.tcpMessage(
//         'JobChange',
//         schemas.jobChange.properties,
//         {
//           DataCount: 5,
//           JobID: 'fdsgsdfgs',
//           JobRun
//         },
//       ));
//     },
//     rejects() {
//       client.write(aim.tcpMessage(
//         'Reject',
//         schemas.jobChange.properties,
//         {
//           jobID: 'fdsgsdfgs',
//           rejectReasonCode: 1,
//           quantity: 4,
//         },
//       ));
//     },
//   }
//   client.connect(port, host, () => {
//     console.log(`Connected to server at ${host}:${port}`);
//     (function start() {
//       setTimeout(plt.jobchange, 2000);
//       // setTimeout(plt.finishedCartons, 4000);
//       setTimeout(plt.rejects, 6000);
//       setTimeout(start, 10000);
//     })()
//   });
//   client.on('data', (data) => {
//     console.log('Received from server: ' + data.toString());
//     // client.destroy(); // comment dit uit als je automatisch wil sluiten
//   });
//   client.on('close', () => console.log('Connection closed'));
//   client.on('error', (err) => console.error('Connection error: ', err.message));
// })(config.pnode);


