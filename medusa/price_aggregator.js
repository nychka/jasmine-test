function PriceAggregator(settings)
{
  var components = {};
  var filters = {};

  PriceComponent.call(this, settings);

  var init = function()
  {
    var proto = PriceAggregator.prototype;

    for(var filter in proto.filters) this.registerFilter(filter, proto.filters[filter]);
  };

/**
 * @override
 * @param filterId
 * @returns {number}
 */
  this.getPrice = function(filterId, params)
  {
    var filter = filterId ? this.getFilterById(filterId) : this.getDefaultFilter();
    if(typeof filter !== 'function') console.warn('filter not prepared');

    return filter.call(this, this, params);
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

  init.call(this);
};

