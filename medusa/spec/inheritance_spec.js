describe('Inheritance', function(){
    var foo, bar;



    describe('foo inherits Bar::getName from prototype', function(){
        /**
         * 1. Наслідувати усі поля, але якщо таке поле вже існує або метод тоді не перезаписувати
         */
        it('Example A', function(){
            function Foo(){
                this.name = 'foo';
            };

            function Bar(){
                this.name = 'bar';

                /**
                 * метод не буде доступний для наслідування, так як знаходиться поза prototype chain
                 */
                //this.getName = function(){ return this.name; };
            };
            /**
             * Добавляємо метод в ланцюг прототипування і вуаля
             */
            Bar.prototype = {
              getName: function(){ return this.name; }
            };

            Foo.prototype = Object.create(Bar.prototype); // TODO:
            Foo.prototype.constructor = Foo; // TODO:

            var foo = new Foo();

            expect(foo.getName()).toEqual('foo');
        });

        it('Example B', function(){
            function Foo(){
                /**
                 * викликаємо батьківський конструктор саме вгорі, бо інакше поля в поточному класі будуть перетерті
                 * батьківськими полями
                 */
                Bar.call(this);

                this.name = 'foo';
            };

            function Bar(){
                this.name = 'bar';

                this.getName = function(){ return this.name; };
            };
            /**
             * В даному випадку наслідувати ланцюжок немає сенсу
             */
            // Foo.prototype = Object.create(Bar.prototype);
            // Foo.prototype.constructor = Foo;

            var foo = new Foo();

            expect(foo.getName()).toEqual('foo');
        });
    });
});