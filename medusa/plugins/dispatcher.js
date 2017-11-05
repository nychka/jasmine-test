(function(){
    function Dispatcher()
    {
        var managers = {};
        var controllers = {};

        this.addManager = function(name, manager)
        {
            if(managers.hasOwnProperty(name)){ $.hub.logger.warn('manager with name: ' + name + ' already exist!'); return false; }

            managers[name] = manager;
        };

        this.getManager = function(name)
        {
            if(! managers.hasOwnProperty(name)){ $.hub.logger.warn('manager with name: ' + name + ' not found!'); }

            return managers[name];
        };

        this.addController = function(name, controller)
        {
            if(controllers.hasOwnProperty(name)){ $.hub.logger.warn('controller with name: ' + name + ' already exist!'); return false; }

            controllers[name] = controller;

            var event_name = name + '_controller';
            var envelope = {
                event: event_name + '_initialized',
                message: event_name + ' is initialized. Now call $.hub.dispatcher.getController(\'' + name + '\')'
            };
            $.hub.publish(envelope.event, envelope);
        };

        this.getController = function(name)
        {
            if(! controllers.hasOwnProperty(name)){ $.hub.logger.warn('controller with name: ' + name + ' not found!'); }

            return controllers[name];
        };
    };

    $.hub.extend('dispatcher', new Dispatcher());
})();

