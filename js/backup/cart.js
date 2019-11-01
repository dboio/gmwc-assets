// quickCart functionality

/*
$(document).ready(function() {
  $('a[href~="#addMe"]').click(function() {
    // this is a pure sample to what function to call when an item was added to the cart.
    $('#quickCartItems').prepend($('#quickCartItems > .list-group-item:last-child').clone());
    $('#quickCartItems').promise().done(function() {
      quickCart('.quick-cart', 7000, true);
    });
  });
});

// add class if cart is visible
$( ".navbar-cart" ).ready( function() {
  showSmallCart($(this));
});
*/






var CartClass = function() {
  // todo: we need to implement a restiction on payments that are allowed
    // https://github.com/stripe/jquery.payment


	this.debug = (function(msg,object) {
		var loc = window.location.toString().toLowerCase();
		if (loc.indexOf("debugcart") > -1)
		{
			if (msg != undefined) {
				if (object != undefined)
					console.debug("cart: " + msg, object);
				else
					console.debug("cart: " + msg);
			}
			return true;
		}

	});

	this.error = (function(msg,object) {
		var loc = window.location.toString().toLowerCase();
		if (loc.indexOf("debugcart") > -1)
		{
			if (msg != undefined) {
				if (object != undefined)
					console.error("cart: " + msg, object);
				else
					console.error("cart: " + msg);
			}
			return true;
		}

	});

	this.init = (function() {
		this.debug('init',this);
	}); //init

	this.refreshCart = (function() {
		this.debug('refreshCart',null);
		$('#cart_summary_container').load('/api/output/gm_cart_summary?_output=html&_template=kmYiDpAJxUadMzYGZS2Iyg', function () {
			document.cart.debug('refreshCart : finished loading summary',null);
			if ($('#cart_summary_widget') && $('#cart_summary_widget').html().length > 0) {
				document.cart.debug('refreshCart : cart found, loading small cart',null);
				//if a cart exists, load the small cart
				$('#cart_contents').load( '/api/content/7GG5G44ssk62ySaoYqMPTQ', function() {
					document.cart.showSmallCart('.navbar-cart');
					// sample on how the cart gets shown.
					// passing true will reset the timer
					document.cart.quickCart('.quick-cart', 7000, true);
					$('[data-toggle~="showQuickCart"]').hover(function() {
						document.cart.quickCart('.quick-cart', 0, false);
					});
				});
			}
			$('#cart_summary_container').show();
		});
	});


  this.qCTimer = null;
  this.qCCounter = (function (element) {
		this.debug('qCCounter',element);
    if ($(element).hasClass('bounceIn')) {
      $(element).removeClass('bounceIn').addClass('bounceIn');
    } else {
      $(element).addClass('bounceIn');
    }
  });

  this.showSmallCart = (function (element) {
		this.debug('showSmallCart',element);
    if( $(element).is(':visible') ) {
      $('.navbar-top').addClass("navbar-with-small-cart");
      this.qCCounter('#cartCounter');
    }
  });

  this.qCAlignment = (function(element) {
    var $element  = $(element);
    var docWidth  = $(window).width();
    var cartWidth = $element.parents('.navbar-cart').find('.list-group-item-brand').width();
    var cartLeft  = $element.parents('.navbar-cart').find('.list-group-item-brand').offset().left;
    var alignTopRight = docWidth - (cartWidth + cartLeft);
    $element.css('right', alignTopRight+'px');
    return alignTopRight;
  });

  this.quickCart = function(element, time, resetTimer) {
		this.debug('quickCart',time);
    var animateIn     = 'fadeInDown';
    var animateOut    = 'fadeOutUp';
    var alignTopRight = this.qCAlignment(element);
    $(window).resize(function (element) {
        alignTopRight = this.qCAlignment(element);
    });
    var $element      = $(element);
    var startTimer    = function(time) {
      this.qCTimer = window.setTimeout(function() {
        $element.removeClass(animateIn).addClass(animateOut);
      }, time);
    };
    if (resetTimer === true) {
      clearTimeout(this.qCTimer);
    }
		if (time && time > 0) {
			if ($element.hasClass(animateIn)) {
				startTimer(time);
			}
			else {
				if ($element.hasClass(animateOut) || $element.hasClass('hidden')) {
					clearTimeout(this.qCTimer);
					$element.removeClass(animateOut).removeClass('hidden').addClass(animateIn);
					if (resetTimer === true) {
						clearTimeout(this.qCTimer);
					}
					startTimer(time);
				}
			}
		}
		else
			$element.removeClass(animateOut).removeClass('hidden').addClass(animateIn);
		/* these don't seem to work properly
    $element.bind('mouseenter', function() {
			document.cart.debug('mouse enter',element);
      clearTimeout(this.qCTimer);
    });
    $element.bind('mouseleave', function() {
			document.cart.debug('mouse leave',element);
      startTimer(1000);
    });
		*/
  };

	this.addItemByForm = (function(formID) {

		this.debug('addItemByForm',formID);
		if ($(formID).length == 0) {
			this.error('addItemByForm : unable to find formID',formID);
			alert('Internal error, unable to add item to cart');
			return false;
		}
		// post ajax
		$.ajax({
					url:'/api/output/gm_cart_addItem'
					,type:'post'
					,data: $(formID).serialize()
					,dataType:'json'
				}).done(function(res) {
					document.cart.debug('addItemByForm done',res);
					var success = true;
					var errorMessage;
					if (res && Array.isArray(res)) {
						if (res[0].Successful && res[0].Successful.toLowerCase() == "true") {
							document.cart.refreshCart();
						} else if (res[0].Message) {
							errorMessage = res[0].Message;
							success = false;
						}
					} else {
						this.error('addItemByForm invalid result',res);
						success = false;
						if (res.Message) {
							errorMessage = res.Message;
						}	else if (res.Messages) {
							errorMessage = res.Messages;
						}
					}
					if (!success) {
						if (!errorMessage) {
							errorMessage = 'We were unable to add this item to you cart. Please try again';
						}
						alert(errorMessage);
					}
				});
		return false;
	});

}; //cartClass

document.cart = new CartClass();

/* cart.js */