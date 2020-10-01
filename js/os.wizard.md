# *.wizard.js

Script to activate and build modal type wizards.

## Functions
General wizard script is bound under the environment, ie `rocket` or `os`. So the following functions are dot-chained, ie `os.wizard`.


### INITIAL Call (Build)
``` html
<!-- default object based argument -->
<button
    onclick="os.wizard({
        url: ['/my/first/url', '/my/second/url'],
        name: 'My Wizard Name',
        data: { passAlongData: 1 },
        before: function(event) { console.warn('beforeEvent', event) },
        done: function(event) { console.warn('builtEvent', event) },
        complete: function(event) { console.warn('completeEvent', event) },
        debug: true
    })">Wizard</button>

<!-- shorthands (combineable with object based argument) -->
<button
    onclick="os.wizard(['/my/first/url', '/my/second/url'], 'My Wizard Name', function(event) { console.warn('completeEvent', event) })">Wizard</button>
```
    
#### Properties and Arguments
    
- #### `srcElement` [HTMLElement Selector|jQuery Selector|querySelector|ElementById]
    * Define the HTMLElement that the `wizard` is called from, in the case the function is called from an object event. **Shorthand** for this property is a simple HTMLElement, this or Selector argument, eg: `*.wizard(document.querySelector('.myElement'))` or `*.wizard(this)` or `*.wizard($('.jQueryElement'))`.
    
- #### `event` [Event]
    - Original event that fired for the wizard built. May also be set **Shorthand** property using the direct event, eg: `*.wizard(event)`. **Default** is `undefined` which returns the current `window.event`.
    
- #### `arguments` [array] (readonly)
    - returns the original arguments that were used to build the widget.
    
- #### `name` [string]
    * When a name property is defined, the wizard becomes 're-usable', as the dom is only built once and referred to from then on. **default** is `undefined`, which will build wizards with each event. **Shorthand** for this property is a simple string in the argument, eg: `*.wizard('My great Wizard')`.
    
- #### `id` [string] (readonly)
    * The ID of the current wizard.
    
- #### `url` [string|array]
    * Define the urls that are fetched inside the wizard. The first url is the initial wizard page. The following are fetched when navigating thru the wizard steps using the `NEXT` and `PREV` commands. **Shorthand** for this property is passing in an array as direct argument, eg `*.wizard(['/my/url/', '/another/url'])`. Data that is specified in each url as url params are only used for the fetch of these pages, and are merged with the data specified under the `data` property, eg: `['/my/url/?first=data', '/another/url?second=data']`.

- #### `data` [string|plain object]
    * Set data that is to be submitted with each fetch. These are in addition to the data that is individually defined per each `url`. 
        * **Join** example from above `['/my/url/?first=data', '/another/url?second=data']`, setting this property to `data: { mix: 1 }` would fetch each url with data from this property, eg: `'/my/url/?first=data&mix=1', '/another/url?second=data&mix=1'`. 
        * **Removing** a property can also be achieved when setting the property value to the string of `'removeThisProperty'`. So setting `data: { first: 'removeThisProperty' }` would result in `'/my/url/', '/another/url?second=data'`. **NOTE** this makes only sense for data that is defined using the `data` property, as url-param defined properties are only used one time anyways.
        
- #### `src` [string] (readonly)
    * Returns the currently loaded wizard fetch url including all of the used params. This is also available as an attribute on the wizard element itself, eg: `WizardElement.getAttribute('src')`. Refer to `targetElement` to retrieve the WizardElement.
        
- #### `urlIndex` [number] (readonly)
    * Returns the current index of the `src` in the `url` array.
        
- #### `targetElement` [HTMLElement] (readonly)
    * Returns the HTMLElement in the DOM tree, the current wizard is bound to.
        
- #### `fetchTarget` [HTMLElement] (readonly)
    * Returns the HTMLElement that the fetch data is placed into.
        
- #### `containerId` [string]
    * The HTML that is returned is scanned for a dom element with the ID specified here. The innerHTML of that element is extracted and all around is ignored. The **default** `containerId` is set to `'modalContainer'`.
    
- #### `modalClasses` [boolean]
    * Use os modal classes instead. **default** is `false`. If set to `true`, the `os-modal` classes are used instead of `os-wizard`.

- #### `backgroundColor` [string]
    * Set background color of the wizard. CSS Color properties are allowed. **Default** background color is set in css, and is white.

