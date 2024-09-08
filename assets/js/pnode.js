// var mqttport = 1338;
// var mqttport = 1884
// var mqttbroker = "localhost";
// var mqttbroker = "aliconnect.nl";
// var mqttbroker = "pol-dc01.polymac.intra";

const domain = 'polymac/pnode/';

console.log('PNode2');
window.addEventListener('load', async e => {
  const url = new URL(document.location);
  console.log({url});
  const mqttbroker = url.searchParams.get('mqttbroker');
  const mqttport = +url.searchParams.get('mqttport');
  const hmi = await fetch('https://aliconnect.nl/pagesgroup/pnode/assets/yaml/hmi').then(res => res.json());
  console.log(hmi);

  console.log({mqttbroker,mqttport});
  const pathname = url.searchParams.get('pathname') || url.pathname.substring(1).replace(/^.*pnode\//,'').toCamelCase();
  console.log({url,pathname});
  const path = {
    test(){
      var mqttClient = new Paho.MQTT.Client(mqttbroker, mqttport, "myclientid_" + parseInt(Math.random() * 100, 10));
      function setValue(topic,value){
        message = new Paho.MQTT.Message(String(value));
        message.destinationName = topic;
        mqttClient.send(message);
      }
      mqttClient.onConnectionLost = function (responseObject) {
        console.error("connection lost: " + responseObject.errorMessage);
      };
      let sourcepos,destpos,state;
      mqttClient.onMessageArrived = function (message) {
        console.debug(message.destinationName, '=', message.payloadString);
        // document.body.querySelectorAll(`input[name="${message.destinationName}"]`).forEach(el => el.value = message.payloadString);
        switch (message.destinationName) {
          case domain+'plc/state': {
            $('body>form>input[name="value2"]').value(message.payloadString);
          }
        }
      };
      var options = {
        // useSSL: url.protocol === "https:",
        useSSL: url.searchParams.get('ssl') ? true : false,
        timeout: 3,
        onSuccess() {
          console.log("mqtt connected");
          // Connection succeeded; subscribe to our topic, you can add multile lines of these
          mqttClient.subscribe('polymac/pnode/#', { qos: 1 });
        },
        onFailure(message) {
          console.log("Connection failed: " + message.errorMessage);
        }
      };
      mqttClient.connect(options);

      console.log('test');
      function writeHmi() {
        function toggle(e,i){
          // console.log(e.type);
          const state = e.type === 'mousedown';
          setValue(domain+'plc/state', state ? i+1 : 0);
        }
        $(document.body).append(
          $('div').class('hmi').append(
            hmi.buttons.map((row,i) => $('button').class(row.name || row.title).on('mousedown', e => toggle(e,i)).on('mouseup', e => toggle(e,i)).append(
              // $('span').text(row.title),
            ))
          ),
        );
      }
      writeHmi();
      $(document.body).append(
        $('div').class('hmi').append(
          hmi.buttons.map(row => $('div').append(
            $('span').text(row.title),
          ))
        ),
        $('div').text('Hello dit is test'),
        $('nav').append(
          $('button').text('Actie 1').on('click', e => {
            setValue(domain+'plc/state', $('body>form>input[name="value1"]').el.value);
            // $('body>form>input[name="value1"]').value(1);
          }),
          $('button').text('Actie 2').on('click', e => {
            // $('body>form>input[name="value1"]').value(2);
          }),
        ),
        $('form').append(
          $('input').type('number').name('value1').value(1).on('change', e => {
            setValue(domain+'plc/state', e.target.value);
          }),
          $('input').name('value2'),
        ),
      )
    },
    test2() {
      console.log('test2');
    },
  }
  if (path[pathname]) {
    document.title = pathname.toDisplayName() + ' - Polymac';
    return path[pathname]();
  }
  $(document.body).append(
    $('div').text('Hallo, dit is PNode'),
  )
})
