const command_utils = require('../utils/command.js');

var stationsFile = require('../resources/stations.json');
var stations = stationsFile.stations;

exports.run = function (bot, ctx) {
    var args = command_utils.getArgs(ctx.message.text);
    for (let i = 0; i < args.length; i++) {
        args[i] = args[i].toUpperCase();
    }

    console.log(args);

    if (args.length == 0) sendAllStations();
    else if (args[0] == "A") sendSelectStation("A");
    else if (args[0] == "B") sendSelectStation("B");
    else if (args[0] == "C") sendSelectStation("C");
    else if (args[0] == "D") sendSelectStation("D");
    else sendError();

    function sendAllStations() {
        var reply = "Lista de estaciones de MetroValencia \n";
        stations.forEach(station => {
            reply += station.name + " - Area " + station.area + " (ID " + station.id + ") \n";
        });
        ctx.reply(reply);
    }

    function sendSelectStation(area) {
        var reply = "Lista de estaciones de MetroValencia - Zona + " + area + "\n";
        stations.forEach(station => {
            if (station.area == area) {
                reply += station.name + " (ID " + station.id + ") \n";
            }
        });
        ctx.reply(reply);
    }

    function sendError() {
        ctx.reply("404");
    }
}

