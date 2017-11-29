function Component(settings)
{
    this.id = 0;
    this.extensions = {};

    var init = function(settings)
    {
        this.prepareExtensions();

        for(var option in settings){
            if(this.hasOwnProperty(option) && typeof this[option] !== 'function'){
                this[option] = settings[option];
            }
        }

        this.log('initialized', settings);
    };

    this.prepareExtensions = function()
    {
        if(! (Component.prototype.hasOwnProperty('extensions') && Object.keys(Component.prototype.extensions).length)) return false;

        for(var extension in Component.prototype.extensions) this.extend(extension, Component.prototype.extensions[extension]);
    };

    this.getId = function(){
        return this.id;
    };

    this.setId = function(id)
    {
        this.log('property_changed', { prop: 'id', previous: this.id, current: id });
        this.id = id;
    };

    this.log = function(event, record){
        if(this.history) this.history.save(event, record);
    };

    this.extend = function(id, fn)
    {
        if(this.extensions.hasOwnProperty(id)) return false;

        var extension = typeof fn === 'function' ? new fn() : fn;
        this.extensions[id] = extension;

        this[id] = extension;
    };

    init.call(this, settings);
};

function History()
{
    var history = {};

    this.find = function(tag)
    {
      return (tag && history.hasOwnProperty(tag)) ? history[tag] : history;
    };

    this.save = function(tag, data)
    {
        var record = History.prototype.tags.hasOwnProperty(tag) ? History.prototype.tags[tag].call(this, data) : { message: tag };

        this.add(tag, record);
    };

    this.add = function(tag, record)
    {
        if(! history.hasOwnProperty(tag)) history[tag] = [];
        history[tag].push(record);
    };
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
        this.log('property_changed', { prop: 'price', previous: this.price, current: price });
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

Component.prototype.extensions = {
    'history': History
};

History.prototype.tags = {
    'initialized': function(data){
        var record = { message: 'Component has been initialized ' };

        if(data && Object.keys(data).length){
            record.message += 'with settings';
        }else{
            record.message += 'without settings';
        }

        return record;
    },

    'property_changed': function(data){
        var record = { message: 'Component has changed property '};

        record.message += '[' + data.prop + '] ';
        record.message += 'from ' + data.previous + ' to ' + data.current;

        return record;
    }
};

PriceAggregator.prototype.filters = {
    'total': function(aggregator){
        var price = 0;

        aggregator.getComponents(function(component){
            price += component.getPrice();
        });

        return price;
    },
    'sum': function(aggregator, component_ids){
        var sum = 0;

        for(var i in component_ids){
            var component = aggregator.findComponentById(component_ids[i]);

            if(component){
                sum += component.getPrice();
            }
        }

        return sum;
    }
};