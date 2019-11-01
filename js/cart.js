/*!
 * Agency: manolab, LLC
 * Project: Gold Medal Wine / Craft Beer Club
 * Modified: 11/21/2018
 * Developer: Thomas Paine / Christian Fillies
 *
 */


var CartClass = function() {

	var animateIn     = 'fadeInDown';
	var animateOut    = 'fadeOutUp';

	this.qCTimer = null;
	var clearTimer;

	var startTimer = this.startTimer = (function (element,time) {
		this.qCTimer = window.setTimeout(function() {
				$(element).removeClass(animateIn).addClass(animateOut);
			}, time);
		clearTimer = this.qCTimer;
	});


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
	});

	this.refreshCart = (function(showSmallCart) {
		if (showSmallCart == null)
			showSmallCart = true; /*default to true because most of the time we want to show this except when we first load a page*/
		this.debug('refreshCart',showSmallCart);
		$('#cart_summary_container').load('/api/output/gm_cart_summary?_output=html&_template=kmYiDpAJxUadMzYGZS2Iyg', function () {
			document.cart.debug('refreshCart : finished loading summary',showSmallCart);
			if ($('#cart_summary_widget') && $('#cart_summary_widget').html().length > 0) {
				document.cart.debug('refreshCart : cart found, loading small cart',showSmallCart);
				/*if a cart exists, load the small cart*/
				$('#cart_contents').load( '/api/content/7GG5G44ssk62ySaoYqMPTQ', function() {
					document.cart.showSmallCart('.navbar-cart');
					if (showSmallCart)
						document.cart.quickCart('.quick-cart', 7000, true);
					$('[data-toggle~="showQuickCart"]').hover(function() {
						document.cart.quickCart('.quick-cart', 0, false);
					});
					document.cart.smallCartSpinner('hide');
				});
			}
			$('#cart_summary_container').show();
		});
	});

	this.qCCounter = (function (element) {
		this.debug('qCCounter',element);
		if ($(element).hasClass('bounceIn')) {
			$(element).removeClass('bounceIn').addClass('bounceIn');
		} else {
			$(element).addClass('bounceIn');
		}
	});

	this.smallCartSpinner = (function (element) {
		this.debug('smallCartSpinner',element);
		var hide = 'auto', defaultClass = '._smallCartSpinner';
		if (element === 'hide') {
			element = $(defaultClass);
			hide = true;
		}
		var $ele = typeof element === 'string' ? $(element) : element;
		if (element === undefined) {
			$ele = $(defaultClass);
		}
		if ($ele.hasClass('hidden') && hide === 'auto') {
			$ele.removeClass('hidden');
		} else {
			$ele.addClass('hidden');
		}
	});

	this.showSmallCart = (function (element) {
		this.debug('showSmallCart',element);
		if( $(element).is(':visible') ) {
			$('.navbar-top').addClass("navbar-with-small-cart");
			this.qCCounter('#cartCounter');
		}
	});

	this.quickCart = function(element, time, resetTimer) {
		this.debug('quickCart',time);
		var $element      = $(element);

		if (resetTimer === true) {
			clearTimeout(this.qCTimer);
		}
		if (time && time > 0) {
			if ($element.hasClass(animateIn)) {
				this.startTimer($element,time);
			}
			else {
				if ($element.hasClass(animateOut) || $element.hasClass('hidden')) {
					clearTimeout(this.qCTimer);
					$element.removeClass(animateOut).removeClass('hidden').addClass(animateIn);
					if (resetTimer === true) {
						clearTimeout(this.qCTimer);
					}
					this.startTimer($element,time);
				}
			}
		}
		else {
			$element.removeClass(animateOut).removeClass('hidden').addClass(animateIn);
		}
		$('html, body div').one('click', function (e) {
			if (!$(element).is(e.target) && $(element).has(e.target).length === 0) {
				e.preventDefault();
				startTimer($(element), 0);
			}
		});
		$(element).on('mouseenter mouseover',function (e) {
			clearTimeout(clearTimer);
		});
	};

	this.addItemByForm = (function(formID) {

		this.debug('addItemByForm',formID);
		if ($(formID).length == 0) {
			this.error('addItemByForm : unable to find formID',formID);
			alert('Internal error, unable to add item to cart');
			return false;
		}

		$.ajax({
			url:'/api/output/gm_cart_addItem'
			,type:'post'
			,data: $(formID).serialize()
			,dataType:'json'
			,beforeSend: function(jqXHR, settings) {
				document.cart.smallCartSpinner();
			}
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
				document.cart.smallCartSpinner('hide');
				alert(errorMessage);
			}
		});
		return false;
	});

}; /*cartClass*/

document.cart = new CartClass();

/* cart.js */
