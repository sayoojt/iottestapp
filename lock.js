const awsIOT = require("aws-iot-device-sdk");

const thingShadows = awsIOT.thingShadow({
    keyPath: "cert/client.key",
    certPath: "cert/client.crt",
    caPath: "cert/ca.crt",
    clientId: "ARAMCO-IOT-API",
    host: "a1rkn3nakoy20t-ats.iot.us-east-1.amazonaws.com"
});

let clientTokenUpdate;

console.log("Start IOT device !!!!");

thingShadows
    .on('error', function (error) {
        console.log('error', error);
    });

thingShadows
    .on('delta', function (thingName, stateObject) {
        console.log('received delta on ' + thingName + ': ' +
            JSON.stringify(stateObject));
        thingShadows.update(thingName, {
            state: {
                reported: stateObject.state
            }
        });
    });

thingShadows
    .on('timeout', function (thingName, clientToken) {
        console.warn('timeout: ' + thingName + ', clientToken=' + clientToken);
    });

thingShadows.on('connect', function () {
    console.log("Start Conx");
    thingShadows.register("ARAMCO-IOT-API-ST", {}, function () {
        const myDoorLock = {
            "state": { "desired": { "locked": false } }
        };
        clientTokenUpdate = thingShadows.update('ARAMCO-IOT-API-ST', myDoorLock);
    });
});

//report the status, update , get and delete
thingShadows.on("status",
    function (thingName, stat, clientToken, stateObject) {
        console.log("Receieved " + stat + " on " + thingName + " : " +
            JSON.stringify(stateObject));
    }
);


