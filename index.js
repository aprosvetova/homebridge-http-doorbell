var Service;
var Characteristic;
var http = require('http');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerPlatform("homebridge-http-doorbell", "http-doorbell", HTTPDoorbell);
};

function HTTPDoorbell(log, config) {
    this.log = log;
    this.port = config.port;
    this.bells = config.doorbells;
    this.bellsAccessories = [];
    var self = this;
    this.server = http.createServer(function(request, response) {
        self.httpHandler(self, request.path.substring(1));
        response.end('Handled');
    });
    this.server.listen(this.port, function(){
        self.log("Doorbell server listening on: http://<your ip goes here>:%s/<doorbellId>", self.port);
    });
}

HTTPDoorbell.prototype.accessories = function (callback) {
    var foundAccessories = [];
    var count = this.bells.length;
    for (index = 0; index < count; index++) {
        var accessory = new DoorbellAccessory(this.bells[index]);
        if (accessory.doorbellId == 0) {
            accessory.doorbellId = index+1;
        }
        this.bellsAccessories[this.bells[index].doorbellId] = accessory;
        foundAccessories.push(accessory);
    }
    callback(foundAccessories);
}

HTTPDoorbell.prototype.httpHandler = function(that, doorbellId) {
    that.bellsAccessories[doorbellId].ring();
};

function DoorbellAccessory(config) {
    this.name = config["name"];
    this.duration = config["duration"] || 2;
    this.doorbellId = config["id"] || 0;
    this.binaryState = 0;
    this.service = null;
    this.timeout = null;
}

DoorbellAccessory.prototype.getServices = function() {
    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Manufacturer, "Doorbells Inc.")
        .setCharacteristic(Characteristic.Model, "HTTP Doorbell")
        .setCharacteristic(Characteristic.SerialNumber, this.doorbellId);
    this.service = new Service.MotionSensor(this.name);
    this.service
        .getCharacteristic(Characteristic.MotionDetected)
        .on('get', this.getState.bind(this));
    return [informationService, this.service];
}

DoorbellAccessory.prototype.getState = function(callback) {
    callback(null, this.binaryState > 0);
}

DoorbellAccessory.prototype.ring = function() {
    this.binaryState = 1;
    this.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(this.binaryState == 1);
    if (this.timeout) {
        clearTimeout(this.timeout);
    }
    var self = this;
    this.timeout = setTimeout(function() {
        self.binaryState = 0;
        self.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(self.binaryState == 1);
        self.timeout = null;
    }, self.duration * 1000);
}