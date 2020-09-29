###*
 * ***.wizard.js
 * by Christian Fillies
 * Modified: 9/29/2020
###


###* Globalized Functions and Prefixes *###
classPrefix = if window._global and _global.css then _global.css else if window.classPrefix then window.classPrefix else 'os'
functionPrefix = if window._global and _global.env then _global.env else if window.functionPrefix then window.functionPrefix else 'os'
attrPrefix = if window._global and _global.attr then _global.attr else if window.attrPrefix then window.attrPrefix else 'os'
if !window[functionPrefix]
  window[functionPrefix] = {}
wizardEnv = window[functionPrefix]


## os.wizard()
window[functionPrefix].wizard = (args...) ->

  call = @wizard
  if call
    call.defaults =
      debug: false or if window._global then window._global.debug else false or wizardEnv.debugConsole and wizardEnv.debugConsole()
      event: window.event,
      containerId: 'modalContents'
      modalClasses: false
      closeButton: => "<a href='javascript:void(0)' class='#{call.current.classes.close}' onclick='#{functionPrefix}.wizard.close(event)'><i class='ri ri-close os-unit icon glyphicon glyphicon-remove h3'></i></a>"
      innerHtml: =>
        classes =
          backdrop: call.current.classes.backdrop
          dialog: call.current.classes.dialog
          content: call.current.classes.content
        closeButton = ''
        backgroundImage = ''
        if typeof call.current.closeButton is 'function'
          closeButton = call.current.closeButton()
        if call.current.modalClasses
          classes.backdrop = call.current.classes.modal.backdrop
          classes.dialog = call.current.classes.modal.dialog
          classes.content += ' ' + call.current.classes.modal.content
        if call.current.backgroundColor or call.current.backgroundImage
          style = "style='"
          if call.current.backgroundColor
            style += "background-color:#{call.current.backgroundColor};"
          if call.current.backgroundImage
            style += "background-image:url(#{call.current.backgroundImage})"
          style += "'"
        "<div class='#{classes.backdrop}'><div class='#{classes.dialog}'><div class='#{classes.content}' #{style}></div>#{closeButton}</div></div>"
      breakpoints:
        xs: 375
        sm: 576
        md: 768
        lg: 992
        xl: 1200
      classes:
        selector: classPrefix + '-wizard'
        backdrop: classPrefix + '-wizard-backdrop'
        dialog: classPrefix + '-wizard-dialog'
        content: classPrefix + '-wizard-content'
        close: classPrefix + '-wizard-close'
        hidden: 'hidden'
        animation: 'fadeIn'
        body: classPrefix + '-wizard-no-scroll'
        modal:
          selector: classPrefix + '-modal'
          backdrop: classPrefix + '-modal-backdrop'
          dialog: classPrefix + '-modal-dialog'
          content: classPrefix + '-modal-content'
        width:
          xs: classPrefix + '-wizard-xs'
          sm: classPrefix + '-wizard-sm'
          md: classPrefix + '-wizard-md'
          lg: classPrefix + '-wizard-lg'
          xl: classPrefix + '-wizard-xl'
    defaults = call.defaults

    call.fn =
      id: (length) ->
        Length = length or 24
        id = ''
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        i = 0
        while i < Length
          id += charSet.charAt(Math.floor(Math.random() * charSet.length))
          i++
        id
      classSelectors: (x) ->
        classes = x.split(' ')
        defined = =>
          for sel in classes
            '.' + sel
        defined().join('')
      valueConversion: (v, removeProperty) ->
        rv = v
        if v
          v = v.trim()
        if v
          lowerCaseV = v.toLowerCase()
          if lowerCaseV is 'true'
            rv = true
          if lowerCaseV is 'false'
            rv = false
          if lowerCaseV is '_null'
            rv = null
          if /^\d*$/.test(v)
            rv = parseInt(v)
        else if v is null
          rv = null
        else
          if removeProperty
            rv = 'removeThisProperty'
          else
            rv = ''
        rv
      removeProperty: (obj) ->
        for prop of obj
          if obj[prop] is 'removeThisProperty'
            delete obj[prop]
        obj
      normalizeData: (data) ->
        dataObj = {}
        if typeof data is 'object' and !Array.isArray data
          dataObj = Object.assign dataObj, data
        if Array.isArray data
          data = data.join '&'
        if typeof data is 'string'
          data = data.replace /^\?/, ''
          data = data.split '&'
          for prop in data
            k = prop.split('=')[0]
            v = prop.split('=')[1]
            if v isnt undefined
              dataObj[k] = call.fn.valueConversion(v)
        dataObj
      overrides: (args) ->
        obj = new Object()
        obj.data = {}
        for arg in args
          if arg instanceof Event
            obj.event = arg
          else if typeof arg is 'object'
            if Array.isArray(arg)
              obj.concatUrls = arg
            else
              obj.data = Object.assign obj.data, arg
          else if typeof arg is 'function'
            obj.callback = arg
        obj
      assign: (args) ->
        obj = Object.assign {}, call.defaults
        for arg in args
          if arg instanceof Event
            obj.event = arg
          else if typeof arg is 'object'
            if Array.isArray(arg)
              if obj.url and Array.isArray(obj.url)
                obj.url = obj.url.concat arg
              else
                obj.url = arg
            else if arg instanceof HTMLElement
              obj.srcElement = arg
            else if arg instanceof jQuery
              obj.srcElement = arg[0]
            else if arg instanceof Event
              obj.event = arg
            else
              for entry of arg
                if obj[entry] and typeof arg[entry] is 'object'
                  if Array.isArray(arg[entry])
                    arg = obj[entry].concat(arg[entry])
                  else if arg[entry] instanceof HTMLElement
                    obj.srcElement = arg[entry]
                  else if arg[entry] instanceof jQuery
                    obj.srcElement = arg[entry][0]
                  else if arg[entry] instanceof Event
                    obj.event = arg[entry]
                  else
                    arg[entry] = Object.assign(obj[entry], arg[entry])
              obj = Object.assign(obj, arg)
          if typeof arg is 'string'
            if arg.startsWith('.') or (arg.startsWith('[') and arg.endsWith(']'))
              obj.srcElement = doc.querySelector arg
            else if arg.startsWith('#')
              obj.srcElement = doc.getElementById arg.replace '#', ''
            else
              obj.name = arg
          if typeof arg is 'function'
            obj.complete = arg
          if typeof obj.url is 'string'
            if typeof obj.url is 'string'
              obj.url = [obj.url]
          if obj.data
            obj.data = call.fn.normalizeData obj.data
        Object.keys(obj).map (key) ->
          if obj[key] is undefined
            delete obj[key]
        obj.arguments = args
        obj

    doc = document
    call.observeWidth = (ele) ->
      ele.addEventListener 'resize', () ->
        for k, i in Object.keys(defaults.breakpoints)
          ele.classList.remove defaults.classes.width[k]
        for k, i in Object.keys(defaults.breakpoints)
          nextKey = Object.keys(defaults.breakpoints)[i + 1]
          if ele.offsetWidth <= defaults.breakpoints[k]
            ele.classList.add defaults.classes.width[k]
            if nextKey
              return
      ele.hasWidhObserver = true

    call.fetch = (urlIndex) => new Promise (resolve, reject) ->
      fetchUrl = call.current.url[urlIndex]
      fetchData = {}
      if fetchUrl.includes '?'
        fetchDataArray = fetchUrl.split('?')[1].split('&')
        for prop in fetchDataArray
          fetchData[prop.split('=')[0]] = call.fn.valueConversion(prop.split('=')[1])
        fetchUrl = fetchUrl.split('?')[0]
      if call.current.data and Object.keys(call.current.data).length
        Object.keys(call.current.data).map (k) =>
          fetchData[k] = call.current.data[k]
      if Object.keys(fetchData).length
        fetchData = call.fn.removeProperty fetchData
        fetchUrl += '?'
        Object.keys(fetchData).map (k, i) =>
          ampersand = if i > 0 then '&' else ''
          fetchUrl += ampersand + k + '=' + fetchData[k]
      call.current.url[urlIndex] = fetchUrl
      res = {}
      fetch(fetchUrl, { mode: 'no-cors' })
        .then (x) =>
          res = x
          if call.current.debug
            console.groupCollapsed '%c'+functionPrefix+'.wizard.fetch(urlIndex)', 'font-size:1.2em; margin: .6em 0 0; display: block'
            console.log 'urlIndex', urlIndex
            console.log 'fetchUrl', fetchUrl
            console.log 'fetch', fetch
            console.log 'res', res
            console.log 'current', call.current
            console.groupEnd()
          if x.ok
            res = x.text()
          else
            notFound = new Error res.statusText, res
            reject notFound
          res
        .then (res) =>
          html = res
          if call.current.containerId
            if call.current.containerId.startsWith('#')
              call.current.containerId = call.current.containerId.replace '#', ''
            if res.includes('id="'+call.current.containerId+'"')
              container = doc.createElement 'div'
              container.innerHTML = res
              inner = container.querySelector '#' + call.current.containerId
              html = inner.innerHTML
          call.wizard.setAttribute 'src', fetchUrl
          resolve(html)
        .catch (x) =>
          reject x
      res

    #### TRIGGERS
    call.close = (e) ->
      destroy = false
      if e is 'destroy'
        destroy = true
      if !call.wizard
        event = e or window.event
        closestWizard = event.target.closest call.fn.classSelectors call.defaults.classes.selector
      else
        closestWizard = call.wizard
      if closestWizard and closestWizard.wizard
        call.current = closestWizard.wizard
        call.wizard = closestWizard
      if event
        call.current.event = event
      call.wizard.classList.remove call.defaults.classes.animation
      if call.current.name
        closestWizard.classList.add call.current.classes.hidden
      else
        destroy = true

      ## correct event
      event = event or call.current.event or window.event

      if call.current.debug
        console.groupCollapsed '%c'+functionPrefix+'.wizard.close(event)', 'font-size:1.2em; margin: .6em 0 0; display: block'
        console.log 'event', event
        console.log 'current', call.current
        console.log 'closestWizard', closestWizard
        console.log 'destroy', destroy
        console.groupEnd()

      ## reset the body
      doc.body.classList.remove call.current.classes.body

      if destroy
        closestWizard.remove()
      call.noTrace()


    call.next = (overrides...) ->
      ## overrides, only data and event is overridable
      overrideObj = call.fn.overrides overrides
      if Object.keys(overrideObj).length

        ## concat additional urls
        if call.current.url.length and overrideObj.concatUrls
          overrideObj.concatUrls.map (url) ->
            if call.current.url.indexOf(url) is -1
              call.current.url.push url
          delete overrideObj.concatUrls

        ## merge data
        if call.current.data and Object.keys(call.current.data).length
          overrideObj.data = Object.assign call.current.data, overrideObj.data
          overrideObj.data = call.fn.removeProperty overrideObj.data

        ## the callback function is the custom next function instead
        if typeof overrideObj.callback is 'function'
          overrideObj.next = overrideObj.callback
          delete overrideObj.callback

        call.current = Object.assign call.current, overrideObj
      call.wizard.wizard = call.current

      ## correct event
      event = overrideObj.event or call.current.event or window.event

      ## custom next function
      if typeof call.current.next is 'function'
        nextEvent = event
        nextEvent[attrPrefix+'Wizard'] = call.current
        nextReturn = call.current.next nextEvent
        if nextReturn is false
          return false

      ## get the next url
      currentUrl = call.wizard.getAttribute 'src'
      nextUrlIndex = call.current.url.indexOf(currentUrl) + 1
      nextUrl = call.current.url[nextUrlIndex]
      call.current.src = nextUrl
      call.current.urlIndex = nextUrlIndex

      if call.current.debug
        console.groupCollapsed '%c'+functionPrefix+'.wizard.next(event)', 'font-size:1.2em; margin: .6em 0 0; display: block'
        console.log 'event', event
        console.log 'current', call.current
        console.log 'currentUrl', currentUrl
        console.log 'nextUrl', nextUrl
        console.groupEnd()

      if nextUrl
        call.fetch(nextUrlIndex)
          .then (res) =>
            call.current.fetchTarget = call.wizard.querySelector(call.fn.classSelectors(call.defaults.classes.content))
            call.current.fetchTarget.innerHTML = res
      else
        call.complete()

      ## prevent additional clicks
      if event.target and event.target.getAttribute('onclick').includes(functionPrefix+'.wizard.next')
        event.target.onclick = event.preventDefault()



    call.prev = (overrides...) ->
      ## overrides, only data and event is overridable
      overrideObj = call.fn.overrides overrides
      if Object.keys(overrideObj).length

        ## concat additional urls
        if call.current.url.length and overrideObj.concatUrls
          overrideObj.concatUrls.map (url) ->
            if call.current.url.indexOf(url) is -1
              call.current.url.push url
          delete overrideObj.concatUrls

        ## merge data
        if call.current.data and Object.keys(call.current.data).length
          overrideObj.data = Object.assign call.current.data, overrideObj.data
          overrideObj.data = call.fn.removeProperty overrideObj.data

        ## the callback function is the custom prev function instead
        if typeof overrideObj.callback is 'function'
          call.current.prev = overrideObj.callback
          delete overrideObj.callback

        call.current = Object.assign call.current, overrideObj

      call.wizard.wizard = call.current

      ## correct event
      event = overrideObj.event or call.current.event or window.event

      ## custom prev function
      if typeof call.current.prev is 'function'
        prevEvent = event
        prevEvent[attrPrefix+'Wizard'] = call.current
        prevReturn = call.current.prev prevEvent
        if prevReturn is false
          return false

      ## get the next url
      currentUrl = call.wizard.getAttribute 'src'
      prevUrlIndex = call.current.url.indexOf(currentUrl) - 1

      if prevUrlIndex is -1
        prevUrlIndex = 0
      prevUrl = call.current.url[prevUrlIndex]
      call.current.src = prevUrl
      call.current.urlIndex = prevUrlIndex

      if call.current.debug
        console.groupCollapsed '%c'+functionPrefix+'.wizard.prev(arguments)', 'font-size:1.2em; margin: .6em 0 0; display: block'
        console.log 'arguments', overrides
        console.log 'event', event
        console.log 'current', call.current
        console.log 'currentUrl', currentUrl
        console.log 'prevUrl', prevUrl
        console.groupEnd()

      if prevUrl
        call.fetch(prevUrlIndex)
          .then (res) =>
            call.current.fetchTarget = call.wizard.querySelector(call.fn.classSelectors(call.defaults.classes.content))
            call.current.fetchTarget.innerHTML = res
            call.always call.wizard

      ## prevent additional clicks
      if event.target and event.target.getAttribute('onclick').includes(functionPrefix+'.wizard.prev')
        event.target.onclick = event.preventDefault()

    call.complete = (event) ->
      if typeof call.current.complete is 'function'
        completeEvent = event or call.current.event or window.event
        completeEvent[attrPrefix+'Wizard'] = call.current
        call.current.complete completeEvent
      call.close 'destroy'

    call.always = (element) ->
      call.current = element.wizard
      call.current.targetElement = element
      if call.current
        if typeof call.current.always is 'function'
          callbackEvent = call.current.event or window.event
          callbackEvent[attrPrefix+'Wizard'] = call.current
          call.current.always callbackEvent

    call.noTrace = ->
      delete call.current
      delete call.wizard

    call.build = (args) ->
      call.current = {}
      call.current = call.fn.assign args

      ## wizard already exists
      if call.current.name
        call.wizard = doc.querySelector("[name='#{call.current.name}']")

      if call.wizard
        call.current = call.wizard.wizard
        call.current.reopenCount++
        call.wizard.wizard = call.current
        if call.wizard.classList.contains call.current.classes.hidden
          call.wizard.classList.remove call.current.classes.hidden
        call.wizard.classList.add call.defaults.classes.animation
        call.always call.wizard

      else

        if typeof call.current.before is 'function'
          beforeEvent = call.current.event or window.event
          beforeEvent[attrPrefix+'Wizard'] = call.current
          call.current.before beforeEvent

        call.wizard = doc.createElement 'div'
        if call.current.name
          call.wizard.setAttribute 'name', call.current.name
        call.wizard.id = attrPrefix+'Wizard-'+call.fn.id()
        call.wizard.classList.add call.defaults.classes.selector
        call.wizard.classList.add 'animated'
        call.wizard.classList.add call.defaults.classes.animation
        if call.defaults.modalClasses
          call.wizard.classList.add call.defaults.classes.modal.selector
        call.wizard.innerHTML = call.defaults.innerHtml()
        doc.body.appendChild call.wizard

        call.current.reopenCount = 0

        if call.current.debug
          console.groupCollapsed '%c'+functionPrefix+'.wizard(arguments)', 'font-size:1.2em; margin: .6em 0 0; display: block'
          console.log 'arguments', args
          console.log 'current', call.current
          console.groupEnd()


        ## call the first url in the array
        call.fetch(0)

          .then (res) ->

            call.wizard = doc.getElementById call.wizard.id
            call.current.res = res
            call.current.fetchTarget = call.wizard.querySelector(call.fn.classSelectors(call.defaults.classes.content))
            call.current.fetchTarget.innerHTML = res
            call.wizard.wizard = call.current

            if typeof call.current.done is 'function'
              doneEvent = call.current.event or window.event
              doneEvent[attrPrefix+'Wizard'] = call.current
              call.current.done doneEvent

            call.always call.wizard

          .catch (x) ->
            if call.current.debug
              console.error x, call.current
            call.close()


        if !call.wizard.hasWidhObserver
          call.observeWidth call.wizard

      ## prevent body scroll
      doc.body.classList.add call.current.classes.body


    ## default inits
    call.build(args)


## init when page has finished loading
if document.readyState and (document.readyState is "complete" or (document.readyState isnt "loading" and !document.documentElement.doScroll))
  window[functionPrefix].wizard()
else
  document.addEventListener 'DOMContentLoaded', window[functionPrefix].wizard
