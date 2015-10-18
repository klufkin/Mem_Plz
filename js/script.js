var header = (function() {
	//cacheDom:
		$links = $('header nav a');
		$current = $('#current');
  	$deckSize = $('#size');

	//bindEvents: 
		$links.on('click', function(e){
			_load(this);
		});
		//for navigating cards
		$(document).keydown(function(e) {
	    if(e.which == 39) { // right
	        practice.next();
	    }
	    else if(e.which == 37){ // left
	    		practice.back();
	    }
	    else if (e.which == 32){
	    		practice.flip();
	    }
	  });

	function _load(link){
		$('#container').load(link.id + '.html .content', function(){
				_navSelect(link);
		});
	}

	function _navSelect(selected) {
				$links.find('div').removeClass('active');
				if(selected.id == 'Mem_Plz') {
					$(selected).find('div').addClass('active');
					create.init();
				}
				else if(selected.id == 'practice'){
					$(selected).find('div').addClass('active');
					practice.init();
				}
				else if(selected.id == 'info'){
					$(selected).find('div').addClass('active');
					practice.init();
				}
	}

	function deckStats() {
		if(cardDeck.deck.length)
			$current.text(cardDeck.current + 1);
	  	$deckSize.text(cardDeck.deck.length);
  }

  return {
  	deckStats: deckStats
  };

})();


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
		if(this.deck.length == 0){}
		else if(this.current <= 0){
			this.current = this.deck.length - 1;
		}
		else
		  this.current--;
	}
}

var create = (function(){
	function init(){
		_cacheDom();
		_bindEvents();
    $front.focus();
    $front.val('');
		$back.val('');
		$deckCode.val('');
		_generateCode();
	}

  function _cacheDom() {
  	$front = $('#createCards input[name=front]');
  	$back = $('#createCards input[name=back]');
  	$createButton = $('#createCards button');
  	$deckCode = $('#deckCode textarea[name=deckCode]');
  	$generate = $('#deckCode button[name=generate]');
  }

  function _bindEvents() {
  	$createButton.on('click', _createCard.bind(this));
  	$generate.on('click', _generateCards.bind(this));

  	$front.keypress(function(e){
	    if(e.which == 13) { // enter
	        $back.focus();
	    }
		});

		$back.keypress(function(e) {
	    if(e.which == 13) { // enter
	    	_createCard();
        $front.focus();
	    }
		});
  }

	function _createCard() {
		if($front.val() != '' && $back.val() != ''){
			cardDeck.addCard($front.val(), $back.val());
			$front.val('');
			$back.val('');
			_generateCode();
			header.deckStats();
		}
	}

	function _generateCode(){
		// turn array into json text
		if(cardDeck.deck.length)
			$deckCode.val(JSON.stringify(cardDeck.deck));
	}

	function _generateCards(){
		cardDeck.deck = JSON.parse($deckCode.val());
		header.deckStats();
	}

	return {
		init: init
	};
})();

create.init();


var practice = (function(){
	function init() {
		_cacheDom();
		_bindEvents();
		_load();
	}

	function _cacheDom(){
		$card = $('.card');
		$frontContent=$('.front p');
		$backContent=$('.back p');
		$back = $('#back');
		$next = $('#next');
	}

	function _bindEvents() {
		$card.on('click', flip.bind(this));
		$next.on('click', next.bind(this));
		$back.on('click', back.bind(this));
	}

	function _load() {
		if(cardDeck.deck.length){
			$frontContent.text(cardDeck.deck[cardDeck.current]['front']);
			$backContent.text(cardDeck.deck[cardDeck.current]['back']);
		}
	}

	function flip(){
		if($card) // may be able to remove after
			$card.toggleClass('flip');
	}

	function next(){
		$card.removeClass('flip');
		$next.addClass('active');
		//gives css animation time to run
		setTimeout(function() {$next.removeClass('active');}, 200);
	
		cardDeck.next();
		//times load so it looks like content changes on flip
		setTimeout(function() {_load();}, 150);
		header.deckStats();
	}

	function back(){
		$card.removeClass('flip');
		$back.addClass('active');
		setTimeout(function() {$back.removeClass('active');}, 200);

		cardDeck.back();
		setTimeout(function() {_load();}, 150);
		header.deckStats();
	}

	return {
		init: init,
		next: next,
		back: back,
		flip: flip
	}
})();