const awsIOT = require("aws-iot-device-sdk");

const thingShadows = awsIOT.thingShadows({
    keyPath: "/cert/client.key",
    certPath: "/cert/client.crt",
    caPath: "/cert/ca.crt",
    clientId: "ARAMCO-IOT-API",
    host: "a1rkn3nakoy20t-ats.iot.us-east-1.amazonaws.com"
});

let clientTokenUpdate;

console.log("Start IOT device !!!!");
thingShadows.on('connect', function () {
    console.log("Start Conx");
    thingShadows.register("myDoorLock", {}, function () {
        const myDoorLock = {
            "state": { "desired": { "locked": false } }
        };
        clientTokenUpdate = thingShadows.update('myDoorLock', myDoorLock);
    });
});

//report the status, update , get and delete
thingShadows.on("status",
    function (thingName, stat, clientToken, stateObject) {
        console.log("Receieved " + state + " on " + thingName + " : " +
            JSON.stringify(stateObject));
    }
);


