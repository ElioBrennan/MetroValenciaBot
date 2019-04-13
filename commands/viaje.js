const command_utils = require('../utils/command.js');
const accent_utils = require('../utils/accents.js');
const best_station_utils = require('../utils/best_station.js');
const stationsFile = require('../resources/stations.json');
const stations = stationsFile.stations;

const request = require('request');
const cheerio = require('cheerio');

exports.run = function (bot, ctx) {
    var args = command_utils.getArgs(ctx.message.text);
    var from = args[0].toLowerCase();
    from = accent_utils.removeAccents(from);
    var to = args[1].toLowerCase();
    to = accent_utils.removeAccents(to);
    if (!from || !to) return ctx.reply("Por favor, introduce la estación de origen y la estación de destino :(");
    var now = new Date();
    var day = args[2];
    if (!day || day == "-") day = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
    var hour = args[3];
    if (!hour || hour == "-") hour = now.getHours() + ":" + now.getMinutes();
    var from_id = best_station_utils.bestStation(from, stations);
    var to_id = best_station_utils.bestStation(to, stations);
    if (!from_id) return ctx.reply("La estación de origen no existe :( Por favor, escribe una estación correcta");
    if (!to_id) return ctx.reply("La estación de destino no existe :( Por favor, escribe una estación correcta");
    if (from_id == to_id) return ctx.reply("Por favor, introduce dos estaciones diferentes :(");

    request('https://www.metrovalencia.es/planificador.php?page=142', function (err, resp, html) {
        if (err) return ctx.reply("Algo ha ocurrido en la búsqueda :( Por favor, inténtalo mas tarde");
        const $ = cheerio.load(html);
        $('#par1').find('option').each((i, op) => {
            $(op).removeAttr('selected');
            if (from_id == $(op).val()) {
                $(op).attr('selected', 'selected');
            }
        });
        $('#par2').find('option').each((i, op) => {
            $(op).removeAttr('selected');
            if (to_id == $(op).val()) {
                $(op).attr('selected', 'selected');
            }
        });
        $('#hour').attr('value', hour);
        $('#date').attr('value', day);
    });

}