describe('PriceAggregator', function(){
    var aggregator, component;

    beforeEach(function(){
        aggregator = new PriceAggregator();
        component = new PriceComponent({ id: 'foo', price: 101 });
    });
    describe('PriceComponent', function(){
        describe('API', function(){
            it('getId', function(){
                expect(component.getId()).toEqual('foo');
            });
           it('getCost', function(){
               expect(component.getPrice()).toEqual(101);
           });
        });
    });
   describe('API', function(){
       beforeEach(function(){
          aggregator.init();
       });
      describe('getPrice', function(){
          it('has no components returns zero', function(){
              expect(aggregator.getPrice()).toEqual(0);
          });

          it('has one component', function(){
             component.setPrice(100);
             aggregator.addComponent(component);

             expect(aggregator.getPrice()).toEqual(100);
          });

          it('has to have positive price', function(){
             component.setPrice(-100);
             aggregator.addComponent(component);

             expect(aggregator.getPrice()).toEqual(0);
          });

          it('changes baseline', function(){
            aggregator.setBaseLine(300);
            component.setPrice(200);
            aggregator.addComponent(component);

            expect(aggregator.getPrice()).toEqual(300);
          });

          it('register filter', function(){
              component.setPrice(100);
              aggregator.addComponent(component);
             aggregator.registerFilter('basePrice', function(){
                return this.findComponentById('foo').getPrice() / 100 * 25;
             });

             expect(aggregator.getPrice('basePrice')).toEqual(25);
          });
      });

      describe('getComponents', function(){
          it('is collection of components', function(){
              expect(typeof aggregator.getComponents() === 'object').toBeTruthy();
          });

          it('with callback', function(){
              var foo = component;
              var bar = new PriceComponent({ id: 'bar' });
              var components = [foo, bar];
              var items = [];

              aggregator.addComponent(foo);
              aggregator.addComponent(bar);

              aggregator.getComponents(function(comp){
                  items.push(comp);
              });

              expect(components).toEqual(items);
          });

          it('without callback', function(){
              var foo = component;
              var bar = new PriceComponent({ id: 'bar' });
              var components = { foo: foo, bar: bar };

              aggregator.addComponent(foo);
              aggregator.addComponent(bar);

              expect(aggregator.getComponents()).toEqual(components);
          });
      });

      it('addComponent', function(){
          var item = new PriceComponent({ id: 'foobar', price: 10 });
          aggregator.addComponent(item);

          expect(aggregator.getComponents()).toEqual({ foobar: item });
      });
   });

   describe('Filters', function(){
       var foo, bar;

       beforeEach(function(){
           foo = new PriceComponent({ id: 'foo', price: 125});
           bar = new PriceComponent({ id: 'bar', price: 275});
       });

      it('totalPriceFilter', function(){
            var fn = function(aggregator){
                var price = 0;

                aggregator.getComponents(function(component){
                    price += component.getPrice();
                });

                return price;
            };

            aggregator.registerFilter('total', fn);
            aggregator.addComponent(foo);
            aggregator.addComponent(bar);

            expect(aggregator.getPrice()).toEqual(400);
      });

      describe('basePrice', function(){
          it('returns sum of payment_system and markup when no markup', function(){
              var payment_system = new PriceComponent({ id: 'payment_system', price: 200 });
              aggregator.addComponent(payment_system);

              var fn = function(aggregator){
                 return  aggregator.getSumOfComponents(['payment_system', 'markup']);
              };

              aggregator.registerFilter('base', fn);

              expect(aggregator.getPrice('base')).toEqual(200);
          });

          it('returns sum of payment_system and markup', function(){
              var payment_system = new PriceComponent({ id: 'payment_system', price: 200 });
              var markup = new PriceComponent({ id: 'markup', price: 300 });

              aggregator.addComponent(payment_system);
              aggregator.addComponent(markup);

              var fn = function(aggregator){
                  return  aggregator.getSumOfComponents(['payment_system', 'markup']);
              };

              aggregator.registerFilter('base', fn);

              expect(aggregator.getPrice('base')).toEqual(500);
          });
      });
   });
});