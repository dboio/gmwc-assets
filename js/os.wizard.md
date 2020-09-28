# *.wizard.js

Script to activate and build modal type wizards.

## Functions
General wizard script is bound under the environment, ie `rocket` or `os`. So the following functions are dot-chained under form, ie `os.wizard`.
#### INIT
``` html
 <button type="button" class="btn btn-info btn-xs" onclick="os.wizard(
          this, event, {
            url: 'testURL',
          name: 'My Wizards',
          event: event,
          data: { mix: 1 },
          container: $('.container'),
          classes: { another: 'test', se$lector: 'custom' },
          before: function(x) { console.warn('beforeEvent', x) },
          done: function(x) { console.warn('builtEvent', x) }
        }, function(x) { console.warn('callback', x)}, ['data=true'])">Wizard</button>
      </div>
```

### NEXT and PREV
Load the next or previous widget screen within an existing screen. Based on the url array that is defined.
```javascript
*.widget.next(overrides)
*.widget.prev(overrides)
```
* `overrides` [array|plain object|event]
Next call allows you to override two main properties. The current event as `event` property and data that you may pass into the next or previous load. The data you add here extends the data from the original init, e.g. `os.widget.next(event, { override: 'data' })`. If you want to remove an exact data property, you need to set the properties value to `'removeThisProperty'`, e.g. `os.widget.next({ override: 'removeThisProperty' })`.

## Properties and Settings
    
- #### `this` [HTMLElement Selector|jQuery Selector|querySelector|ElementById]
    * Define the HTMLElement that the `wizard` is called from, in the case the function is called from an object event. To retreive this property, the actual element that is found in the dom tree is returned as `.srcElement` form the wizard property object.
    
- #### `event` [Event] (readonly)
    - returns the original event that fired the wizard.
    
- #### `arguments` [array] (readonly)
    - returns the original arguments that were used to build the widget.
    
- #### `name` [string]
    * When a name property is defined, the wizard becomes 're-usable', as the dom is only built once and referred to from then on. **default** is `undefined`, which will build wizards with each event.
    
- #### `id` [string] (readonly)
    * The ID of the current wizard.
    
- #### `debug` [boolean]
    * Default is `false`. When `true`, enables console log reporting.
    
- #### `url` [string|array]
    * Define the url that is fetched inside the wizard. As array, the first url is fetched. The following are fetched when navigating thru the wizard steps.
    
- #### `modalClasses` [boolean]
    * Use os modal classes instead. **default** is `false`. If set to `true`, the `os-modal` classes are used instead of `os-wizard`.

- #### `data` [string|array|plain object]
    * Set data that is to be submitted with the post. This will be in addition to the form data that is serialized automatically. All form elements that have a name attribute are serialized, see `data()` function below.

- #### `backgroundColor` [string]
    * Set background color of the wizard. CSS Color properties are allowed. **Default** background color is set in css, and is white.

- #### `backgroundImage` [string]
    * Set an image path to be used as background of the wizard.
    
- #### `before` [function]
    * Define a function to call after the actual wizard is built. Function is only performed once and returns the original event with the `*Wizard` object assigned, ie: `before: function(event) { var wizardOptions = event.osWizard; }`.

- #### `always` [function]
    * Define a function to call no matter if the wizard was previously built or not. Function is called everytime the event is performed and returns the original event with the `*Wizard` object assigned, ie: `always: function(event) { var wizardOptions = event.osWizard; }`. This function is also re-called with every wizard screen that is loaded with the next and prev call, so it can be used to bind event handlers after load.
    
- #### `done` [function]
    * Define a function to call before the actual wizard is built. Function is only performed once and returns the original event with the `*Wizard` object assigned, ie: `before: function(event) { var wizardOptions = event.osWizard; }`.
    
- #### `next` [function]
    * Define a function to call when the next function `os.wizard.next()` is called. Function returns the original event with the `*Wizard` object assigned, ie: `next: function(event) { var wizardOptions = event.osWizard; }`.
    
- #### `prev` [function]
    * Define a function to call when the previous function `os.wizard.prev()` is called. Function returns the original event with the `*Wizard` object assigned, ie: `prev: function(event) { var wizardOptions = event.osWizard; }`.
    
- #### `complete` [function]
    * Define a function to call when all wizard steps are absorbed and the last `next` step is pushed. Function is only performed once and returns the original event with the `*Wizard` object assigned, ie: `complete: function(event) { var wizardOptions = event.osWizard; }`.
    
