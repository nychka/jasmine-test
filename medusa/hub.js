/**
 * Publish/Subscribe Event Broker
 *
 * @author Nychka Yaroslav
 * @email y.nychka@tickets.com.ua
 * @date 2.11.2017
 * @version 1.0.0
 *
 *
 *
 * function Foo(){
 *      $.hub.publish('hello_world_event', { data: { foo: 'bar' }, message: 'Foo is Bar' });
 * }
 *
 * function Bar(){
 *      $.hub.subscribe('hello_world_event', function(envelope){ console.log(envelope.message); });
 * }
 *
 * Foo(); // now event is published for all subscribers
 * Bar(); // as we've subscribed on event 'hello_world', run our callback and print message
 *
 * > Foo is Bar
 *
 */
function Hub()
{
    var events = {};
    var extensions = {};

    this.getEvents = function()
    {
        return events;
    };
    this.delayPublishing = function(event, data)
    {
        events[event]['publishing'] = data;
        this.track(event, data.message);
    };
    this.getDelayedPublishing = function(event)
    {
        return events[event].hasOwnProperty('publishing') && events[event]['publishing'];
    };
    this.checkEvent = function(event)
    {
        if(! events.hasOwnProperty(event)){
            events[event] = { callbacks: [] };
        }
    };
    this.subscribe = function(event, callback, context)
    {
        this.checkEvent(event);
        if(events[event].callbacks.indexOf(callback) === -1){
            if(typeof context === 'object') {
                callback = callback.bind(context);
            }
            var delayedPublishing = this.getDelayedPublishing(event);

            if(delayedPublishing) { try{ callback.call(this, delayedPublishing); }catch(e){console.error(e); } }

            events[event].callbacks.push(callback);
        }
    };
    this.publish = function(event, data)
    {
        this.checkEvent(event);
        this.delayPublishing(event, data);

        events[event].callbacks.forEach(function(callback){
            callback.call(this, data);
        });
    };

    this.trigger = function(event)
    {
        var package = this.getDelayedPublishing(event);

        if(package && package.data) $.hub.publish(event, { data: package.data, message: event + ' was triggered' });
    };

    this.extend = function(id, fn)
    {
        var extension = typeof fn === 'function' ? new fn() : fn;
        extensions[id] = extension;

        this[id] = extension;
    };

    this.track = function(event, message)
    {
        if(extensions.logger){
            extensions.logger.track(event, message);
        }else if(console && console.log){
            console.log(event, message);
        }
    };

    this.getExtensions = function()
    {
      return extensions;
    };
}

(function(){
    if(! $.hasOwnProperty('hub')){
        $.extend({ hub: new Hub() });
        console.log('Hub was successfully hosted as: $.hub. Now you can knitting everything with publish & subscribe methods');
    }else{
        console.log('Hub is loaded more than once - but it still works correct. Removing unnecessary script loading will speed up page loading.');
    }
})();

