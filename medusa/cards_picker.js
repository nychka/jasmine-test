function CardsPicker(options)
{
    var cards;

    var default_options = {
        wrapper: $('.usb_cards_block'),
        pickerSelector: 'select',
        cardNumbers: [/*1234567890*/]
    };

    this.init = function()
    {
        this.settings = $.extend({}, default_options, options);
        this.length = 0;
        cards = {};
    };

    this.setup = function()
    {
        if(! this.settings.cardNumbers.length) return false; //TODO throw Error

        for(var i = 0; i < this.settings.cardNumbers.length; i++){
            var card = this.settings.cardNumbers[i];
            var option = this.buildCardOption(card);

            if(cards[card]) throw new OtpCardsPickerAddSameCardError(card);

            this.getPickerContainer().append(option);
            cards[card] = option;
        }

        this.count();

        var envelope = {
            data: { cards: this.getCards() },
            message: 'CardsPicker has been prepared with ' + this.length + ' card number'
        };

        Hub.publish('cards_picker_prepared', envelope);
    };

    this.toggle = function(status)
    {
        (status) ? this.enable() : this.disable();
    };

    this.enable = function()
    {
        this.getWrapper().show();

        Hub.publish('cards_picker_enabled', {
            data: {
                cards: this.getCards(),
                card: this.getFirstOption().val()
            },
            message: 'CardsPicker has been enabled'
        });
    };

    this.disable = function()
    {
        this.getWrapper().hide();

        Hub.publish('cards_picker_disabled', { data: {}, message: 'CardsPicker has been disabled' });
    };

    this.count = function()
    {
        this.length = Object.keys(cards).length;

        return this.length;
    };

    this.getWrapper = function()
    {
        return this.settings.wrapper;
    };

    this.getPickerContainer = function()
    {
        return this.getWrapper().find(this.settings.pickerSelector);
    };

    this.getCards = function()
    {
        return Object.keys(cards);
    };

    this.getOptions = function()
    {
        return Object.values(cards);
    };

    this.getFirstOption = function(){
        var options = this.getOptions();

        return options[0];
    };

    this.buildCardOption = function(cardNum)
    {
        if(! this.isValidCardNumber(cardNum)) throw new OtpCardsPickerCardNumberIsNotValidError(cardNum);

        var getFirstToken = function(number){ return number.substr(0, 4); };
        var getSecondToken = function(number){ return number.substr(4, 2) + "XX"; };
        var getThirdToken = function(number){ return "XXXX"; };
        var getLastToken = function(number){ return number.substr(6, 4); };

        var buildTextForCardOption = function(number){
            return getFirstToken(cardNum) + " " + getSecondToken(cardNum) + " " + getThirdToken(cardNum) + " " + getLastToken(cardNum);
        };

        var text = buildTextForCardOption(cardNum); // 1234 56XX XXXX 7890
        var value = getFirstToken(cardNum) + getLastToken(cardNum); // 12347890

        return $('<option></option>', { value: value, text: text });
    };

    /**
     *
     * @param cardNumber 4363231112
     * @returns {boolean}
     */
    this.isValidCardNumber = function(cardNumber)
    {
        return cardNumber.length === 10;
    };

    this.init();
};

function OtpCardsPickerCardNumberIsNotValidError(cardNumber)
{
    this.number = cardNumber;
    this.message = 'Card number '+ cardNumber + ' is not valid!';
};

function OtpCardsPickerAddSameCardError(cardNumber)
{
    this.number = cardNumber;
    this.message = 'Card ' + cardNumber + 'has already added!';
};