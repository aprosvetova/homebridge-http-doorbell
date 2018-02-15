var Service;
var Characteristic;
var http = require('http');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-http-doorbell", "http-doorbell", HTTPDoorbell);
};


function HTTPDoorbell(log, config) {
    this.log = log;
    this.name = config.name;
    this.port = config.port;
    this.duration = config.duration || 2;
    this.bell = 0;
    this.timeout = null;

    var that = this;
    this.server = http.createServer(function(request, response) {
        that.httpHandler(that);
        response.end('Handled');
    });

    this.informationService = new Service.AccessoryInformation();
    this.informationService
        .setCharacteristic(Characteristic.Manufacturer, "Doorbells Inc.")
        .setCharacteristic(Characteristic.Model, "HTTP Doorbell");

    this.service = new Service.Doorbell(this.name);
    this.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
        .on('get', this.getState.bind(this));

    this.server.listen(this.port, function(){
        that.log("Doorbell server listening on: http://<your ip goes here>:%s", that.port);
    });
}


HTTPDoorbell.prototype.getState = function(callback) {
    callback(null, this.bell);
};

HTTPDoorbell.prototype.httpHandler = function(that) {
    that.bell = 1;
    that.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(that.bell);
    if (that.timeout) {
        clearTimeout(that.timeout);
    }
    that.timeout = setTimeout(function() {
        that.bell = 0;
        that.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(that.bell);
        that.timeout = null;
    }, that.duration * 1000);
};

HTTPDoorbell.prototype.getServices = function() {
    return [this.informationService, this.service];
};