- #### `backgroundImage` [string]
    * Set an image path to be used as background of the wizard.
    
- #### `before` [function]
    * Define a function to call after the actual wizard is built. Function is only performed once and returns the original event with the `*Wizard` object assigned, ie: `before: function(event) { var wizardOptions = event.osWizard; }`.

- #### `always` [function]
    * Define a function to call no matter if the wizard was previously built or not. Function is called everytime the event is performed and returns the original event with the `*Wizard` object assigned, ie: `always: function(event) { var wizardOptions = event.osWizard; }`. This function is also re-called with every wizard screen that is loaded with the next and prev call, so it can be used to bind event handlers after load or re-initialize scripts on the newly added html.
    
- #### `done` [function]
    * Define a function to call after the actual wizard is built. Function is only performed one time after the initial build of the wizard and returns the original event with the `*Wizard` object assigned, ie: `done: function(event) { var wizardOptions = event.osWizard; }`.
    
- #### `next` [function]
    * Define a function to call when the next function `os.wizard.next()` is called. Function returns the original event with the `*Wizard` object assigned, ie: `next: function(event) { var wizardOptions = event.osWizard; }`.
    
- #### `prev` [function]
    * Define a function to call when the previous function `os.wizard.prev()` is called. Function returns the original event with the `*Wizard` object assigned, ie: `prev: function(event) { var wizardOptions = event.osWizard; }`.
    
- #### `complete` [function]
    * Define a function to call when all wizard steps are absorbed and the last `next` step is executed. Function will only be performed ones and returns the original event with the `*Wizard` object assigned, ie: `complete: function(event) { var wizardOptions = event.osWizard; }`. **Shorthand** for this property is a simple function in the argument, eg: `*.wizard(function(event) { console.warn('completeEvent', event)})`.
    
- #### `closeButton` [function|boolean]
    * Function returns the html for the closeButton. **Default** is `closeButton: function() { return "<a href='javascript:void(0)' class='#{call.current.classes.close}' onclick='os.wizard.close(event)'><i class='ri ri-close os-unit os-text-l icon glyphicon glyphicon-remove h3'></i></a>" }`. To remove the close button, simply set to `false`.
    
- #### `debug` [boolean]
    * Default is `false`. When `true`, enables console log reporting. Debug can also be enabled using the url param `_console=true`.


### NEXT and PREV
Load the next or previous widget screen within an existing screen. Based on the url array that is defined in the initial function call. Both functions allow the same arguments as documented below.
```javascript
os.wizard.next(['/additional/url'], { data: 'removeThisProperty'}, function(event) { console.warn('custom next callback', event) });
os.wizard.prev(event, function(event) { console.warn('custom previous callback', event) });
```
    
#### Properties and Arguments

- #### `event` [event]
    * Override the current event handler.

- #### `data` [plain object]
    * Override or append additional data for the next or previous url. In the same method that the main `data` property allows to remove properties, you may use the `'removeThisProperty'` value (See above).

- #### `url` [array]
    * Function allows appending URLs to the exiting `url` array from above. The script checks if an url already is in the array, and pushes it. A URL is unique when even a param is slightly different, eg: `'my/url?data=1'` is not `'my/url?data=2'`, therefore both urls can co-exist in the array. As example with the url example from above, setting the object to `*.wizard.next(['/additional/url'])` will result in a new url array of `['/my/url/', '/another/url', '/additional/url']`, therefore updating the length of wizard screens, and changing the 'next' behavior automatically.

- #### `callback` [function]
    * Function to call just before the native next or previous functions are executed. This allows to modify any property of the main arguments. In example, as the `url` property is a true array, you may use any array method to modify the entries, eg: `function(event) { console.error('callback', x.osWizard.url.push('/yet/another/url')); }`. For the purpose of modifying the url array using current index and url, refer to the readonly arguments of `urlIndex` and `src`.
    If the function returns `false`, the native next or previous function is escaped and no screen is loaded. This allows manually to halt the call, eg: `function() { return false; }`. 


### CLOSE
Close the wizard. Function can only be called while a wizard is active.
```javascript
os.wizard.close();
// or
os.wizard.close(event);
// or
os.wizard.close('destroy');
```

#### Properties and Arguments

- #### `event` [event]
    * Pass in the current event handler. The `event.target` HTMLElement is used to find the closest open widget.
    
- #### `'destroy'` [string]
    * the argument `'destroy'` will remove the wizard HTMLElement from the dom tree.



