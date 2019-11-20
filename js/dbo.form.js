/*!
 * dbo.form.js
 * by Christian Fillies
 * Modified: (11/20/2019)
 *
 */

jQuery.fn.extend  ({
  fieldFocus : function (focusClass) {
    return jQuery(this).each(function() {
      var $this   = jQuery(this);
      jQuery(this).click(function() {
        if (jQuery(this).find('.input:not([disabled]), .bootstrap-tagsinput input')) {
          $this.parents('.dbo_form, form' ).find('.'+focusClass).removeClass(focusClass);
          $this.find('.input_container:not(.view_only)').addClass(focusClass);
          if (jQuery(this).find('.input:not([disabled])').is('textarea') === false) {
            jQuery( this ).find( '.input:not([disabled])' ).focus();
          }
        }
        jQuery(this).find('.input:not([disabled]), .bootstrap-tagsinput input').focus(function() {
          $this.parents('.dbo_form, form' ).find('.'+focusClass).removeClass(focusClass);
          $this.find('.input_container:not(.view_only)').addClass(focusClass);
          jQuery(this).find('select').click();
        });
      });
      jQuery(this).find('.input:not([disabled]), .bootstrap-tagsinput input').focus(function() {
        $this.parents('.dbo_form, form' ).find('.'+focusClass).removeClass(focusClass);
        $this.find('.input_container:not(.view_only)').addClass(focusClass);
      });
      jQuery(this).find('.input:not([disabled]), .bootstrap-tagsinput input').blur(function() {
        $this.find('.input_container:not(.view_only)').removeClass(focusClass);
      });
    });
  }
});


