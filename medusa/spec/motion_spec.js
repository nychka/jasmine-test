describe('Motion', function(){
    var card, inputs, motion;


    card = new PaymentCard();//Hub.dispatcher.getController('payment').getPaymentCard();
    inputs = card.getContext();
    motion = new Motion(card);

    afterEach(function(){
        card.reset();
        inputs.wrapper.find('input:visible').blur();

        expect(document.activeElement.tagName).toEqual("BODY");
    });

    describe('API', function(){
       it('getMembers', function(){
          expect(motion.getMembers().length).toEqual(8);
       });

       describe('getNext', function(){
           it('forward', function(){
               var members = motion.getMembers();
               var input = $(members[0]);
               input.focus();

               expect(motion.getCurrent()).toEqual(input);
               expect(motion.getNext()).toEqual(members[1]);
           });

           it('edge', function(){
               var members = motion.getMembers();
               var input = $(members[7]);
               input.focus();

               expect(motion.getCurrent()).toEqual(input);
               expect(motion.getNext()).toBeFalsy();
           });
       });

       describe('getCurrent', function(){
           it('card_number_0 gets focus becomes current', function(){
               var input = $(motion.getMembers()[0]);
               input.focus();

               expect(motion.getCurrent()).toEqual(input);
           });

           it('is null when all members lose focus', function(){
               var input = motion.getMembers()[0];
               $(input).val('1234').trigger('keyup');
               inputs.card_input_wrapper.find('input').blur();

               expect(motion.getCurrent()).toBeNull();
           });
       });
    });

    it('card_number_0 gets focus', function(){
        inputs.card_number_0.trigger('focus');

        expect($(document.activeElement).prop('id')).toEqual('card_number_0');
    });

   it('card_number_0 loses focus when reach 4 digits', function(){
        inputs.card_number_0.val('1234').trigger('keyup');

        expect($(document.activeElement).prop('id')).toEqual('card_number_1');
   });
});