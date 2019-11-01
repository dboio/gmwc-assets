// Avoid `console` errors in browsers that lack a console.
(function () {
  var method;
  var noop = function () {
  };
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

// Place any jQuery/helper plugins in here.


// initiate switchery
$(document).ready(function () {
  if ($('.js-switch')) {
    var elems = Array.prototype.slice.call($('.js-switch'));

    elems.forEach(function (html) {
      var switchery = new Switchery(html, {
        size: 'small',
        color: '#fa2e89',
        secondaryColor: '#DFDFDF',
        jackColor: '#fff'
      });
    });

  }
});

// initiate dbo.forms & additional functions
$(function () {

  // form elements in bootstrap tabs are initiated
  $('a[data-toggle~="tab"]').on('shown.bs.tab', function (e) {
    $($(e.target).data('dboform')).find('.dbo_form').dboForms();
  });
  // form elements in bootstrap modals are initiated
  $('.modal').on('shown.bs.modal', function (e) {
    $($(e.relatedTarget).data('target')).find('.dbo_form').dboForms();
  });

  // closing/removing a list-group-item
  $('[data-dismiss~="list-group-item"]').click(function () {
    $(this).parents('.list-group-item').remove();
  });

});


// setup fancybox
var fancyBoxOptions = {
  openEffect: 'elastic',
  closeEffect: 'elastic',
  wrapCSS: 'modal-dialog',
  padding: 0,
  maxWidth: 900,
  closeBtn: $('[data-dismiss="modal"]'),
  //fitToView: true,
  afterShow: function () {
    // dbo forms to work with fancybox
    $($.fancybox.wrap).find('.dbo_form').dboForms();

    // prepend a link out for images
    if ($(this.element).hasClass('fancybox-target-blank')) {
      $('<a class="dimension-grid resize-out" href="' + this.href + '"><i class="icon glyphicon glyphicon-resize-full"></i></a>').prependTo(this.inner);
    }
  },
  helpers: {
    title: null
  },
  inline: {
    scrolling: 'auto'
  },
  tpl: {
    closeBtn: '<a href="#close" class="close dimension-grid fancybox-item fancybox-close dimen" data-dismiss="fancybox" aria-label="Close"><i class="icon glyphicon glyphicon-remove"></i></a>',
    image: '<div class="large-image"><img class="fancybox-image" src="{href}" alt="" /></div>',
    //next     : '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
    //prev     : '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
  }
};
$(function () {
  $('[data-dismiss~="fancybox"]').click(function () {
    $.fancybox.close();
  });

  // conbert fancybox template to bootstrap layout
  jQuery(".fancybox").fancybox(fancyBoxOptions);
});

// plugins.js