jQuery.fn.extend({
  dboForms: function() {
    var $css = {
      formRow: 'form_row', // each individual row of a set of inputs and labels
      error: 'error', // gets added to the formRow when the input returns an error
      container: 'input_container', // the container holding one input
      input: 'input', // the input, textarea or select within the container
      onChangeHook: 'onChangeHook', // the hidden input used to monitor for changes
      icon: 'i.dbo', // selector for the icon based on fonts
      menu: 'ui-menu', // selector for jquery-ui menu
      picker: 'type_picker', // alt style for pickers - a dropdown before another input or dropdown
      placeholder: 'placeholder', // for the placeholder text
      choice: 'choice', // the choice when a option or menu-item is picked
      hint: 'hint', // area within the container, before the input
      tagsinput: 'bootstrap-tagsinput', // if bootstrap taginput plugin is used
      hasHint: 'input_container_with_hint', // gets added to the container, when container has hint
      triggers: 'input_triggers', // area within the container, trailing the input for holding buttons like combobox-arrows
      hasTriggers: 'input_container_with_btns', // gets added to the container, when container has triggers
      button: 'btn', // a form button
      handle: 'handle', // secondary click handler applied to a label to trigger an input focus
      hasValue: 'value_set', // gets added to container, when unput has a value
      disabled: 'disabled', // when a button or input is disabled
      active: 'active', // when a button or input is active
      focus: 'focus', // when a button or input is focused
      fullScreen: 'full_screen' // gets added to body, when a textarea is enlarged to full_screen
    };
    debug = (function(msg,object) {
      var loc = window.location.toString().toLowerCase();
      if (loc.indexOf("debugforms") > -1)
      {
        if (msg !== undefined) {
          if (object !== undefined) {
            console.debug("dbo.forms: " + msg, object);
          } else {
            console.debug("dbo.forms: " + msg);
          }
        }
        return true;
      }

    });
    error = (function(msg,object) {
      var loc = window.location.toString().toLowerCase();
      if (loc.indexOf("debugforms") > -1)
      {
        if (msg !== undefined) {
          if (object !== undefined) {
            console.error("dbo.forms: " + msg, object);
          } else {
            console.error("dbo.forms: " + msg);
          }
        }
        return true;
      }

    });
    debug('intializing',null);

    this.find('[data-tooltip="true"]').tooltip();

    this.find('.' + $css.formRow).fieldFocus($css.focus);


    // the following specifies all type of inputs and specifies a default set of classes and settings
    this.find('.' + $css.container).not('.' + $css.button).each(function(index, ele) {
      var $this = jQuery(ele), //jQuery(this),
        $fieldWidth = $this.outerWidth(),
        $input = $this.find('.' + $css.input),
        $inputType = $input.attr('type'),
        $inputWidth = $fieldWidth,
        $inputValue = $input.val(),
        $parent = jQuery(ele).parent('.' + $css.formRow), //jQuery(this).parent('.'+$css.formRow ),
        $disabled = $input.attr('disabled'),
        $hint = $this.find('.' + $css.hint),
        $hintWidth = 0,
        $choice = $this.find('.' + $css.choice),
        $triggers = $this.find('.' + $css.triggers),
        $triggersWidth = 0,
        $placeholder = $this.find('.' + $css.placeholder),
        $setWidthTo = $this.find('.' + $css.input + ', .' + $css.placeholder + ', .' + $css.choice + ', .' + $css.tagsinput),
        $bugFixWidth = 0; // -1 because of textarea bug

      if ($input.length > 0) {
        debug($css.container + ' loop: input: ', $input);
      } else {
        error($css.container + ' loop: no input with a class of "input" found in ', $this);
      }

      if ($triggers.length) {
        $this.addClass($css.hasTriggers);
        $triggersWidth = $triggers.outerWidth();
        $bugFixWidth = 1;
      }
      if ($this.find('textarea').length) {
        $bugFixWidth = 2;
      }
      if ($hint.length) {
        $this.addClass($css.hasHint);
        $hintWidth = $hint.outerWidth();
      }
      if ($hint.length || $triggers.length) {
        $inputWidth = $fieldWidth - $hintWidth - $triggersWidth - $bugFixWidth;
      }
      if ($inputType === 'number') {
        $inputWidth = $inputWidth - 5;
      }

      $setWidthTo.css({
        'width': $inputWidth,
        'margin-left': $hintWidth,
        'margin-right': $triggersWidth
      });

      if ($disabled === 'disabled') {
        $parent.addClass($css.disabled);
      }

      if ($inputValue === '' || $inputValue === null || (typeof $inputValue === "undefined") ) {} else {
        debug($css.container + ' loop: value [' + $inputValue + '] found, adding $css.hasVaue', null);
        $parent.addClass($css.hasValue);
        $parent.find('[data-event~="clear_input"]').fadeIn();
      }

      $input.click(function() {
        debug($css.container + ' loop: click detected, adding $css.hasVaue', null);
        $parent.addClass($css.hasValue);
        $parent.find('[data-event~="clear_input"]').fadeIn();
      });

      $input.blur(function() {
        if (jQuery(this).val() === '' || jQuery(this).val() === null || (typeof jQuery(this).val() === "undefined")) {
          $parent.removeClass($css.hasValue);
          $parent.find('[data-event~="clear_input"]').fadeOut();
          debug('blur detected, no value, removing $css.hasVaue', jQuery(this));
        } else {
          $parent.addClass($css.hasValue);
          $parent.find('[data-event~="clear_input"]').show();
          debug('blur detected, has value, adding $css.hasVaue',  jQuery(this));
        }
      });

      $parent.find('[data-event~="clear_input"]').each(function() {
        var $clear = jQuery(this);
        $clear.hide();
        $clear.click(function() {
          $clear
            .parents('.' + $css.container)
            .find('.' + $css.input)
            .val('');
          $clear
            .parents('.form_row ')
            .removeClass($css.hasValue);
        });
      });
    }); // this.find('.'+$css.container).not('.'+$css.button).each(function(index, ele)

    this.find('.input[type="email"]').unbind("change");
    this.find('.input[type="email"]').change(function() {
      var $validEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        $email = jQuery(this).val();
      if (!$validEmail.test($email)) {
        jQuery(this).parents('.' + $css.formRow).addClass($css.error);
      } else {
        jQuery(this).parents('.' + $css.formRow).removeClass($css.error);
      }
    });

    this.find('.type_textarea').each(function(ndx, ele) {
      var $this = jQuery(ele),
        $textarea = $this.find('textarea');
    }); // this.find('.type_textarea').each(function(ndx,ele)

    this.find('.type_toggle').each(function(ndx, ele) {
      var $valueFrom = jQuery(ele).find('.form_btn, .' + $css.button).attr('data-toggle-from');
      var $iconFrom = $valueFrom;
      var $valueTo = jQuery(ele).find('.form_btn, .' + $css.button).attr('data-toggle-to');
      var $iconTo = $valueTo;
      var $toggleInput = jQuery(ele).find('.' + $css.input);
      var $toggleIcon = jQuery(ele).find($css.icon);
      debug('.type_toggle', jQuery(ele));
      if (jQuery(ele).find('.form_btn, .' + $css.button).attr('data-toggle-iconTo')) {
        $iconTo = jQuery(ele).find('.form_btn, .' + $css.button).attr('data-toggle-iconTo');
      }
      if (jQuery(ele).find('.form_btn, .' + $css.button).attr('data-toggle-iconFrom')) {
        $iconFrom = jQuery(ele).find('.form_btn, .' + $css.button).attr('data-toggle-iconFrom');
      }
      var $toggler = function $toggler() {
        var newValue;
        if (setTo) {
          // Code from the first handler here;
          newValue = $valueTo;
          $toggleIcon.removeClass($iconFrom).addClass($iconTo);
          debug('.type_toggle: changing to iconTo.', null );
        } else {
          // Code from the second handler here;
          newValue = $valueFrom;
          $toggleIcon.removeClass($iconTo).addClass($iconFrom);
          debug('.type_toggle: changing to iconFrom.', null );
        }
        if ($toggleInput.val() !== newValue) {
          //if there is a new value, update it
          debug('.type_toggle: changing input from:' + $toggleInput.val() + ' to:' + newValue, null );
          $toggleInput.val(newValue).change();
        }
        setTo = !setTo; // Invert `first`
      };

      jQuery(ele).unbind('click');
      jQuery(ele).find('a.btn').bind('click', $toggler);
      var setTo = true;
      if ($toggleInput.val() === $valueFrom) {
        var setTo = false;
      }
      $toggler();

    }); // this.find('.type_toggle').each(function(ndx,ele)

    this.find('.type_combo, .type_combined, .type_picker, .type_message-history').each(function(ndx, ele) {
      var $this = jQuery(ele);
      var $input = $this.find('.' + $css.input);
      var $button = $this.find('button');
      var $onChangeHook = $this.find('.' + $css.onChangeHook);
      var $menu = $this.find('.menu > ul');
      var $choice = $this.find('.' + $css.choice);
      var $triggers = $this.find('.' + $css.container + ', label, .form_btn, .' + $css.button);
      if ($input.is("textarea")) {
        $triggers = $this.find('.' + $css.triggers +', label, .form_btn, .' + $css.button);
      }
      var $row = $this;
      var $twoPicker = false;
      var $formRow = $row.parent('.' + $css.formRow);
      var $container = $row.find('.' + $css.container);
      //var position   = $input.offset();
      var $width = $container.width();

      var $inputID = $input.attr('id');
      var $inputName = $input.attr('name');
      var $inputType = $input.attr('type');
      debug('type_combo||type_combined||type_picker||type_message-history', $input);
      if ($width < 201) {
        $width = 200;
      }
      if ($this.is('.' + $css.picker)) {
        $container = $row.find('.' + $css.container + ', .form_btn, .' + $css.button);
      }
      // specifies if the input is of type text or is textarea
      if ($input.is( ":text" ) || $input.is("textarea")) {
        $row.addClass('has-text-input');
      }

      if ($formRow && $formRow.find('.' + $css.picker).length > 1) {
        $twoPicker = true;
      }

      var
        menuObj = {
          focus: function(event, ui) {
            var $item = $(ui.item);
            $row.addClass($css.focus)
              .find('.' + $css.button).addClass($css.focus)
              .find($css.icon).addClass($css.active);
            $row.find('.' + $css.container).addClass($css.focus);
            // $item.find('> a').focus();
            $item.focus(); // focus is a must, so the ENTER gets the correct target
          },
          blur: function(event, ui) {
            $row.removeClass($css.focus)
              .find('.' + $css.button).removeClass($css.focus)
              .find($css.icon).removeClass($css.active);
            $row.find('.' + $css.container).removeClass($css.focus);
          },
          select: function( event, ui ) {

            // debugger;
            var
              $this = $(ui.item).find('> a'),
              $val = $this.attr('data-value'),
              $altChoice = $this.attr('data-choice'),
              $altIcon = $this.attr('data-icon-choice'),
              $html = $this.html(),
              $isText = $this.text(),
              $text = $isText.trim(),
              $valToSet = (($val === "_blank") ? '' : $val );
            debug('click detected on li a', $this);

            if ($choice.length) {
              if ($altChoice) {
                $choice.html($altChoice);
              } else if ($altIcon) {
                $choice.html($text);
                $choice.prepend('<i class="dbo ' + $altIcon + '"></i>');
              } else if ($altIcon && $altChoice) {
                $choice.html($altChoice);
                $choice.prepend('<i class="dbo ' + $altIcon + '"></i>');
              } else {
                $choice.html($html);
              }
            }

            //	debugger;
            // look through all the data attributes and find any that begin with data-value-
            //debug('looping through data attributes',null);
            for (var i = 0, atts = $this[0].attributes, n = atts.length; i < n; i++){
              var tokenName = atts[i].nodeName;
              if(tokenName.substring(0,11) === 'data-value-' && tokenName !== 'data-value-1' && tokenName !== 'data-value-2' ) {
                // custom data value found
                debug('custom data value:: ' + tokenName, null);
                tokenName = '.' + tokenName.substring(11,tokenName.length);
                var tokenValue = atts[i].nodeValue;
                var tokenInput = $row.find(tokenName);
                if (tokenInput.length) {
                  debug('custom data value: matching input found, setting value: ' + tokenValue, null);
                  tokenInput.val(tokenValue).change();
                } else {
                  error('custom data value: Unable to find hidden input with class "' + tokenName + '"', null);
                }
              }
            }

            if ($val) {
              $input.val($valToSet).change();
              if ($onChangeHook.length) {
                $onChangeHook.trigger('change');
              }
            } else {
              $input.val($text).change();
              if ($onChangeHook.length) {
                $onChangeHook.trigger('change');
              }
            }

            // append the bootstrap modal function
            if ($this.data('toggle') === 'modal') {
              var $modal = $this.data('target');
              // $($modal).modal('show'); // dont call 'show' as [data-toggle="modal"] with a true [data-target] is already bound to bootstrap modal show. Double bind will open and close immediately
              // and now add dbo_forms() again
              $($modal).on('shown.bs.modal', function (e) {
                $($modal).find('.dbo_form' ).dboForms();
                $($modal).find('.dbo_form .input').first().focus();
                $($modal).find('.dbo_form .input').first().val($valToSet);
              });
              // todo: here we need to add a function to move values back and forth
            }


            $menu.hide();
            // this this removes the abillity for touch devices to close menus on body.click
            $('body').css('cursor', '');

            $row.removeClass($css.focus).addClass($css.hasValue)
              .find('.' + $css.button).removeClass($css.focus)
              .find($css.icon).removeClass($css.active);
            $row.find('.' + $css.container).removeClass($css.focus);


            // if using "_blank" in data-value --> nothing gets passed
            if ($val === '_blank') {
              $input.focus().val('').change();
              $row.addClass($css.focus).removeClass($css.hasValue);
              $choice.html('');
              $menu.hide();
            }

            // reinstate focus, so the tab will work,
            // and the user can tab to the next input in the form
            $row.focus();

            return false;
          }
        }
      ;
      $menu.menu(menuObj)
        .css('width', $width + 'px')
        .find('.' + $css.menu)
        .css('width', $width / 2 + 'px');

      // add RETURN & ESC KEY as selector
      $(document).off('keydown.menu keyup.menu').on('keydown.menu keyup.menu', function (event) {
        if (event.which === 13 && event.type === 'keydown' &&
          $(event.target).closest('.ui-menu-item') &&
          $(event.target).closest('.ui-menu-item').length) {
          $(event.target).closest('a').trigger('click.menu.item');
        }
        if (event.which === 27 && event.type === 'keyup' && $(event.target).closest('.ui-menu').length) {
          $('.' + $css.menu).hide();
        }
      });

      // $triggers.off('click.menu');
      $triggers.on('click.menu', function(event) {
        $row.parents('.dbo_form, form').find('.' + $css.focus).removeClass($css.focus);
        $row.addClass($css.focus)
          .find('.' + $css.button).addClass($css.focus)
          .find($css.icon).addClass($css.active);
        $row.find('.' + $css.container).addClass($css.focus);
        $('.' + $css.menu).hide();
        $menu
          .show()
          .position({
            my: "left top",
            at: "left bottom",
            of: $container,
            collision: "flipfit"
          })
        ;
        $menu.menu('focus', null, $menu.find('.ui-menu-item:first'));

        // this enables touch devices to close menus on body.click
        $('body').css('cursor', 'pointer');
        return false;
      });

      $button.on('focus.menu.button', function () {
        $triggers.trigger('click.menu');
      });

      //$input.unbind();
      $input.focus(function() {
        $row.addClass($css.focus).find('.' + $css.button).addClass($css.focus).find($css.icon).addClass($css.active);
        $row.find('.' + $css.container).addClass($css.focus);
        $('.' + $css.menu).hide();
        if (!$input.is('textarea')) {
          $menu.show();
        }
        // this enables touch devices to close menus on body.click
        $('body').css('cursor', 'pointer');
        return false;
      });

      $input.blur(function() {
        $row.removeClass($css.focus).find('.' + $css.button).removeClass($css.focus).find($css.icon).removeClass($css.active);
        $row.find('.' + $css.container).removeClass($css.focus);
        $('.' + $css.menu).hide();
        // reinstate focus, so the tab will work,
        // and the user can tab to the next input in the form
        $row.focus();
        return false;
      });

      // close menu on close outside
      var $closeMenuOutside = function() {
        $('body').on('click.menu.close', function(event) {
          if (event.type === 'click') {
            if ($(event.target).closest($menu).length || $menu.is(event.target) || $input.is(event.target)) {
            } else {
              $menu.hide();
              $('body').off('click.menu.off');
              // this this removes the ability for touch devices to close menus on body.click
              $('body').css('cursor', '');
              // reinstate focus, so the tab will work,
              // and the user can tab to the next input in the form
              $row.focus();
            }
          }
        });
      };
      $menu.mouseleave(function() {
        $closeMenuOutside();
      });
      $this.mouseleave(function() {
        $closeMenuOutside();
      });

      jQuery('body').off('click.menu.off');
      jQuery('body').on('click.menu.off', function(event) {
        if ($(event.target).closest($menu).length || $menu.is(event.target) || $input.is(event.target)) {
        } else {
          $menu.hide();
          // this this removes the abillity for touch devices to close menus on body.click
          $('body').css('cursor', '');
          // reinstate focus, so the tab will work,
          // and the user can tab to the next input in the form
          $row.focus();
        }
      });

      // make sure .focus stays added as long as someone types
      $input.keypress(function() {
        if (!$row.hasClass($css.focus)) {
          $row.addClass($css.focus);
        }
      });


    }); // this.find('.type_combo, .type_combined, .type_picker').each(function(ndx,ele)


    // password confirmation
    this.find('.type_confirm-password').each(function(index, ele) {
      var $this              = $(this);
      var $confirmInput      = $this.find('.'+$css.input);
      var $passwordContainer = $this.prev('.'+$css.formRow);
      var $passwordInput = $passwordContainer.find('.'+$css.input);
      $confirmInput.blur(function() {
        if ($confirmInput.val() !== $passwordInput.val()) {
          $this.addClass($css.error);
          $passwordContainer.addClass($css.error);
        } else {
          $this.removeClass($css.error);
          $passwordContainer.removeClass($css.error);
        }
      });
    });


    // datepicker
    this.find('.type_date').each(function(index, ele) {
      var $this        = $(this),
        $inputWidth  = $this.width(),
        $input       = $this.find($css.input ),
        $btn         = $this.find('[data-event~="jquery-ui_cal"]' ),
        $placeholder = $this.find('.'+$css.placeholder ),
        $btnsWidth   = $this.find('.'+$css.triggers).width();
      $input
        .datepicker({
          altField: $input,
          altFormat: "mm-dd-yy",
          onSelect: function() {
            $placeholder.hide();
            $this.addClass($css.hasValue);
          }
        })
        .css('width', $inputWidth-($btnsWidth*2)-20);
      $btn.click(function() {
        $input.datepicker('show');
        $input.datepicker('refresh');
        return false;
      });

      $input.blur(function() {
        if ($input.val() === '') {
          $placeholder.show();
        } else {
          $this.addClass($css.hasValue);
        }
      });
    });


  } // dboForms : function ()
}); // jQuery.fn.extend  

$.fn.donetyping = function(callback, delay){
  delay || (delay = 1000);
  var timeoutReference;
  var doneTyping = function(elt){
    if (!timeoutReference) return;
    timeoutReference = null;
    callback(elt);
  };

  this.each(function(){
    var self = $(this);
    self.on('keyup',function(){
      if(timeoutReference) clearTimeout(timeoutReference);
      timeoutReference = setTimeout(function(){
        doneTyping(self);
      }, delay);
    }).on('blur',function(){
      doneTyping(self);
    });
  });

  return this;
};






jQuery(function() {
  jQuery('.dbo_form' ).dboForms();
});

jQuery(window ).resize(function() {
  jQuery('.dbo_form' ).dboForms();
});

/* dbo.form.js */

