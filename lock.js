const awsIOT = require("aws-iot-device-sdk");
const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

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
        let myDoorLock = {
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

process.stdin.on("keypress", (str, key) => {
    let myDoorLock = "";
    if (key.ctrl && key.name === "c") {
        process.exit();
    }
    else {
        switch (key.name) {
            case "u":
                console.log("unlock");
                myDoorLock = { "state": { "desired": { "locked": false } } };
                clientTokenUpdate = thingShadows.update('ARAMCO-IOT-API-ST', myDoorLock);
                break;
            case "l":
                console.log("lock");
                myDoorLock = { "state": { "desired": { "locked": true } } };
                clientTokenUpdate = thingShadows.update('ARAMCO-IOT-API-ST', myDoorLock);
                break;
            default:
                console.log("Not Applicable");
                console.log(key);
                break;
        }

    }

});


