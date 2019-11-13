/*!
  * Modified: 11/12/2019
 */

// main menu functionality
  // resize the horizontal main menu to fit in the breadcrumb area
    Array.prototype.sum = function () {
        for (var total = 0,l=this.length;l--;total+=this[l]); return total;
    };
    var resizeMainMenu = function (element) {
        var element = element;
        var containerWidth = element.outerWidth() - 1;
        var otherItems = element.children(':visible:not(.menu-section)');
        var otherItemsWidth = [];

        otherItems.each(function(){
            otherItemsWidth.push($(this).outerWidth());
        });

        var newMenuWidth = containerWidth - (otherItemsWidth.sum());
        $('.menu-section').css('width', newMenuWidth - 1);

        // resize the main menu OL for horizontal overflow
        var mainMenuWidth = [];
        $('.menu-main li').each(function(){
            mainMenuWidth.push($(this).outerWidth());
        });
        var mainMenu = (newMenuWidth >= mainMenuWidth.sum() ? newMenuWidth : mainMenuWidth.sum() + 40);
        $('.menu-main .nav').css('width', mainMenu - 2);

        // resize the breadcrumbs UL for horizontal overflow
        var breadcrumbsWidth = [];
        $('.breadcrumb li').each(function(){
            breadcrumbsWidth.push($(this).outerWidth());
        });
        var breadcrumbMenu = (newMenuWidth >= breadcrumbsWidth.sum() ? newMenuWidth : breadcrumbsWidth.sum() + 40);
        $('.menu-breadcrumbs .breadcrumb').css('width', breadcrumbMenu - 2);
    };
$(document).ready(function() {
  $('a[href~="#toggleMenus"]').click(function() {
    $(this).toggleClass('active');
    $('.menu-section').toggleClass('active');
  });
  resizeMainMenu($('.breadcrumb-area'));
  $( window ).resize(function() {
    resizeMainMenu($('.breadcrumb-area'));
  });
});

// Resize Navigation on scroll
$(document).on('scroll', function() {
  var distance = $('.navbar-top').is( '.navbar-with-small-cart') ? 60 : 110;
  if($(document).scrollTop() > distance) {
    $('.navbar-top').addClass('navbar-fixed-top');
  } else {
    $('.navbar-top').removeClass('navbar-fixed-top');
  }
});





// setup horizontal scrolling of items
var horizontalItemScroll = function (element, rowCount) {
  var element = element;
  var itemCount = rowCount;
  if (element) {
      element = element;
      element.find(".scroll-container" )
          .parent('.panel-body')
          .addClass('panel-body-horizontal-scroller');
  } else {
      element = $('.panel-body');
      element.find(".scroll-container" )
          .parent('.panel-body')
          .addClass('panel-body-horizontal-scroller');
  }
  if (itemCount) {
      itemCount = rowCount;
  } else {
      itemCount = element.find(".thumbnail" ).length;
  }
  var itemWidth = element.find(".thumbnail" ).outerWidth();
  element.find(".scroll-container" ).css('width', itemCount * itemWidth + itemCount + 20);
};
$(".panel-body" ).each(function() {
  horizontalItemScroll($(this));
});

/*
 *
 * **************************** Moved to checkout.js by thomas ***********************
 *
 *
// toggle gift area on off
var $giftOnOffSwitch = function(handle) {
  if(handle.prop("checked")) {
      $('#giftOnOffContainer').show().dboForms();
    } else {
      $('#giftOnOffContainer').hide();
    }
};
$(document).ready(function() {
  $('input[name~="giftOnOff"]').change(function(){
    $giftOnOffSwitch($(this));
  });
  $(document).ready(function() {
    $giftOnOffSwitch($('input[name~="giftOnOff"]'));
  });
});


// gift message editor
$('#giftMessage').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var message = $.trim(button.html()); // get the content
  var modal = $(this);
  modal.find('#message-text').val(message).focus();
});

 *
 *
 * **************************** Moved to checkout.js by thomas ***********************
 *
 */

