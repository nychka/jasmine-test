function FooService(){
    this.id = 'foo_service';
    this.mainWrapp = Hub.dispatcher.getManager('service').findById('ancillary').mainWrapp;
}

FooService.prototype = Object.create(ServiceInterface.prototype);
FooService.prototype.constructor = FooService;
FooService.prototype.changeCurrency = function(currency){ this.currency = currency; };
FooService.prototype.toggleService = function(bool){ bool ? this.mainWrapp.show() : this.mainWrapp.hide(); };

function BarService(){
    this.id = 'bar_service';
    this.mainWrapp = Hub.dispatcher.getManager('service').findById('ancillary').mainWrapp;
}

BarService.prototype = Object.create(ServiceInterface.prototype);
BarService.prototype.constructor = BarService;
BarService.prototype.changeCurrency = function(currency){ this.currency = currency; };
BarService.prototype.toggleService = function(bool){ bool ? this.mainWrapp.show() : this.mainWrapp.hide(); };

function ServiceHelper(klass)
{
    var service, instance;

    (function(){
        service = klass;
        instance = new service();
    })();

    return {
        getInstance: function(){ return instance; },
        removeMethod: function(method){ delete instance.constructor.prototype[method]; }
    };
};


servant = ServiceHelper(FooService);