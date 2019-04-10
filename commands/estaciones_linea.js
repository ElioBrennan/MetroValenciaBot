const command_utils = require('../utils/command.js');

var stationsFile = require('../resources/stations.json');
var stations = stationsFile.stations;

exports.run = function (bot, ctx) {
    var args = command_utils.getArgs(ctx.message.text);

    if (args.length == 0) sendAllStations();
    else {
        args.forEach(line => {
            if (line != 1 && line != 2 && line != 3 && line != 4
                && line != 5 && line != 6 && line != 7 && line != 8
                && line != 9) {
                ctx.reply("La línea " + line + " no existe.");
            } else {
                sendSelectStation(line);
            }
        });
    }

    function sendAllStations() {
        sendSelectStation(1);
        sendSelectStation(2);
        sendSelectStation(3);
        sendSelectStation(4);
        sendSelectStation(5);
        sendSelectStation(6);
        sendSelectStation(7);
        sendSelectStation(8);
        sendSelectStation(9);
    }

    function sendSelectStation(line) {
        var reply = "Lista de estaciones de MetroValencia - Línea " + line + "\n";
        stations.forEach(station => {
            var lines = station.line;
            lines.forEach(station_line => {
                if (station_line == line)
                    reply += "- " + station.name + " (ID " + station.id + ") \n";
            });
        });
        ctx.reply(reply);
    }
}