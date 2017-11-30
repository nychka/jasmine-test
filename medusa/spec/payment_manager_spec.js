describe('PaymentManager', function(){
    var paymentManager, paymentSystem, aggregator, component;

    beforeEach(function(){
        aggregator = new PriceAggregator();
        paymentManager = new PaymentManager();
        component = new PaymentSystem({ id: 1}, new PaymentGroup(paymentManager, 'foo'));
    });

    it('inherits Aggregator', function(){
        expect(paymentManager instanceof PriceAggregator).toBeTruthy();
    });

    describe('Stages', function(){
       describe('Initialization', function(){
           it('default', function(){
               var manager = new PaymentManager();

               expect(manager.history.find('initialized')).toEqual([{message: 'Component has been initialized without settings'}]);
           });
       });
    });
});