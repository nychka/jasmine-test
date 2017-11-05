(function(){
    function PriceLogger()
    {
        var priceChangeLog = {};

        this.get = function () {
            return priceChangeLog;
        };

        this.set = function (key, price, msg) {
            priceChangeLog[key] = {};
            priceChangeLog[key]['price'] = price;
            priceChangeLog[key]['log'] = [];
            priceChangeLog[key]['log'].push(price + " (" + msg + ")");

            return price;
        };

        this.add = function (key, add, msg) {
            if (!priceChangeLog.hasOwnProperty(key)) {
                console.error('Price log for [' + key + '] is not initialized!');
                return 0;
            }

            priceChangeLog[key]['price'] += add;
            var log = priceChangeLog[key]['price']
                + "[" + ((add > 0) ? "+" : "") + add + "]"
                + " (" + msg + ")";
            priceChangeLog[key]['log'].push(log);

            return priceChangeLog[key]['price'];
        };
    };

    $.hub.extend('priceLog', new PriceLogger());
})();
