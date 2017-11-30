function CardsPicker(options)
{
    Component.call(this, options);

    var default_options = {
        wrapper: $('.usb_cards_block'),
        pickerSelector: 'select',
        cards: [/*1234567890*/]
    };

    this.prepareStates = function()
    {
        var proto = CardsPicker.prototype;

        if(proto.states && Object.keys(proto.states).length){
            for(var state in proto.states){
                this.state.register(state, proto.states[state]);
            }
        }
    };

    var init = function()
    {
        this.settings = $.extend({}, default_options, options);
        this.length = 0;
        this.prepareStates();
    };

    this.setup = function()
    {
        if(! this.settings.cards.length) return false; //TODO throw Error

        for(var i = 0; i < this.settings.cards.length; i++){
            var option = this.buildCardOption(this.settings.cards[i]);

            this.getPickerContainer().append(option);
        }

        this.count();

        var envelope = {
            data: { cards: this.getCards() },
            message: 'CardsPicker has been prepared with ' + this.length + ' card number'
        };

        Hub.publish('cards_picker_prepared', envelope);
        this.log('prepared', { cards: this.getCards() });
        this.state.transitTo('default');
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
        this.length = 1;//Object.keys(cards).length;

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
        return this.settings.cards;
    };

    this.getOptions = function()
    {
        return Object.values(cards);
    };

    this.getFirstOption = function(){
        var options = this.getOptions();

        return options[0];
    };

    this.buildCardOption = function(card)
    {
        if(! this.isValidCardNumber(card.number)) throw new OtpCardsPickerCardNumberIsNotValidError(card);

        var getFirstToken = function(number){ return number.substr(0, 4); };
        var getSecondToken = function(number){ return number.substr(4, 2) + "XX"; };
        var getThirdToken = function(number){ return "XXXX"; };
        var getLastToken = function(number){ return number.substr(6, 4); };

        var buildTextForCardOption = function(number){
            return getFirstToken(number) + " " + getSecondToken(number) + " " + getThirdToken(number) + " " + getLastToken(number);
        };

        var text = buildTextForCardOption(card.number); // 1234 56XX XXXX 7890
        var value = getFirstToken(card.number) + getLastToken(card.number); // 12347890

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

    init.call(this);
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