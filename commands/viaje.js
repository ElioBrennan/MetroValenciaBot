const command_utils = require('../utils/command.js');
const accent_utils = require('../utils/accents.js');
const best_station_utils = require('../utils/best_station.js');
const stationsFile = require('../resources/stations.json');
const stations = stationsFile.stations;

const request = require('request');
const DOMParser = require('xmldom').DOMParser;

exports.run = function (bot, ctx) {
    var args = command_utils.getArgs(ctx.message.text);
    var from = args[0].toLowerCase();
    from = accent_utils.removeAccents(from);
    var to = args[1].toLowerCase();
    to = accent_utils.removeAccents(to);
    if (!from || !to) return ctx.reply("Por favor, introduce la estación de origen y la estación de destino :(");
    var now = new Date();
    var day = args[2];
    if (!day || day == "-") day = (now.getMonth() + 1) + "/" + now.getDate() + "/" +now.getFullYear();
    var hour = args[3];
    if (!hour || hour == "-") hour = now.getHours() + ":" + now.getMinutes();
    var from_station = best_station_utils.bestStation(from, stations);
    var to_station = best_station_utils.bestStation(to, stations);
    if (!from_station) return ctx.reply("La estación de origen no existe :( Por favor, escribe una estación correcta");
    if (!to_station) return ctx.reply("La estación de destino no existe :( Por favor, escribe una estación correcta");
    if (from_station == to_station) return ctx.reply("Por favor, introduce dos estaciones diferentes :(");
    request("https://dev.virtualearth.net/REST/v1/Routes/transit?" +
        "key=AtvNLfKma-ywMjrZEisNmLBO3OmdDX1UAw9szPVLsZM4P7Y0DIg-Gyw7GKEhbuRv&" +
        "o=xml&" +
        "jsonp=Microsoft.Maps.NetworkCallbacks.f86f67&c=es-ES&" +
        "fi=true&" +
        "errorDetail=true&" +
        "wp.0=39.464936,-0.338232&" +
        "wp.1=39.466063,-0.342974&" +
        "ig=true&" +
        "ra=routepath,transitStops,routeInfoCard,TransitFrequency&" +
        "du=km&" +
        "dt="+day+"%20"+hour+"&" +
        "tt=departure&" +
        "maxSolns=1&" +
        "rpo=Points", function (err, resp, html) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(html, "text/xml");
            console.log(xmlDoc);
        });
}