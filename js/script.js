var header = {
	init: function() {
		this.cacheDom();
		this.bindEvents();
	},
	cacheDom: function(){
		this.$links = $('header nav a');
		this.$current = $('#current');
  	this.$deckSize = $('#size');
	},
	bindEvents: function() {
		this.$links.on('click', this.load);

		//for navigating cards
		$(document).keydown($.proxy(function(e) {
	    if(e.which == 39) { // right
	        practice.next();
	        console.log('right');
	    }
	    else if(e.which == 37){ // left
	    		practice.back();
	    		console.log('left');
	    }
	  }, this));
	},
	load: function(){
		$('#container').load(this.id + '.html .content', $.proxy(function(){
				header.navSelect(this);
		}, this));
	},
	navSelect: function(selected){
				this.$links.find('img').removeClass('active');
				if(selected.id == 'makeDeck') {
					$(selected).find('img').addClass('active');
					create.init();
				}
				else if(selected.id == 'practice'){
					$(selected).find('img').addClass('active');
					practice.init();
				}
	},
	deckStats: function() {
		this.$current.text(cardDeck.current + 1);
  	this.$deckSize.text(cardDeck.deck.length);
  },
};
header.init();

var cardDeck = {
  Card: function(side1, side2){
		this.side1 = side1 || "";
		this.side2 = side2 || "";
	},
  deck: [],
	current: 0,
  addCard: function(val1, val2){
  	this.deck.push(new this.Card(val1, val2));
  },
  next: function(){
		this.current++;
		if(this.current == this.deck.length)
			this.current = 0;
	},
	back: function(){
		this.current--;
		if(this.current < 0)
			this.current = this.deck.length - 1;
	}
}

var create = {
	init: function(){
		this.cacheDom();
		this.bindEvents();
    this.$side1.focus();
    this.$side1.val('');
		this.$side2.val('');
		this.$deckCode.val('');
		this.generateCode();
	},
  cacheDom: function() {
  	this.$side1 = $('#createCards input[name=side1]');
  	this.$side2 = $('#createCards input[name=side2]');
  	this.$createButton = $('#createCards button');
  	this.$deckCode = $('#deckCode textarea[name=deckCode]');
  	this.$generate = $('#deckCode button[name=generate]');
  },
  bindEvents: function() {
  	this.$createButton.on('click', this.createCard.bind(this));
  	this.$generate.on('click', this.generateCards.bind(this));

  	this.$side1.keypress($.proxy(function(e) {
	    if(e.which == 13) { // enter
	        this.$side2.focus();
	    }
		}, this));

		this.$side2.keypress($.proxy(function(e) {
	    if(e.which == 13) { // enter
	    	this.createCard();
        this.$side1.focus();
	    }
		}, this));
  },
	createCard: function() {
		if(this.$side1.val() != '' && this.$side2.val() != ''){
			cardDeck.addCard(this.$side1.val(), this.$side2.val());
			this.$side1.val('');
			this.$side2.val('');
			this.generateCode();
			header.deckStats();
		}
	},
	generateCode: function(){
		// turn array into json text
		if(cardDeck.deck.length)
			this.$deckCode.val(JSON.stringify(cardDeck.deck));
	},
	generateCards: function(){
		cardDeck.deck = JSON.parse(this.$deckCode.val());
		header.deckStats();
	}
}

create.init();


var practice = {
	init: function() {
		this.cacheDom();
		this.bindEvents();
		this.load();
	},
	cacheDom: function(){
		this.$card = $('.face');
		this.$side = $('.face h6');
		this.$content=$('.face p');
		this.$back = $('#back');
		this.$next = $('#next');
	},
	bindEvents: function(){
		this.$card.on('click', this.flip.bind(this));
		this.$next.on('click', this.next.bind(this));
		this.$back.on('click', this.back.bind(this));
	},
	side: 'side1',
	load: function(){
			this.$content.text(cardDeck.deck[cardDeck.current][this.side]);
	},
	flip: function(){
		if(this.side == 'side1'){
			this.side = 'side2';
			this.$side.text('Side 2');
		}
		else {
			this.side = 'side1';
			this.$side.text('Side 1');
		}
		this.load();
	},
	next: function(){
		this.side = 'side1';
		this.$side.text('Side 1');
		cardDeck.next();
		this.load();
		header.deckStats();
	},
	back: function(){
		this.side = 'side1';
		this.$side.text('Side 1');
		cardDeck.back();
		this.load();
		header.deckStats();
	}
}