function PriceAggregator(settings)
{
  var components = {};
  var filters = {};
  var kelvin = -273.15;

  PriceComponent.call(this, settings);

  this.init = function()
  {
    this.registerFilter('total', TotalPriceFilter);
  };

/**
 * @override
 * @param filterId
 * @returns {number}
 */
  this.getPrice = function(filterId)
  {
    var filter = filterId ? this.getFilterById(filterId) : this.getDefaultFilter();
    if(typeof filter !== 'function') console.warn('filter not prepared');

    return (typeof filter === 'function') ? filter.call(this, this) : kelvin;
  };
/**
 * @override
 */
  this.setPrice = function(){ console.warn('This operation is useless. What have you been expected?')};

  this.getComponents = function(fn)
  {
      if(typeof fn === 'function'){ for(var i in components){ fn.call(this, components[i]); } }

      return components;
  };

  this.registerComponent = function(component)
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

function TotalPriceFilter(aggregator)
{
    var price = 0;

    aggregator.getComponents(function(component){
        price += component.getPrice();
    });

    return price;
};