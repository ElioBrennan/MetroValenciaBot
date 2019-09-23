const command_utils = require('../utils/command.js');
const accent_utils = require('../utils/accents.js');
const stringSimilarity = require('string-similarity');

var stationsFile = require('../resources/stations.json');
var stations = stationsFile.stations;

exports.run = function (bot, ctx) {
    var args = command_utils.getArgs(ctx.message.text);
    var station_arg = "";
    args.forEach(arg => {
        station_arg += arg.toLowerCase() + " ";
    });
    station_arg = accent_utils.removeAccents(station_arg);
    var similarStations = [];
    stations.forEach(station => {
        var station_name = accent_utils.removeAccents(station.name.toLowerCase());
        if (stringSimilarity.compareTwoStrings(station_name, station_arg) > 0.55)
            similarStations.push(station);
    });
    if (similarStations.length == 1) {
        showStationInfo(similarStations[0]);
    } else if (similarStations.length == 0) {
        ctx.reply("No he encontrado ninguna estación con este nombre :(")
    } else {
        ctx.reply("He encontrado varias coincidencias con tu búsqueda:");
        showStations(similarStations);
    }

    function showStations(similarStations) {
        similarStations.forEach(station => {
            showStationInfo(station);
        });
    }

    function showStationInfo(station) {
        ctx.reply("Nombre de la estación: " + station.name + "\n"
            + "Línea/s: " + station.line + "\n"
            + "Zona: " + station.zone);
    }
}
