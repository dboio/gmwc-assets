"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  /**
   * ***.wizard.js
   * by Christian Fillies
   * Modified: 9/28/2020
   */

  /** Globalized Functions and Prefixes **/
  var attrPrefix, classPrefix, functionPrefix, wizardEnv;
  classPrefix = window._global && _global.css ? _global.css : window.classPrefix ? window.classPrefix : 'os';
  functionPrefix = window._global && _global.env ? _global.env : window.functionPrefix ? window.functionPrefix : 'os';
  attrPrefix = window._global && _global.attr ? _global.attr : window.attrPrefix ? window.attrPrefix : 'os';

  if (!window[functionPrefix]) {
    window[functionPrefix] = {};
  }

  wizardEnv = window[functionPrefix]; //# os.wizard()

  window[functionPrefix].wizard = function () {
    var call, defaults, doc;
    call = this.wizard;

    if (call) {
      call.defaults = {
        debug: false || (window._global ? window._global.debug : false || wizardEnv.debugConsole && wizardEnv.debugConsole()),
        event: window.event,
        containerId: 'modalContents',
        modalClasses: false,
        closeButton: function closeButton() {
          return "<a href='javascript:void(0)' class='".concat(call.current.classes.close, "' onclick='").concat(functionPrefix, ".wizard.close(event)'>x</a>");
        },
        innerHtml: function innerHtml() {
          var backgroundImage, classes, closeButton, style;
          classes = {
            backdrop: call.current.classes.backdrop,
            dialog: call.current.classes.dialog,
            content: call.current.classes.content
          };
          closeButton = '';
          backgroundImage = '';

          if (typeof call.current.closeButton === 'function') {
            closeButton = call.current.closeButton();
          }

          if (call.current.modalClasses) {
            classes.backdrop = call.current.classes.modal.backdrop;
            classes.dialog = call.current.classes.modal.dialog;
            classes.content += ' ' + call.current.classes.modal.content;
          }

          if (call.current.backgroundColor || call.current.backgroundImage) {
            style = "style='";

            if (call.current.backgroundColor) {
              style += "background-color:".concat(call.current.backgroundColor, ";");
            }

            if (call.current.backgroundImage) {
              style += "background-image:url(".concat(call.current.backgroundImage, ")");
            }

            style += "'";
          }

          return "<div class='".concat(classes.backdrop, "'><div class='").concat(classes.dialog, "'><div class='").concat(classes.content, "' ").concat(style, "></div>").concat(closeButton, "</div></div>");
        },
        breakpoints: {
          xs: 375,
          sm: 576,
          md: 768,
          lg: 992,
          xl: 1200
        },
        classes: {
          selector: classPrefix + '-wizard',
          backdrop: classPrefix + '-wizard-backdrop',
          dialog: classPrefix + '-wizard-dialog',
          content: classPrefix + '-wizard-content',
          close: classPrefix + '-wizard-close',
          hidden: 'hidden',
          animation: 'fadeIn',
          modal: {
            selector: classPrefix + '-modal',
            backdrop: classPrefix + '-modal-backdrop',
            dialog: classPrefix + '-modal-dialog',
            content: classPrefix + '-modal-content'
          },
          width: {
            xs: classPrefix + '-wizard-xs',
            sm: classPrefix + '-wizard-sm',
            md: classPrefix + '-wizard-md',
            lg: classPrefix + '-wizard-lg',
            xl: classPrefix + '-wizard-xl'
          }
        }
      };
      defaults = call.defaults;
      call.fn = {
        id: function id(length) {
          var Length, charSet, i, id;
          Length = length || 24;
          id = '';
          charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          i = 0;

          while (i < Length) {
            id += charSet.charAt(Math.floor(Math.random() * charSet.length));
            i++;
          }

          return id;
        },
        classSelectors: function classSelectors(x) {
          var classes, defined;
          classes = x.split(' ');

          defined = function defined() {
            var j, len, results, sel;
            results = [];

            for (j = 0, len = classes.length; j < len; j++) {
              sel = classes[j];
              results.push('.' + sel);
            }

            return results;
          };

          return defined().join('');
        },
        valueConversion: function valueConversion(v, removeProperty) {
          var lowerCaseV, rv;
          rv = v;

          if (v) {
            v = v.trim();
          }

          if (v) {
            lowerCaseV = v.toLowerCase();

            if (lowerCaseV === 'true') {
              rv = true;
            }

            if (lowerCaseV === 'false') {
              rv = false;
            }

            if (lowerCaseV === '_null') {
              rv = null;
            }

            if (/^\d*$/.test(v)) {
              rv = parseInt(v);
            }
          } else if (v === null) {
            rv = null;
          } else {
            if (removeProperty) {
              rv = 'removeThisProperty';
            } else {
              rv = '';
            }
          }

          return rv;
        },
        removeProperty: function removeProperty(obj) {
          var prop;

          for (prop in obj) {
            if (obj[prop] === 'removeThisProperty') {
              delete obj[prop];
            }
          }

          return obj;
        },
        normalizeData: function normalizeData(data) {
          var dataObj, j, k, len, prop, v;
          dataObj = {};

          if (_typeof(data) === 'object' && !Array.isArray(data)) {
            dataObj = Object.assign(dataObj, data);
          }

          if (Array.isArray(data)) {
            data = data.join('&');
          }

          if (typeof data === 'string') {
            data = data.replace(/^\?/, '');
            data = data.split('&');

            for (j = 0, len = data.length; j < len; j++) {
              prop = data[j];
              k = prop.split('=')[0];
              v = prop.split('=')[1];

              if (v !== void 0) {
                dataObj[k] = call.fn.valueConversion(v);
              }
            }
          }

          return dataObj;
        },
        overrides: function overrides(args) {
          var arg, j, len, obj;
          obj = new Object();
          obj.data = {};

          for (j = 0, len = args.length; j < len; j++) {
            arg = args[j];

            if (arg instanceof Event) {
              obj.event = arg;
            } else if (_typeof(arg) === 'object') {
              if (Array.isArray(arg)) {
                obj.data = Object.assign(obj.data, call.fn.normalizeData(arg));
              } else {
                obj.data = Object.assign(obj.data, arg);
              }
            }
          }

          return obj;
        },
        assign: function assign(args) {
          var arg, entry, j, len, obj;
          obj = Object.assign({}, call.defaults);

          for (j = 0, len = args.length; j < len; j++) {
            arg = args[j];

            if (arg instanceof Event) {
              obj.event = arg;
            } else if (_typeof(arg) === 'object') {
              if (Array.isArray(arg)) {
                if (obj.data && !Array.isArray(obj.data) && Object.keys(obj.data).length) {
                  obj.data = Object.assign(obj.data, call.fn.normalizeData(arg));
                } else {
                  obj.data = call.fn.normalizeData(arg);
                }
              } else if (arg instanceof HTMLElement) {
                obj.srcElement = arg;
              } else if (arg instanceof jQuery) {
                obj.srcElement = arg[0];
              } else if (arg instanceof Event) {
                obj.event = arg;
              } else {
                for (entry in arg) {
                  if (obj[entry] && _typeof(arg[entry]) === 'object') {
                    if (Array.isArray(arg[entry])) {
                      arg = obj[entry].concat(arg[entry]);
                    } else if (arg[entry] instanceof HTMLElement) {
                      obj.srcElement = arg[entry];
                    } else if (arg[entry] instanceof jQuery) {
                      obj.srcElement = arg[entry][0];
                    } else if (arg[entry] instanceof Event) {
                      obj.event = arg[entry];
                    } else {
                      arg[entry] = Object.assign(obj[entry], arg[entry]);
                    }
                  }
                }

                obj = Object.assign(obj, arg);
              }
            }

            if (typeof arg === 'string') {
              if (arg.startsWith('.') || arg.startsWith('[') && arg.endsWith(']')) {
                obj.srcElement = doc.querySelector(arg);
              } else if (arg.startsWith('#')) {
                obj.srcElement = doc.getElementById(arg.replace('#', ''));
              } else {
                obj.name = arg;
              }
            }

            if (typeof arg === 'function') {
              obj.always = arg;
            }

            if (typeof obj.url === 'string') {
              obj.urlData = {};

              if (obj.url.includes('?')) {
                obj.urlData = Object.assign(obj.urlData, call.fn.normalizeData(obj.url.split('?')[1]));
                obj.url = obj.url.split('?')[0];
              }

              if (typeof obj.url === 'string') {
                obj.url = [obj.url];
              }
            }

            if (obj.data) {
              obj.data = call.fn.normalizeData(obj.data);
            }

            if (obj.urlData && Object.keys(obj.urlData).length) {
              if (!obj.data) {
                obj.data = {};
              }

              obj.data = Object.assign(obj.urlData, obj.data);
              delete obj.urlData;
            }
          }

          Object.keys(obj).map(function (key) {
            if (obj[key] === void 0) {
              return delete obj[key];
            }
          });
          obj.arguments = args;
          return obj;
        }
      };
      doc = document;

      call.observeWidth = function (ele) {
        ele.addEventListener('resize', function () {
          var i, j, k, l, len, len1, nextKey, ref, ref1;
          ref = Object.keys(defaults.breakpoints);

          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            k = ref[i];
            ele.classList.remove(defaults.classes.width[k]);
          }

          ref1 = Object.keys(defaults.breakpoints);

          for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
            k = ref1[i];
            nextKey = Object.keys(defaults.breakpoints)[i + 1];

            if (ele.offsetWidth <= defaults.breakpoints[k]) {
              ele.classList.add(defaults.classes.width[k]);

              if (nextKey) {
                return;
              }
            }
          }
        });
        return ele.hasWidhObserver = true;
      };

      call.fetch = function (urlIndex) {
        return new Promise(function (resolve, reject) {
          var fetchUrl, res;
          fetchUrl = call.current.url[urlIndex];
          res = {};
          fetch(fetchUrl).then(function (x) {
            var notFound;
            res = x;

            if (x.ok) {
              res = x.text();
            } else {
              notFound = new Error(res.statusText, res);
              reject(notFound);
            }

            return res;
          }).then(function (res) {
            var container, html, inner;
            html = res;

            if (call.current.containerId) {
              if (call.current.containerId.startsWith('#')) {
                call.current.containerId = call.current.containerId.replace('#', '');
              }

              if (res.includes('id="' + call.current.containerId + '"')) {
                container = doc.createElement('div');
                container.innerHTML = res;
                inner = container.querySelector('#' + call.current.containerId);
                html = inner.innerHTML;
              }
            }

            call.wizard.setAttribute('src', fetchUrl);
            return resolve(html);
          }).catch(function (x) {
            return reject(x);
          });
          return res;
        });
      }; //### TRIGGERS


      call.close = function (e) {
        var closestWizard, destroy, event;
        destroy = false;

        if (e === 'destroy') {
          destroy = true;
        }

        if (!call.wizard) {
          event = e || window.event;
          closestWizard = event.target.closest(call.fn.classSelectors(call.defaults.classes.selector));
        } else {
          closestWizard = call.wizard;
        }

        if (closestWizard && closestWizard.wizard) {
          call.current = closestWizard.wizard;
          call.wizard = closestWizard;
        }

        if (event) {
          call.current.event = event;
        }

        call.wizard.classList.remove(call.defaults.classes.animation);

        if (call.current.name) {
          closestWizard.classList.add(call.current.classes.hidden);
        } else {
          destroy = true;
        } //# correct event


        event = event || call.current.event || window.event;

        if (call.current.debug) {
          console.groupCollapsed('%c' + functionPrefix + '.wizard.close(event)', 'font-size:1.2em; margin: .6em 0 0; display: block');
          console.log('event', event);
          console.log('current', call.current);
          console.log('closestWizard', closestWizard);
          console.log('destroy', destroy);
          console.groupEnd();
        }

        if (destroy) {
          closestWizard.remove();
        }

        return call.noTrace();
      };

      call.next = function () {
        var currentUrl, event, nextUrl, nextUrlIndex, overrideObj; //# overrides, only data and event is overridable

        for (var _len2 = arguments.length, overrides = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          overrides[_key2] = arguments[_key2];
        }

        overrideObj = call.fn.overrides(overrides);

        if (Object.keys(overrideObj).length) {
          if (call.current.data && Object.keys(call.current.data).length) {
            overrideObj.data = Object.assign(call.current.data, overrideObj.data);
            overrideObj.data = call.fn.removeProperty(overrideObj.data);
          }

          call.current = Object.assign(call.current, overrideObj);
        }

        call.wizard.wizard = call.current; //# correct event

        event = overrideObj.event || call.current.event || window.event; //# get the next url

        currentUrl = call.wizard.getAttribute('src');
        nextUrlIndex = call.current.url.indexOf(currentUrl) + 1;
        nextUrl = call.current.url[nextUrlIndex];

        if (call.current.debug) {
          console.groupCollapsed('%c' + functionPrefix + '.wizard.next(event)', 'font-size:1.2em; margin: .6em 0 0; display: block');
          console.log('event', event);
          console.log('current', call.current);
          console.log('currentUrl', currentUrl);
          console.log('nextUrl', nextUrl);
          console.groupEnd();
        }

        if (nextUrl) {
          call.fetch(nextUrlIndex).then(function (res) {
            var nextEvent;
            call.wizard.querySelector(call.fn.classSelectors(call.defaults.classes.content)).innerHTML = res;

            if (typeof call.current.next === 'function') {
              nextEvent = event;
              nextEvent[attrPrefix + 'Wizard'] = call.current;
              return call.current.next(nextEvent);
            }
          });
        } else {
          call.complete();
        } //# prevent additional clicks


        if (event.target && event.target.getAttribute('onclick').includes(functionPrefix + '.wizard.next')) {
          return event.target.onclick = event.preventDefault();
        }
      };

      call.prev = function () {
        var currentUrl, event, overrideObj, prevUrl, prevUrlIndex; //# overrides, only data and event is overridable

        for (var _len3 = arguments.length, overrides = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          overrides[_key3] = arguments[_key3];
        }

        overrideObj = call.fn.overrides(overrides);

        if (Object.keys(overrideObj).length) {
          if (call.current.data && Object.keys(call.current.data).length) {
            overrideObj.data = Object.assign(call.current.data, overrideObj.data);
            overrideObj.data = call.fn.removeProperty(overrideObj.data);
          }

          call.current = Object.assign(call.current, overrideObj);
        }

        call.wizard.wizard = call.current; //# correct event

        event = overrideObj.event || call.current.event || window.event; //# get the next url

        currentUrl = call.wizard.getAttribute('src');
        prevUrlIndex = call.current.url.indexOf(currentUrl) - 1;

        if (prevUrlIndex === -1) {
          prevUrlIndex = 0;
        }

        prevUrl = call.current.url[prevUrlIndex];

        if (call.current.debug) {
          console.groupCollapsed('%c' + functionPrefix + '.wizard.prev(event)', 'font-size:1.2em; margin: .6em 0 0; display: block');
          console.log('event', event);
          console.log('current', call.current);
          console.log('currentUrl', currentUrl);
          console.log('prevUrl', prevUrl);
          console.groupEnd();
        }

        if (prevUrl) {
          call.fetch(prevUrlIndex).then(function (res) {
            var prevEvent;
            call.wizard.querySelector(call.fn.classSelectors(call.defaults.classes.content)).innerHTML = res;
            call.always(call.wizard);

            if (typeof call.current.prev === 'function') {
              prevEvent = event;
              prevEvent[attrPrefix + 'Wizard'] = call.current;
              return call.current.prev(prevEvent);
            }
          });
        } //# prevent additional clicks


        if (event.target && event.target.getAttribute('onclick').includes(functionPrefix + '.wizard.prev')) {
          return event.target.onclick = event.preventDefault();
        }
      };

      call.complete = function (event) {
        var completeEvent;

        if (typeof call.current.complete === 'function') {
          completeEvent = event || call.current.event || window.event;
          completeEvent[attrPrefix + 'Wizard'] = call.current;
          call.current.complete(completeEvent);
        }

        return call.close('destroy');
      };

      call.always = function (element) {
        var callbackEvent;
        call.current = element.wizard;

        if (call.current) {
          if (typeof call.current.always === 'function') {
            callbackEvent = call.current.event || window.event;
            callbackEvent[attrPrefix + 'Wizard'] = call.current;
            return call.current.always(callbackEvent);
          }
        }
      };

      call.noTrace = function () {
        delete call.current;
        return delete call.wizard;
      };

      call.build = function (args) {
        var beforeEvent;
        call.current = {};
        call.current = call.fn.assign(args); //# wizard already exists

        if (call.current.name) {
          call.wizard = doc.querySelector("[name='".concat(call.current.name, "']"));
        }

        if (call.wizard) {
          call.current = call.wizard.wizard;
          call.current.reopenCount++;
          call.wizard.wizard = call.current;

          if (call.wizard.classList.contains(call.current.classes.hidden)) {
            call.wizard.classList.remove(call.current.classes.hidden);
          }

          call.wizard.classList.add(call.defaults.classes.animation);
          return call.always(call.wizard);
        } else {
          if (typeof call.current.before === 'function') {
            beforeEvent = call.current.event || window.event;
            beforeEvent[attrPrefix + 'Wizard'] = call.current;
            call.current.before(beforeEvent);
          }

          call.wizard = doc.createElement('div');

          if (call.current.name) {
            call.wizard.setAttribute('name', call.current.name);
          }

          call.wizard.id = attrPrefix + 'Wizard-' + call.fn.id();
          call.wizard.classList.add(call.defaults.classes.selector);
          call.wizard.classList.add('animated');
          call.wizard.classList.add(call.defaults.classes.animation);

          if (call.defaults.modalClasses) {
            call.wizard.classList.add(call.defaults.classes.modal.selector);
          }

          call.wizard.innerHTML = call.defaults.innerHtml();
          doc.body.appendChild(call.wizard);
          call.current.reopenCount = 0;

          if (call.current.debug) {
            console.groupCollapsed('%c' + functionPrefix + '.wizard(arguments)', 'font-size:1.2em; margin: .6em 0 0; display: block');
            console.log('arguments', args);
            console.log('current', call.current);
            console.groupEnd();
          } //# call the first url in the array


          call.fetch(0).then(function (res) {
            var doneEvent;
            call.wizard = doc.getElementById(call.wizard.id);
            call.current.res = res;
            call.wizard.wizard = call.current;
            call.wizard.querySelector(call.fn.classSelectors(call.defaults.classes.content)).innerHTML = res;

            if (typeof call.current.done === 'function') {
              doneEvent = call.current.event || window.event;
              doneEvent[attrPrefix + 'Wizard'] = call.current;
              call.current.done(doneEvent);
            }

            return call.always(call.wizard);
          }).catch(function () {
            return call.close();
          });

          if (!call.wizard.hasWidhObserver) {
            return call.observeWidth(call.wizard);
          }
        }
      }; //# default inits


      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return call.build(args);
    }
  }; //# init when page has finished loading


  if (document.readyState && (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll)) {
    window[functionPrefix].wizard();
  } else {
    document.addEventListener('DOMContentLoaded', window[functionPrefix].wizard);
  }
}).call(void 0);

//# sourceMappingURL=os.wizard.js.map