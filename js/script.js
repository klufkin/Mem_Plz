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
	        // console.log('right');
	    }
	    else if(e.which == 37){ // left
	    		practice.back();
	    		// console.log('left');
	    }
	    else if (e.which == 32){
	    		practice.flip();
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
				if(selected.id == 'Mem_Plz') {
					$(selected).find('img').addClass('active');
					create.init();
				}
				else if(selected.id == 'practice'){
					$(selected).find('img').addClass('active');
					practice.init();
				}
				else if(selected.id == 'info'){
					$(selected).find('img').addClass('active');
					practice.init();
				}
	},
	deckStats: function() {
	if(cardDeck.deck.length)
		this.$current.text(cardDeck.current + 1);
  	this.$deckSize.text(cardDeck.deck.length);
  },
};
header.init();

var cardDeck = {
  Card: function(front, back){
		this.front = front || "";
		this.back = back || "";
	},
  deck: [],
	current: 0,
  addCard: function(val1, val2){
  	this.deck.push(new this.Card(val1, val2));
  },
  next: function(){
		this.current++;
		if(this.current >= this.deck.length)
			this.current = 0;
	},
	back: function(){
	if(this.current != 0)	
		this.current--;
		if(this.current < 0)
			this.current = this.deck.length - 1;
	}
}

var create = {
	init: function(){
		this.cacheDom();
		this.bindEvents();
    this.$front.focus();
    this.$front.val('');
		this.$back.val('');
		this.$deckCode.val('');
		this.generateCode();
	},
  cacheDom: function() {
  	this.$front = $('#createCards input[name=front]');
  	this.$back = $('#createCards input[name=back]');
  	this.$createButton = $('#createCards button');
  	this.$deckCode = $('#deckCode textarea[name=deckCode]');
  	this.$generate = $('#deckCode button[name=generate]');
  },
  bindEvents: function() {
  	this.$createButton.on('click', this.createCard.bind(this));
  	this.$generate.on('click', this.generateCards.bind(this));

  	this.$front.keypress($.proxy(function(e) {
	    if(e.which == 13) { // enter
	        this.$back.focus();
	    }
		}, this));

		this.$back.keypress($.proxy(function(e) {
	    if(e.which == 13) { // enter
	    	this.createCard();
        this.$front.focus();
	    }
		}, this));
  },
	createCard: function() {
		if(this.$front.val() != '' && this.$back.val() != ''){
			cardDeck.addCard(this.$front.val(), this.$back.val());
			this.$front.val('');
			this.$back.val('');
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
		this.$card = $('.card');
		this.$frontContent=$('.front p');
		this.$backContent=$('.back p');
		this.$back = $('#back');
		this.$next = $('#next');
	},
	bindEvents: function(){
		this.$card.on('click', this.flip.bind(this));
		this.$next.on('click', this.next.bind(this));
		this.$back.on('click', this.back.bind(this));
	},
	load: function(){
		if(cardDeck.deck.length){
			this.$frontContent.text(cardDeck.deck[cardDeck.current]['front']);
			this.$backContent.text(cardDeck.deck[cardDeck.current]['back']);
		}
	},
	flip: function(){
		this.$card.toggleClass('flip');
	},
	next: function(){
		this.$card.removeClass('flip');
		this.$next.addClass('active');
		//gives css animation time to run
		setTimeout($.proxy(function() {this.$next.removeClass('active');},this), 200);
	
		cardDeck.next();
		//times load so it looks like content changes on flip
		setTimeout($.proxy(function() {this.load();},this), 150);
		header.deckStats();
	},
	back: function(){
		this.$card.removeClass('flip');
		this.$back.addClass('active');
		setTimeout($.proxy(function() {this.$back.removeClass('active');},this), 200);

		cardDeck.back();
		setTimeout($.proxy(function() {this.load();},this), 150);
		header.deckStats();
	}
}