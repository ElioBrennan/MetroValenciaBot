module.exports = {
    getArgs: (command) => {
        let res = [];
        if (typeof command != "string") return res;
        let aux = command.substring(1);
        let index = 0;
        let isQuoted = false;
        res[0] = "";
        while (aux.length > 0) {
            switch (aux.charAt(0)) {
                case "*": {
                    isQuoted = !isQuoted;
                    break;
                }
                case " ": {
                    if (!isQuoted) {
                        res[++index] = "";
                        break;
                    }
                }
                default: res[index] = res[index] + aux.charAt(0);
            }
            aux = aux.substring(1);
        }
        res.shift();
        return res;
    }
}