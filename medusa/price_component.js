function Component(settings)
{
    this.id = 0;
    this._history = {};

    var init = function(settings)
    {
        for(var option in settings){
            if(this.hasOwnProperty(option) && typeof this[option] !== 'function'){
                this[option] = settings[option];
            }
        }

        this.makeRecord('initialized', settings);
    };

    this.getId = function(){
        return this.id;
    };

    this.setId = function(id)
    {
        this.makeRecord('property_changed', { prop: 'id', previous: this.id, current: id });
        this.id = id;
    };

    this.getHistory = function(tag)
    {
      return (tag && this._history.hasOwnProperty(tag)) ? this._history[tag] : this._history;
    };

    this.makeRecord = function(tag, data)
    {
        var record = { message: tag };

        if(tag === 'initialized'){
            record.message = 'Component has been initialized ';

            if(data && Object.keys(data).length){
                record.message += 'with settings';
            }else{
                record.message += 'without settings';
            }
        }else if(tag === 'property_changed'){
            record.message = 'Component has changed property [' + data.prop + '] ';
            record.message += 'from ' + data.previous + ' to ' + data.current;
        }

        if(! this._history.hasOwnProperty(tag)) this._history[tag] = [];

        this._history[tag].push(record);
    };

    init.call(this, settings);
};

function PriceComponent(settings)
{
    this.price = 0;

    Component.call(this, settings);

    this.getPrice = function()
    {
        return this.price;
    };

    this.setPrice = function(price)
    {
        this.makeRecord('property_changed', { prop: 'price', previous: this.price, current: price });
        this.price = price;
    };
};

PriceComponent.prototype = Object.create(Component.prototype);
PriceComponent.prototype.constructor = PriceComponent;

PaymentSystem.prototype = Object.create(PriceComponent.prototype);
PaymentSystem.prototype.constructor = PaymentSystem;

PriceAggregator.prototype = Object.create(PriceComponent.prototype);
PriceAggregator.prototype.constructor = PriceAggregator;

PaymentManager.prototype = Object.create(PriceAggregator.prototype);
PaymentManager.prototype.constructor = PaymentManager;

BonusManager.prototype = Object.create(PriceAggregator.prototype);
BonusManager.prototype.constructor = BonusManager;