describe('CardsPicker', function(){
    var picker, options, card;

    var element = $('<div></div>', { id: 'jasmine_cards_picker' });
    var select = $('<select></select>', { id: 'usbl_selector'});

    element.append(select);
    $('body').append(element);

    options = {
        wrapper: $('#jasmine_cards_picker'),
        pickerSelector:  'select',
        cards: [
            { number: "4363231111", group: 'otp' },
            { number: "4363231112", group: 'otp'},
            { number: "4363231113", group: 'default'},
            { number: "4363231114", group: 'custom'}
        ]
    };


    beforeEach(function(){
        picker = new CardsPicker(options);
        card =  { number: "4363231112", name: 'user_card', group: 'otp' };
    });

    describe('getWrapper', function(){
        it('is in DOM', function(){
            expect(picker.getWrapper()).toBeInDOM();
        });

        it('has correct wrapper', function(){
            expect(picker.getWrapper()).toEqual(options.wrapper);
        });
    });

    it('getPickerContainer', function(){
        picker.setup();

        expect(picker.getPickerContainer()).toExist();
    });

    describe('History plugin', function(){
       it('initialized', function(){

            expect(picker.history.find('initialized')).toEqual([{ message: 'Component has been initialized with settings' }]);
       });

       it('prepared', function(){
           picker.setup();

           expect(picker.history.find('prepared')).toEqual([{ message: 'Component has been prepared', data: { cards: picker.getCards() }}]);
       });
    });

    describe('State plugin', function(){
        describe('get', function(){
            it('when state registered', function(){
                picker.state.register('default', function(){
                   this.name = 'default';
                });
               expect(picker.state.get('default').name).toEqual('default');
            });

            it('when no state found', function(){
                expect(function(){
                    picker.state.get('fd');
                }).toThrow( State.prototype.errors.state_not_found('fd'));
            });
        });

       describe('getCurrent', function(){
           it('default', function(){
               expect(picker.state.getCurrent()).toEqual(picker.state.get('default'));
           });

           it('activated', function(){
               picker.state.register('activated', function(){
                   this.handle = function(){
                       picker.fakeState = 'foo';
                   }
               });

               expect(picker.fakeState).not.toBe('foo');

               picker.state.transitTo('activated');

               expect(picker.fakeState).toBe('foo');
           });
       });

       it('register', function(){
          picker.state.register('activated', function(){});

          expect(function(){
              picker.state.transitTo('activated');
          }).toThrow(State.prototype.errors.method_not_overloaded('handle'));
       });

       it('after component initialization transit to default state', function(){
          picker.setup();

          expect(picker.state.getCurrent().getId()).toEqual('default');
          expect(picker.history.find('state_changed').length).toEqual(1);
           expect(picker.history.find('state_changed')[0].message).toEqual('Component transits to state default');
       });
    });

    describe('setup', function(){
        it('prepare card options for picker container', function(){
            picker.settings.cards = [
                { number: "4363231112", name: 'user_card', group: 'otp' }
            ];
            picker.setup();

            expect(picker.getCards()).toEqual(picker.settings.cards);
        });

        xit('tries to add existing cards', function(){
            picker.settings.cards = [
                { number: "4363231112", name: 'user_card', group: 'otp' },
                { number: "4363231113", name: 'user_card', group: 'otp' }
            ];
            picker.setup();

            expect(picker.getCards()).toEqual(picker.settings.cards);
            expect(function(){
                picker.settings.cards = ["4363231111"];
                picker.setup();
            }).toThrow(new OtpCardsPickerAddSameCardError("4363231111"));
        });
    });

    describe('buildCardOption', function() {
        it('builds with valid card number 4363231112', function () {
            var text = "4363 23XX XXXX 1112";
            var value = "43631112";
            var option = picker.buildCardOption(card);

            expect(option.text()).toEqual(text);
            expect(option.val()).toEqual(value);
        });

        it('throws error when card number is not valid', function(){
            card.number = '1234';

            expect(function(){
                picker.buildCardOption(card);
            }).toThrow(new OtpCardsPickerCardNumberIsNotValidError(card));

        });
    });

    describe('isValidCardNumber', function(){
        it('when card number has length 10 is valid', function(){
            expect(picker.isValidCardNumber("4363231112")).toBeTruthy();
        });

        it('when card number has length 16 is not valid', function(){
            expect(picker.isValidCardNumber("4111222211113333")).toBeFalsy();
        });
    });
});