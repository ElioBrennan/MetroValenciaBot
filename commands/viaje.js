const command_utils = require('../utils/command.js');
const accent_utils = require('../utils/accents.js');
const best_station_utils = require('../utils/best_station.js');
const stationsFile = require('../resources/stations.json');
const stations = stationsFile.stations;

const request = require('request');
const moment = require('moment');

exports.run = function (bot, ctx) {
    var args = command_utils.getArgs(ctx.message.text);
    var from = args[0].toLowerCase();
    from = accent_utils.removeAccents(from);
    var to = args[1].toLowerCase();
    to = accent_utils.removeAccents(to);
    if (!from || !to) return ctx.reply("Por favor, introduce la estación de origen y la estación de destino :(");
    var now = new Date();
    var day = args[2];
    if (!day || day == "-") day = (now.getMonth() + 1) + "/" + now.getDate() + "/" + now.getFullYear();
    var hour = args[3];
    if (!hour || hour == "-") hour = now.getHours() + ":" + now.getMinutes();
    var from_station = best_station_utils.bestStation(from, stations);
    var to_station = best_station_utils.bestStation(to, stations);
    if (!from_station) return ctx.reply("La estación de origen no existe :( Por favor, escribe una estación correcta");
    if (!to_station) return ctx.reply("La estación de destino no existe :( Por favor, escribe una estación correcta");
    if (from_station == to_station) return ctx.reply("Por favor, introduce dos estaciones diferentes :(");
    request("https://dev.virtualearth.net/REST/v1/Routes/transit?" +
        "key=AtvNLfKma-ywMjrZEisNmLBO3OmdDX1UAw9szPVLsZM4P7Y0DIg-Gyw7GKEhbuRv&" +
        "o=json&" +
        "fi=true&" +
        "errorDetail=true&" +
        "wp.0=" + from_station.location + "&" +
        "wp.1=" + to_station.location + "&" +
        "ig=true&" +
        "ra=routepath,transitStops,routeInfoCard,TransitFrequency&" +
        "du=km&" +
        "dt=" + day + "%20" + hour + "&" +
        "tt=departure&" +
        "maxSolns=1&" +
        "rpo=Points", function (err, resp, html) {
            if (err) return ctx.reply("Ha ocurrido algún error en la búsqueda :( Por favor, prueba mas tarde.");
            var route = JSON.parse(html);
            var resources = route.resourceSets[0].resources[0];
            var distance = Math.trunc(resources.travelDistance) + " km";
            var duration = Math.trunc((resources.travelDuration / 60)) + " min";
            var path = resources.routeLegs[0].itineraryItems;
            var reply = "Ir de " + from_station.name + " hasta " + to_station.name + "\n";
            reply += "-----------\n"; 
            path.forEach(element => {
                if (element.details[0].mode == "Transit") {
                    var departure = moment.parseZone(element.childItineraryItems[0].time).format("HH:mm:ss a");
                    var arrival = moment.parseZone(element.childItineraryItems[1].time).format("HH:mm:ss a");
                    reply += "Sal de " + element.transitStops[0].stopName + " a las " + departure + ", en dirección " + element.transitTerminus + "\n";
                    reply += "Llegarás a " + element.transitStops[element.transitStops.length - 1].stopName + " a las " + arrival + "\n";
                }
            });
            reply += "-----------\n"; 
            reply += "Información adicional del trayecto:\n"
            reply += "Día de salida: " + day + "\n";
            reply += "Hora de salida: " + hour + "\n";
            reply += "- Duración del viaje (aprox): " + duration + "\n";
            reply += "- Distancia recorrida (aprox): " + distance + "\n";
            ctx.reply(reply);
        }
    );
}