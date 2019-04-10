const command_utils = require('../utils/command.js');

var stationsFile = require('../resources/stations.json');
var stations = stationsFile.stations;

exports.run = function (bot, ctx) {
    var args = command_utils.getArgs(ctx.message.text);
    for (let i = 0; i < args.length; i++) {
        args[i] = args[i].toUpperCase();
    }

    if (args.length == 0) sendAllStations();
    else {
        args.forEach(zone => {
            if (zone != "A" && zone != "B" && zone != "C" && zone != "D") {
                ctx.reply("La zona " + zone + " no existe.");
            } else {
                sendSelectStation(zone);
            }
        });
    }

    function sendAllStations() {
        sendSelectStation("A");
        sendSelectStation("B");
        sendSelectStation("C");
        sendSelectStation("D");
    }

    function sendSelectStation(zone) {
        var reply = "Lista de estaciones de MetroValencia - Zona " + zone + "\n";
        stations.forEach(station => {
            if (station.zone == zone) {
                reply += "- " + station.name + " (ID " + station.id + ") \n";
            }
        });
        ctx.reply(reply);
    }
}

