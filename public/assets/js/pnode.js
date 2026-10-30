/**
 * PNode Web Library
 */
console.debug('PNode Loaded');
const pnode = {
    mqttClient: (config) => {
        const {
            mqttHmi,
            uid,
            // onMessageArrived, 
            clientId,
            subscribe,
            items,
        } = config;
        // console.log(config);
        const { useSSL, timeout, server, wsport } = mqttHmi;
        // const clientId = name + "_" + parseInt(Math.random() * 100, 10);
        function setValue(itemName, propertyName, value) {
            console.log({ items, itemName });
            const item = items.find(row => row.name === itemName);
            item.values[propertyName] = value;
            const message = new Paho.MQTT.Message(JSON.stringify(item.values));
            message.destinationName = `${uid}/${itemName}`;
            mqttClient.send(message);
            return value;
        }
        function setNameValue(itemName, value) {
            if (!mqttClient.isConnected()) return;
            // console.log('>', itemName, value);
            // const item = items.find(row => row.name === itemName);
            // item.values[propertyName] = value;
            const message = new Paho.MQTT.Message(JSON.stringify(value));
            message.destinationName = `${uid}/${itemName.replace(/\./g, '/')}`;
            // console.log({mqttClient});
            mqttClient.send(message);
            return value;
        }
        var mqttClient = new Paho.MQTT.Client(server, wsport, clientId);
        mqttClient.onConnectionLost = function (responseObject) {
            console.error("connection lost: " + responseObject.errorMessage);
        };
        // mqttClient.onMessageArrived = onMessageArrived;
        mqttClient.onMessageArrived = function (message) {
            const { destinationName, payloadString } = message;
            const parts = destinationName.split('/');
            parts.shift();
            const name = parts.join('/');
            let node = items;
            for (let i = 0; i < parts.length - 1; i++) {
                node = node[parts[i]] ??= {};
            }
            const key = parts.at(-1);
            try {
                node[key] = JSON.parse(payloadString);
            } catch {
                node[key] = payload;
            }
            console.log('<', name, node[key]);
            document.querySelectorAll(`[name="${name}"]`).forEach(e => {
                // console.log(e, e.type, e.checked, e.value, e.hasAttribute('checked'));
                if (e.type === 'checkbox') {
                    e.checked = Number(node[key]) === 1;
                } else {
                    $(e).value(node[key]);
                }
            });
            // document.querySelectorAll(`#${name}`).forEach(e => $(e).value(value));
            // document.querySelectorAll(`#${itemName}`).forEach(e => $(e).setAttribute(propertyName, value));


            // const itemName = message.destinationName.split('/').pop();
            // console.log(itemName, values);
            // const item = items.find(row => row.name === itemName);
            // Object.entries(values).forEach(([propertyName, value]) => {
            //     const name = [destinationName, propertyName].join('/').replace(/\//g,'_');
            //     documentUpdate();
            //     // console.log(name,propertyName,value);
            //     // document.querySelectorAll(`[name="${name}"]`).forEach(e => $(e).value(value));
            //     // document.querySelectorAll(`#${name}`).forEach(e => $(e).value(value));
            //     // document.querySelectorAll(`#${itemName}`).forEach(e => $(e).setAttribute(propertyName, value));
            // })

            // return;
            // console.debug(name, '=', value);
            // document.querySelectorAll(`[name="${name}"]`).forEach(e => $(e).value(value));
            // document.querySelectorAll(`#${name}`).forEach(e => $(e).value(value));
            // switch (name) {
            //     case 'alarms': {
            //         const binaryArray = parseInt(value).toString(2).split('').map(Number).reverse();
            //         console.log({ value, binaryArray });


            //         // console.log([value,value.toString(2),Number(value).toString(2)]);
            //         hmi.data.alarms.forEach((a, i) => {
            //             if (binaryArray[i]) {
            //                 if (!a.active) {
            //                     a.on = new Date();
            //                     a.active = 1;
            //                     a.off = null;
            //                     a.visible = true;
            //                 }
            //             } else {
            //                 a.active = 0;
            //                 a.off = a.off || new Date();
            //                 // a.on = null;
            //             }
            //         });
            //         // binaryArray.forEach((v,i) => hmi.data.alarms[i].checked = v ? 1 : 0);
            //         console.log(hmi.data.alarms)
            //         hmi.showAlarms();
            //         // $('section.alarms').clear().append(
            //         //   hmi.data.alarms.sort((a,b) => a.prio - b.prio).map(hmi.divalarm),
            //         // )
            //         return;
            //     }
            // }
        };
        var options = {
            useSSL,
            timeout,
            onSuccess(e) {
                console.log("mqtt connected");
                // alert('conn '+uid)
                // Subscribe to all topics under 'polymac/pnode/'
                subscribe.forEach(name => mqttClient.subscribe(uid + name, { qos: 1 }));
                // setNameValue(clientId, 1);
            },
            onFailure(message) {
                console.log("Connection failed: " + message.errorMessage);
            }
        };
        // if (location.protocol === 'http:') {
            mqttClient.connect(options);
        // }
        // mqttClient.connect(options);
        return {
            setValue,
            setNameValue,
            mqttClient,
        }
    },
}