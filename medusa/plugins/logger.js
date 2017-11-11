(function(){
    function Logger()
    {
        var canLog = true;
        var loggers = {};
        var history = [];

        var init = function()
        {
            loggers['devtools'] = window.console;
        };

        this.track = function(event, message)
        {
            this.log('[' + event + '] : ' + message);
        };

        this.canLog = function()
        {
            return canLog;
        };

        this.log = function(message)
        {
            if(this.canLog() && Object.keys(loggers).length){

                for(var i in loggers){
                    if(! loggers.hasOwnProperty(i)) continue;

                    loggers[i].log(message);
                }
            }
            history.push(message);
        };

        this.getHistory = function()
        {
          return history;
        };

        this.warn = this.log;
        this.error = this.log;
        this.info = this.log;
        this.count = this.log;

        this.getLoggers = function()
        {
            return loggers;
        };

        init();
    };

    Hub.extend('logger', new Logger());
})();
