function PriceAggregator()
{
  var components = {};
  var baseLine = 0;
  var filters = {};

  this.init = function()
  {
    this.registerFilter('total', TotalPriceFilter);
  };

  this.getPrice = function(filterId)
  {
    var filter = filterId ? this.getFilterById(filterId) : this.getDefaultFilter();
    var price = filter.call(this, this);

    return price > baseLine ? price : baseLine;
  };

  this.getComponents = function(fn)
  {
      if(typeof fn === 'function'){ for(var i in components){ fn.call(this, components[i]); } }

      return components;
  };

  this.addComponent = function(component)
  {
    if(! (component instanceof PriceComponent)) throw new Error('Must be instance of PriceComponent!');

    var id = component.getId();

    components[id] = component;
  };

  this.setBaseLine = function(price)
  {
    baseLine = price;
  };

  this.registerFilter = function(id, fn)
  {
    filters[id] = fn;
  };

  this.findComponentById = function(id)
  {
    return components[id];
  };

  this.getFilterById = function(id)
  {
      return filters[id];
  };

  this.getDefaultFilter = function()
  {
      return this.getFilterById('total');
  };

  this.getSumOfComponents = function(component_ids)
  {
      var sum = 0;

      for(var i in component_ids){
          var component = this.findComponentById(component_ids[i]);

          if(component){
              sum += component.getPrice();
          }
      }

      return sum;
  };
};

function PriceComponent(settings)
{
  var price;
  var id;

  var init = function(){
      if(settings){
          if(settings.hasOwnProperty('price')) price = settings.price;
          if(settings.hasOwnProperty('id')) id = settings.id;
      }
  };

  this.getId = function()
  {
    return id;
  };

  this.getPrice = function()
  {
    return price;
  };

  this.setPrice = function(newPrice)
  {
    price = newPrice;
  };

  init();
};

function TotalPriceFilter(aggregator)
{
    var price = 0;

    aggregator.getComponents(function(component){
        price += component.getPrice();
    });

    return price;
};