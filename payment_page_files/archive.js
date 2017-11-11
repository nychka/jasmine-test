function Archive()
{
    var storage = {};

    this.initialize = function(data)
    {
        Hub.logger.info('start initializing Archive');
        storage = data;
        Hub.publish('archive_initialized', { data: data, message: 'archive initialized with data length' });
    };

    this.getData = function()
    {
        return storage;
    };

    this.updateData = function(key, data)
    {
        $.extend(true, storage.data[key], data);
        Hub.publish('archive_updated', { data: data, message: 'archive key: ' + key + ' was updated' });
    };
};
$.extend({ archive: new Archive() });
Hub.publish('archive_loaded', { message: 'archive was loaded into jQuery', data: {} });
