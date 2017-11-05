describe('Hub', function(){
    var extensions = $.hub.getExtensions();

    beforeEach(function(){
        $.extend({ jhub: new Hub() });
        $.jhub.extend('logger', extensions.logger);
    });

    describe('extend', function(){
        it('extend by object', function(){
            var extension = { foo: 42 };

            $.jhub.extend('bar', extension);

            expect($.jhub.bar).toEqual(extension);
        });

        it('extend by function', function(){
            var extension = function(){
                this.foo = 42;
            };

            $.jhub.extend('bar', extension);

            expect($.jhub.bar).toEqual(new extension());
        });

        it('get all available extensions', function(){
            var extension = function(){
                this.foo = 42;
            };

            $.jhub.extend('foo', extension);

            expect(Object.keys($.jhub.getExtensions()).length).toEqual(2);
            expect($.jhub.getExtensions()['foo']).toEqual(new extension);
        });

        it('extend by Dispatcher', function(){
            var extensions = $.hub.getExtensions();
            var fooManager  = { foo: 42 };

            $.jhub.extend('dispatcher', extensions.dispatcher);

            expect(typeof $.jhub.dispatcher.addManager === 'function').toBeTruthy();
            $.jhub.dispatcher.addManager('foo', fooManager);

            expect($.jhub.dispatcher.getManager('foo')).toEqual(fooManager);
        });
    });

    describe('publish', function(){
        it('creates event when publish', function(){
            $.jhub.publish('custom', function(){});

            expect(Object.keys($.jhub.getEvents()).length).toEqual(1);
            expect($.jhub.getEvents().hasOwnProperty('custom')).toBeTruthy();
        });

        it('keep publishing', function(){
            var data = { data: { foo: 42 }};

           $.jhub.publish('custom', data);

           expect($.jhub.getDelayedPublishing('custom')).toEqual(data);
        });

        it('runs all callbacks', function(){
           var obj = { foo: 2};

           $.jhub.publish('custom', { data: { foo: 2 } });

           $.jhub.subscribe('custom', function(data){
              obj.foo += data.data.foo;
           });

           $.jhub.subscribe('custom', function(data){
               obj.foo *= data.data.foo;
           });

           expect(obj.foo).toEqual(8);
        });
    });

    describe('subscribe', function(){
        it('handles errors thrown on callbacks', function(){
            $.jhub.publish('custom', {});
            $.jhub.subscribe('custom', function(){});
            expect($.jhub.getEvents()['custom'].callbacks.length).toEqual(1);

            $.jhub.subscribe('custom', function(){ throw new Error('You cannot pass!')});
            expect($.jhub.getEvents()['custom'].callbacks.length).toEqual(2);
        });

        it('creates event when subscribes on it', function(){
            $.jhub.subscribe('custom', function(){});

            expect(Object.keys($.jhub.getEvents()).length).toEqual(1);
            expect($.jhub.getEvents().hasOwnProperty('custom')).toBeTruthy();
        });

        it('different callbacks on same event', function(){
            expect(Object.keys($.jhub.getEvents()).length).toEqual(0);

            $.jhub.subscribe('custom', function(){});

            expect(Object.keys($.jhub.getEvents()).length).toEqual(1);

            $.jhub.subscribe('custom', function(){});

            expect(Object.keys($.jhub.getEvents()).length).toEqual(1);

            expect($.jhub.getEvents()['custom'].callbacks.length).toEqual(2);
        });

        it('same callback can subscribe only once', function(){
            var callback = function(){ return 'I am the same'; };

            $.jhub.subscribe('custom', callback);
            expect($.jhub.getEvents()['custom'].callbacks.length).toEqual(1);

            $.jhub.subscribe('custom', callback);
            expect($.jhub.getEvents()['custom'].callbacks.length).toEqual(1);
        });

        it('after publish', function(){
            var obj = { };
            $.jhub.publish('foo_called', { data: { foo: 'bar' }, message: 'foo was called'});
            $.jhub.subscribe('foo_called', function(){ obj.foo = 'bar'});

            expect(obj.hasOwnProperty('foo')).toBeTruthy();
        });

        it('before publish', function(){
            var obj = { };
            $.jhub.subscribe('foo_called', function(){ obj.foo = 'bar'});
            $.jhub.publish('foo_called', { data: { foo: 'bar' }, message: 'foo was called'});

            expect(obj.hasOwnProperty('foo')).toBeTruthy();
        });
    });
});