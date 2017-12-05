describe('Motion', function(){
    beforeEach(function(){
        this.card = new PaymentCard();
        this.motion = new Motion(this.card);
    });

    afterEach(function(){
        this.card.reset();
        this.card.getContext().wrapper.find('input:visible').blur();

        expect(document.activeElement.tagName).toEqual("BODY");
    });

    describe('API', function(){
       it('getMembers', function(){
          expect(this.motion.getMembers().length).toEqual(8);
       });

       describe('isFilled', function(){
           it('when length less than maxLength', function(){
              var input = $(this.motion.getMembers()[0]);

              expect(this.motion.isFilled(input)).toBeFalsy();
           });

           it('when length equals maxLength', function(){
               var input = $(this.motion.getMembers()[0]);
               input.val('4321');

               expect(this.motion.isFilled(input)).toBeTruthy();
           });
       });

       describe('getNext', function(){
           it('forward', function(){
               var members = this.motion.getMembers();
               var input = $(members[0]);
               input.focus();

               expect(this.motion.getCurrent()).toEqual(input);
               expect(this.motion.getNext()).toEqual(members[1]);
           });

           it('edge', function(){
               var members = this.motion.getMembers();
               var input = $(members[7]);
               input.focus();

               expect(this.motion.getCurrent()).toEqual(input);
               expect(this.motion.getNext()).toBeFalsy();
           });
       });

       describe('getCurrent', function(){
           it('this.card_number_0 gets focus becomes current', function(){
               var input = $(this.motion.getMembers()[0]);
               input.focus();

               expect(this.motion.getCurrent()).toEqual(input);
           });

           it('is null when all members lose focus', function(){
               var input = this.motion.getMembers()[0];
               $(input).val('1234').trigger('keyup');
               this.card.getContext().wrapper.find('input').blur();

               expect(this.motion.getCurrent()).toBeNull();
           });
       });
    });

    describe('Scenarios', function(){
        it('card_number_0 gets focus', function(){
            $(this.motion.getMembers()[0]).trigger('focus');

            expect($(document.activeElement).prop('id')).toEqual('card_number_0');
        });

        it('card_number_0 fires keyup and loses focus when reaches 4 digits', function(){
            $(this.motion.getMembers()[0]).val('1234').trigger('keyup');

            expect($(document.activeElement).prop('id')).toEqual('card_number_1');
        });

        it('moves to next unfilled input', function(){
            var members = this.motion.getMembers();

            $(members[0]).val('4111');
            $(members[2]).val('1111');
            $(members[3]).val('');
            $(members[1]).val('1111').trigger('keyup');

            expect($(document.activeElement).prop('id')).toEqual('card_number_3');
        });

        it('moves to last unfilled input', function(){
            var members = this.motion.getMembers();

            $(members[6]).val('123').trigger('keyup');

            expect($(document.activeElement).prop('id')).toEqual('card_holder');
        });
    });
});