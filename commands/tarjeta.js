const command_utils = require('../utils/command.js');
const request = require('request');

exports.run = function (bot, ctx) {
    var args = command_utils.getArgs(ctx.message.text);
    if (args.length == 0) {
        return ctx.reply("Por favor, introduce el número de tu tarjeta de MetroValencia.")
    }
    var card_number = ("" + args[0]).substring(0, 10);
    var api_call = 'https://metrovlcschedule.herokuapp.com/api/v1/card/' + card_number + '/balance';
    request(api_call, function (error, response, body) {
        if (error) return ctx.reply("Ha habido un error en la consulta con la base de datos :(. Por favor, inténtalo mas tarde");
        try {
            var res = JSON.parse(body);
            var reply = "- Tipo de tarjeta: " + res.cardZones + "\n";
            reply += "- Saldo: " + res.cardBalance;
            return ctx.reply(reply);
        } catch (error) {
            return ctx.reply("El número de tarjeta que has introducido es incorrecto :( Prueba a introducirlo de nuevo");
        }
    });
}