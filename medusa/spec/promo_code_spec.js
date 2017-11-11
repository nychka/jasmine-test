describe('PromoCode', function(){
    var promoCode, container, usePromoInput, textPromoInput;
    var request, validCode, invalidCode;



    beforeEach(function(){
        promoCode = new PromoCode();
        promoCode.init();
        //promoCode.reset();
        jasmine.Ajax.install();
        invalidCode = 'UNVALIDKOD';
        validCode = 'VALIDCODE!';
    });

    afterEach(function(){
       jasmine.Ajax.uninstall();
        promoCode.reset();
    });

    describe('DOM verifications', function(){
        it('container is in DOM', function(){
            container = promoCode.getContainer();

            expect(container[0]).toBeInDOM();
        });

        it('container has unchecked use_promo checkbox by default', function(){
            usePromoInput = promoCode.getUsePromoInput();

            expect(usePromoInput[0]).toBeInDOM();
            expect(usePromoInput).not.toBeChecked();
        });

        it('container has hidden promo input by default', function(){
            textPromoInput = promoCode.getPromoInput();

            expect(textPromoInput[0]).toBeInDOM();
            expect(textPromoInput[0]).not.toBeVisible();
        });
    });

    describe('Public API calls', function(){
        describe('isActive', function(){
            it('when checkbox is unchecked', function(){
                expect(promoCode.isActive()).toBeFalsy();
            });

            it('when checkbox is checked by user', function(){
               promoCode.getUsePromoInput().trigger('click');

               expect(promoCode.isActive()).toBeTruthy();
            });
        });

        describe('reset', function(){
            it('DOM states', function(){
                usePromoInput = promoCode.getUsePromoInput();
                textPromoInput = promoCode.getPromoInput();

                usePromoInput.trigger('click');

                expect(promoCode.isActive()).toBeTruthy();
                expect(usePromoInput[0]).toBeChecked();
                expect(textPromoInput[0]).toBeVisible();

                promoCode.reset();

                expect(promoCode.isActive()).toBeFalsy();
                expect(usePromoInput[0]).not.toBeChecked();
                expect(textPromoInput[0]).not.toBeVisible();
            });
        });
    });

    describe('States', function(){
       describe('Default state', function(){
          it('promo input is hidden', function(){
             var input = promoCode.getPromoInput();

             expect(input[0]).not.toBeVisible();
          });

           it('promo input has maxlength 10', function(){
               var input = promoCode.getPromoInput();

               expect(input.prop('maxlength')).toBe(10);
           });

           it('container has not any valid classes', function(){
              var container = promoCode.getContainer();

              expect(container.hasClass('valid')).toBeFalsy();
              expect(container.hasClass('unvalid')).toBeFalsy();
           });
       });
       describe('Activated state', function(){
          beforeEach(function(){
              promoCode.activatedState();

             expect(promoCode.isActive()).toBeTruthy();
          });

          afterEach(function(){
             promoCode.defaultState();

             expect(promoCode.isActive().toBeFalsy());
          });

          xit('has not any valid classes', function(){
              var input = promoCode.getPromoInput();
              console.log('has class', input.hasClass('unvalid'));

             expect(input.hasClass('unvalid')).toBeFalsy();
             expect(input.hasClass('valid')).toBeFalsy();
          });

          xit('has empty promo input', function(){
             expect(promoCode.getPromoInput().val()).toEqual('');
          });
       });
    });

    describe('Use cases', function(){
       it('user wants to use promo code, so he clicks on checkbox and sees text input', function(){
            usePromoInput = promoCode.getUsePromoInput();
            textPromoInput = promoCode.getPromoInput();
            usePromoInput.trigger('click');

            expect(textPromoInput).toBeVisible();
            expect(usePromoInput).toBeChecked();
       });

       it('user don\'t want to use promo code, so he clicks again on checkbox and doesn\'t see text input', function(){
           usePromoInput = promoCode.getUsePromoInput();
           textPromoInput = promoCode.getPromoInput();
           usePromoInput.trigger('click');

          expect(textPromoInput).toBeVisible();
          expect(usePromoInput).toBeChecked();

          usePromoInput.trigger('click');

          expect(textPromoInput).not.toBeVisible();
          expect(usePromoInput).not.toBeChecked();
       });

       it('user inputs 10 characters, so XHR request sent to promotion endpoint', function(){
           textPromoInput = promoCode.getPromoInput();
           var invalidCode = 'OLOLOOLOLO';
           var invalidCodeData = {
               code: [invalidCode],
               session_id: [window.session_id],
               recommendation_id: [window.recommendation_id],
               csrf_token: [window.csrf_token]
           };
           textPromoInput.val(invalidCode);
           textPromoInput.trigger('keyup');

           request = jasmine.Ajax.requests.mostRecent();

           expect(request.url).toBe('/promotion/check_promotion_code');
           expect(request.method).toBe('POST');
           expect(request.data()).toEqual(invalidCodeData);
       });

       it('user enters valid promo code it changes its color to green', function(){
           var tooltip;

           spyOn($, 'ajax').and.callFake(function(params){
               params.success({ success: true, details: { amount: 300 }, msg: 'promo code is valid' });
           });
           promoCode.getUsePromoInput().trigger('click');
           promoCode.getPromoInput().val(validCode);
           promoCode.getPromoInput().trigger('keyup');
           // tooltip = promoCode.getPromoInputContainer().tooltipster('instance');
           //
           // expect(tooltip.status().state).toEqual('disappearing');
           expect(promoCode.getPromoInput().hasClass('valid')).toBeTruthy();
       });
    });
});