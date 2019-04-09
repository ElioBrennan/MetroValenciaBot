var stationsFile = require('../resources/stations.json');
var stations = stationsFile.stations;

exports.run = function (bot, ctx) {
    var reply = "";
    stations.forEach(station => {
        reply += station.name + " (ID " + station.id + ") \n";
    });
    ctx.reply(reply);
}