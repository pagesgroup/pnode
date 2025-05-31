const url = new URL(document.location);
const mqttbroker = url.searchParams.get('mqttbroker') || 'aliconnect.nl';
const mqttport = +url.searchParams.get('mqttport') || 1884;
const useSSL = true;//url.searchParams.get('ssl') ? true : false;
const path = 'polymac/210123-53084127-A96C-4D2C-9835-90E684BE06EA';

function csvToJson(text) {
  var rows = text.split(/\r\n|\n/).map(r => r.replace(/\"$/,'').split(/\",\"|\",|,\"|,/));
  var cols = rows.shift();
  console.log({cols});
  var rows = rows.map(r => Object.fromEntries(cols.map((name,i) => [name,String(r[i]||'').trim()])));
  return rows;
}

function setValue(topic, value) {
  const message = new Paho.MQTT.Message(typeof value == 'object' ? JSON.stringify(value) : String(value));
  message.destinationName = path+topic;
  mqttClient.send(message);
}
var mqttClient = new Paho.MQTT.Client(mqttbroker, mqttport, "myclientid_" + parseInt(Math.random() * 100, 10));
mqttClient.onConnectionLost = function(responseObject) {
  console.error("connection lost: " + responseObject.errorMessage);
};
mqttClient.onMessageArrived = function(message) {
  const {destinationName,payloadString} = message;
  const selector = destinationName.split(path).pop();
  // console.debug(selector, '=', payloadString);
  console.debug(selector);
  switch (selector) {
    case '/aspect/jobchange': {
      $('#jobchange').text(selector,payloadString);
      return;
    }
    case '/aspect/rejects': {
      $('#jobchange').text(selector,payloadString);
      return;
    }
    case '/aspect/finishedcartons': {
      $('#jobchange').text(selector,payloadString);
      return;
    }
    case '/aspect/jobinfo': {
      const rows = JSON.parse(payloadString);
      console.debug(rows);
      $('table>tbody').clear().append(
        rows.map(row => $('tr').append(
          $('td').text(row.JobID),
          $('td').text(row.JobRun),
          $('td').text(row.DesiredYield),
          $('td').text(row.MaterialID),
          $('td').text(row.ScheduleIndex),
          $('td').text(row.LBLBARCODE),
          $('td').text(row.LBLNAME),
          $('td').text(row.IMLBARCODE),
          $('td').text(row.IMLBARCODELOC),
          $('td').text(row.Status),
        ))
      );
      return;
    }
  }
};
var options = {
  useSSL,
  timeout: 3,
  onSuccess(e) {
    console.log("mqtt connected",this);
    mqttClient.subscribe(`${path}/#`, { qos: 1 });
  },
  onFailure(message) {
    console.log("Connection failed: " + message.errorMessage);
  }
};
mqttClient.connect(options);

pnode = {
  filehandle(file){
    if (file) {
      const ext = file.name.split('.').pop();
      const reader = new FileReader();
      reader.onerror = function() {
        output.textContent = 'Error reading file!';
      };
      if (ext == 'csv') {
        reader.onload = function(event) {
          const {result} = event.target;
          const rows = csvToJson(result);
          setValue('/aspect/batchdata', {
            rows,
            source: file.name,
          })
        };
        reader.readAsText(file);
      }
      if (ext == 'xlsx') {
        reader.onload = function(event) {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const result = {};
          workbook.SheetNames.forEach(schemaName => {
            const wbsheet = workbook.Sheets[schemaName];
            if (!wbsheet['!ref']) return;
            const [start,end] = wbsheet['!ref'].split(':');
            const [end_colstr] = end.match(/[A-Z]+/);
            const [rowcount] = end.match(/\d+$/);
            const col_index = XLSX.utils.decode_col(end_colstr);
            const colnames = [];
            const rows = [];
            for (var c=0; c<=col_index; c++) {
              var cell = wbsheet[XLSX.utils.encode_cell({c,r:0})];
              colnames[c] = cell ? String(cell.v) : 'col'+c;
            }
            for (var r=1;r<rowcount;r++) {
              const row = {};
              for (var c=0; c<=col_index; c++) {
                var cell = wbsheet[XLSX.utils.encode_cell({c,r})];
                if (cell) {
                  row[String(colnames[c])] = cell.v;
                  // row[colnames[c]] = cell.v;
                }
              }
              rows.push(row);
            }
            result[schemaName] = rows;
          })
          // console.log({result});
          setValue('/aspect/batchdata', {
            rows: result.Data,
            source: file.name,
          })
        }
        reader.readAsArrayBuffer(file);
      }
    } else {
      output.textContent = 'No file dropped.';
    }
  },
  app: {
    init() {
      $(document.body).append(
        $('nav').append(
          $('input').type('file').on('change', (e) => pnode.filehandle(e.target.files[0])),
        ),
        $('main').append(
          $('div').id('jobchange'),
          $('table').class('grid').style('white-space:nowrap;').append(
            $('thead').append(
              $('th').text('JobID'),
              $('th').text('JobRun'),
              $('th').text('DesiredYield'),
              $('th').text('MaterialID'),
              $('th').text('ScheduleIndex'),
              $('th').text('LBLBARCODE'),
              $('th').text('LBLNAME'),
              $('th').text('IMLBARCODE'),
              $('th').text('IMLBARCODELOC'),
              $('th').text('Status'),
            ),
            $('tbody'),
          ),
        ).on('dragover', (e) => {
          e.preventDefault();
          e.target.classList.add('hover');
        }).on('dragleave', (e) => {
          e.target.classList.remove('hover');
        }).on('drop', (e) => {
          e.preventDefault();
          e.target.classList.remove('hover');
          const file = e.dataTransfer.files[0];
          // console.log({file})
          pnode.filehandle(e.dataTransfer.files[0]);
          
        }),
      )
    },
  }
}

window.addEventListener('load', e => pnode.app.init());