// gift card selector
var $giftCardSelector = function() {
  $('.panel-grid .thumbnail-grid.gift-card').each(function() {
        var $this = $(this);
        var $container = $this.parents('.panel-grid');

        $this.find('a').click(function(e) {
            e.preventDefault();
            $container.find('.thumbnail-grid.gift-card').removeClass('active');
            $('#_selected_mediaID').val($(this).data('mediaid'));
            $this.addClass('active');
        });

    });
};
$(document).ready(function() {
    $giftCardSelector();
});


// ship to address
$('#shipTo').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  // get the content
  var street = $.trim(button.find('[data-shipto~="street"]').html());
  var city = $.trim(button.find('[data-shipto~="city"]').html());
  var state = $.trim(button.find('[data-shipto~="state"]').html());
  var stateVal = $.trim(button.find('[data-shipto~="state"]').data('value'));
  var zip = $.trim(button.find('[data-shipto~="zip"]').html());
  var modal = $(this);
  modal.find('#shipto-street').val(street).focus();
  modal.find('#shipto-city').val(city);
  modal.find('#shipto-state').html(state).next('.input').val(stateVal);
  modal.find('#shipto-zip').val(zip);
});


// tag search input
$(document).ready(function() {

    $('.tagsearch-row').each(function() {
        var $this = $(this);
        var $input = $this.find('input');
        var $container = $this.find('.input_container');
        $this.click(function() {
            $input.focus();
            $container.addClass('focus');
            $('html').addClass('tagsearch-active');
        });
        $input.blur(function() {
            $container.removeClass('focus');
            $('html').removeClass('tagsearch-active');
        });
        $(document).mouseup(function(e)  {
            if(e.target.id !== $container.attr('id') && !$container.has(e.target).length) {
                $container.removeClass('focus');
                $('html').removeClass('tagsearch-active');
            }
        });
        $container.parents('.collapse').on('shown.bs.collapse', function () {
          $container.parents('.dbo_form').dboForms();
        });

    });
});


// custom credit card selector
$(document).ready(function() {
    $('.type_creditcard').each(function(index, ele) {
        var $this = $(ele);
        var $input = $this.find('.input');
        var $inputContainers = $input.parent('.input_container');

        $inputContainers.click(function() {
            $(this).find('.input').focus();
        });
        $input.focus(function() {
            var $inputContainer = $(this).parent('.input_container');
            $(this).addClass('full-width');
            $inputContainer.addClass('focus');
            $inputContainers.css('width', '10%');
            $inputContainer.css('width', '80%');
        });
        $input.blur(function() {
            var $inputContainer = $(this).parent('.input_container');
            $(this).removeClass('full-width');
            $inputContainer.removeClass('focus');
            $inputContainers.css('width', '');
            if ($(this).val().length === 0) {
                $this.removeClass('value_set');
            } else {
                $this.addClass('value_set');
            }
        });

    });
});


// confirm password
$(document).ready(function() {
  $(".confirm_password").each(function(index, ele) {
    var $this              = $(this);
    var $confirmInput      = $this.find('.input');
    var $passwordContainer = $this.prev('.form_row');
    var $passwordInput = $passwordContainer.find('.input');
    $confirmInput.blur(function() {
      if ($confirmInput.val() !== $passwordInput.val()) {
        $this.addClass('error');
        $passwordContainer.addClass('error');
      } else {
        $this.removeClass('error');
        $passwordContainer.removeClass('error');
      }
    });
  });
});


// close smarty when closing modal
var $closeSmarty = function() {
  $('.smarty-autocomplete').parent('.smarty-ui').css('display', 'none');
  $('.smarty-popup').parent('.smarty-ui').remove();
  $('.smarty-dots').css('display', '');
};
$(document).ready(function() {
  $('a.close[data-smarty~="hide"]').each(function(){
    $(this).click(function () {
      $closeSmarty();
    });
    $(this).parents('.modal').click(function () {
      $closeSmarty();
    });
  });
});

/*
// swipe support for carousel
$(function() {
  $(".carousel-inner").swipe( {
    //Generic swipe handler for all directions
    swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
      $(this).parent().carousel('prev');
    },
    swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
      $(this).parent().carousel('next');
    }
  });
});
*/


// main.js
