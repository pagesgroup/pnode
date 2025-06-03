/**
 * --------------------------------------------------------------
 * Description:
 * Polymac Node Controller test application 
 * Opstarten om alleen PLT te tseten
 * 
 * Run script as main application
 * 
 * Author: Max van Kampen
 * Created: 30-05-2025
 * Updated: 30-05-2025
**/
console.log('Polymac Node Controller');
const aim = require('../src/aim');
const config = aim.loadConfig();
const {schemas} = config;
function ondata(data) {
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
  const prefix = getPart(23).split(' ');
  const selector = prefix.shift().toLowerCase().trim();
  // getPart(3);
  console.log(`Ontvangen: "${selector}"`);
  switch(selector) {
    case 'jobchange': {
      aim.tcpClient(config.plt, aim.tcpMessage2('Job', schemas.jobInfo.properties, {
        JobIDCurrent: '62514-C310M-HDWHIML-A181',
        MaterialID: 'C310M-HDWHIML-D043',
        LBLNAME: 'IMLC310M-SELLEYS-043',
        LBLBARCODECurrent: '123456789',
        IMLBARCODECurrent: '123456789',
        IMLBARCODELOCCurrent: 'T',
        DesiredYieldCurrent: '4800',
        JobIDNext: '62514-C310M-HDWHIML-A182',
        LBLBARCODENext: '123456789',
        IMLBARCODENext: '123456789',
        IMLBARCODELOCNext: 'B',
        DesiredYieldNext: '2400',
        DateTime: '20250602_152834',
      }))
    }
    case 'finishedcart': {
      // aim.tcpClient(config.bp, aim.tcpMessage('Received', {}, {}))
    }
    case 'rejects': {
      // aim.tcpClient(config.bp, aim.tcpMessage('Received', {}, {}))
    }
    case 'requestboxinfo': {
      console.log('send pack info');
      aim.tcpClient(config.bp, aim.tcpMessage2('Job', {
        JobID: {
          length: 40,
          name: 'JobID',
        },
        MaterialID: {
          length: 40,
          name: 'JobID',
        },
        LBLBARCODE: {
          length: 40,
          name: 'JobID',
        },
        LBLNAME: {
          length: 120,
          name: 'JobID',
        },
        DateTime: {
          length: 16,
          name: 'JobID',
        },
      }, {
        JobID: '62514-C310M-HDWHIML-A181',
        MaterialID: 'C310M-HDWHIML-D043',
        LBLBARCODE: '123456789',
        LBLNAME: 'IMLC310M-SELLEYS-043',
        DateTime: '20250602_152834',
      }))
    }
  }
}
const pnode = {
  tcpServer: aim.tcpServer(config.pnode, {ondata}),
  tcpServerBs: aim.tcpServer(config.pnodeBs, {ondata}),
};

setTimeout(e => {
      aim.tcpClient(config.plt, aim.tcpMessage2('Err', {
        ErrorCode: {
          length: 40,
        },
        ErrorMessage: {
          length: 40,
        },
        JobID: {
          length: 40,
        },
        JobRun: {
          length: 40,
        },
        JobIDAspect: {
          length: 40,
        },
        JobRunAspect: {
          length: 40,
        },
      }, {
        ErrorCode: 'ER001',
        ErrorMessage: 'Bla bla',
        JobID: '62514-C310M-HDWHIML-A181',
        JobRun: '1',
        JobIDAspect: '62514-C310M-HDWHIML-A181',
        JobRunAspect: '1',
      }))
},2000)