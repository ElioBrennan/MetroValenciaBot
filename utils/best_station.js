const stringSimilarity = require('string-similarity');
const accent_utils = require('../utils/accents.js');

module.exports = {
    bestStation: (station_name, stations) => {
        var stations_name = []
        stations.forEach(station => {
            var name = station.name.toLowerCase();
            name = accent_utils.removeAccents(name);
            stations_name.push(name);
        });
        var best = stringSimilarity.findBestMatch(station_name, stations_name);
        if (best.bestMatch.rating > 0.5) {
            best = best.bestMatch.target;
            var best_station;
            stations.forEach(station => {
                var name = station.name.toLowerCase();
                name = accent_utils.removeAccents(name);
                if (name == best) {
                    best_station = station;
                }
            });
            return best_station;
        } else {
            return undefined;
        }

    }
}