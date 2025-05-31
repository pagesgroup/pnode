const net = require('net');
const fs = require('fs');
const yaml = require('js-yaml');
const mqtt = require('mqtt');
// const config = yaml.load(fs.readFileSync('config/config.yaml', 'utf8'));

aim = {
  tcpMessage(selector,properties,values) {
    return selector.padEnd(23, ' ') + ':' + Object.entries(properties).map(
      ([name,prop]) => String(values[name]||'')
      .substring(0,prop.length)
      .padEnd(prop.length, ' ')
    ).join('');
  },
  loadJson(path) {
    const content = fs.readFileSync(path, 'utf8');
    return JSON.parse(content);
  },
  tcpServer(options,events) {
    const {host,port} = options;
    const server = net.createServer((socket) => {
      socket.on('data', events.ondata);
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
    server.listen(port, host, () => console.log(`Server gestart op host ${host} poort ${port}`));
    return server;
  },
  getTimestamp() {
    return new Date().toISOString().replace(/-|\:/g,'').substring(0,15);
  },
  loadConfig() {
    return this.config = yaml.load(fs.readFileSync('config/config.yaml', 'utf8'));
  },
  mqtt() {
    const {server,port,useSSL,timeout,root} = this.config.mqtt;
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
        mqttClient.publish(aim.config.root + topic, JSON.stringify(value));
      },
    }
  },
}

module.exports = aim;