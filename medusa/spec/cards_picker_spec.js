describe('CardsPicker', function(){
  var picker, options;

  var element = $('<div></div>', { id: 'jasmine_cards_picker' });
  var select = $('<select></select>', { id: 'usbl_selector', class: "chosen-select-no-search ignore-selectbox" });
  element.append(select);
  $('body').append(element);

  options = {
      wrapper: $('#jasmine_cards_picker'),
      pickerContainer: '#usbl_selector'
  };


  beforeEach(function(){
      picker = new CardsPicker(options);
  });

  afterEach(function(){
    //picker.clean();
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
      //expect(picker.getPickerContainer()).toHaveId(picker.settings.pickerSelector);
    });

  describe('setup', function(){
    it('prepare card options for picker container', function(){
        picker.settings.cardNumbers = ["4363231112"];
        picker.setup();

        expect(picker.getCards()).toEqual(picker.settings.cardNumbers);
    });

    it('tries to add existing cards', function(){
        picker.settings.cardNumbers = ["4363231112", "4363231111"];
        picker.setup();

        expect(picker.getCards()).toEqual(picker.settings.cardNumbers);
        expect(function(){
          picker.settings.cardNumbers = ["4363231111"];
          picker.setup();
        }).toThrow(new OtpCardsPickerAddSameCardError("4363231111"));
    });
  });

  describe('buildCardOption', function() {
      it('builds with valid card number 4363231112', function () {
          var card = "4363231112";
          var text = "4363 23XX XXXX 1112";
          var value = "43631112";
          var option = picker.buildCardOption(card);

          expect(option.text()).toEqual(text);
          expect(option.val()).toEqual(value);
      });

      it('throws error when card number is not valid', function(){
        var cardNumber = "1234";

        expect(function(){
            picker.buildCardOption(cardNumber);
        }).toThrow(new OtpCardsPickerCardNumberIsNotValidError(cardNumber));

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

  describe('setup', function(){
    it('has all cotainers in DOM', function(){
      picker.setup();

      expect(picker.getWrapper()).toContainElement('#usbl_selector');
    });
  });
});