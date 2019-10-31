/**
 * Light engine for test suit
 * @author - Trishkin Sergey
 * @module
 */


/**
 * MultiBrowser addEventListener
 * @interface
 * @param {HTMLElement} element - element where connect
 * @param {String} event - event for handle
 * @param {Function} action - function on handle
 *
 */
function _addEventListener(element, event, action)
{
	if ((typeof action) !== 'string')
	{
        if (element.addEventListener)
        {
            element.addEventListener(event, action);
        } else {
            element.attachEvent(event, action);
        }
	} else {
		element['on' + event] = function(){eval(action)};
	}
}


function generateFunctionWhatDeleteElementIfHimNotEventTarget(elem, elem2)
{
    return (function(ev)
    {
        var event  = ev || window.event,
            target = event.target || event.srcElement;

        if (target !== elem && target !== elem2)
        {
            this.parentNode.removeChild(elem);
        }
    })
}


/**
 * MultiBrowser String formating
 * @function
 * @param {String} str - string to format
 * @param {Array<String>} args - args to push on string
 * @returns {string}
 *
 */
function format(str, args)
{
    var toFormat   = ((typeof args) !== "string") ? args:[args],
        currentLine = str;

    for (var n in toFormat)
    {
        var key = "\\{" + n + "\\}";
        currentLine = currentLine.replace(new RegExp(key, 'g'), toFormat[n]);
    }

    return currentLine;
}


/**
 * Basic validator
 * @class
 */
Validator = (function()
{
    function Validator(re, message, messageType)
    {
        this.id      = "Validator-" + messageType;
        this.clsName = "Validator";
        this.message = message;
        this.re      = re;
    }

    Validator.prototype.generateElement = function(triggerRect)
    {
        var elem = document.createElement("div");

        elem.className  = this.clsName;
        elem.id         = this.id;
        elem.style.top  = triggerRect.bottom + 2;
        elem.style.left = triggerRect.bottom + 2;
        elem.innerHTML  = this.message;

        return elem;
    }

    Validator.prototype.connectLogicToElem = function(elem, trigger)
    {
        var action = generateFunctionWhatDeleteElementIfHimNotEventTarget(elem, trigger)

        _addEventListener(document.body, "mousemove", action);
    }

    Validator.prototype.render = function(trigger)
    {
        var rect = trigger.getBoundingClientRect(),
            dom  = this.generateElement(rect);

        //this.connectLogicToElem(dom, trigger);
        document.body.appendChild(dom);
    }

    return Validator;
})();


ElProperty = (function()
{
    function ElProperty(name, value)
    {
        this.name  = name;
        this.value = value || "";
    }

    return ElProperty;
})();


ElListener = (function()
{
    function ElListener(event, action)
    {
        this.event  = event;
        this.action = action;
    }

    return ElListener;
})();


/**
 * Basic input element
 * @class
 */
BasicTextInput = (function()
{
    /**
     * BasicTextInput constructor
     * @constructor
     * @param {Validator} validator
     * @param {Array<ElProperty>} properties
     * @param {Array<ElListener>} listeners
     */
    function BasicTextInput(properties, listeners, validators)
    {
        this.properties = properties || [];
        this.listeners  = listeners  || [];
        this.validators = (validators) ? this.pushValidators(validators):null;
        this.tag        = "input";
        this.clsName    = "BasicTextInput";
    }

    BasicTextInput.prototype.pushValidators = function(validators)
    {
        this.validators = this.validators || [];

        for (v=0; v < validators.length; v++)
        {
            var valid = this.pushValidator(validators[v]);
        }

        return this.validators;
    }

    BasicTextInput.prototype.generateValidate = function(validator)
    {
        return function()
        {
            var val = this.value;

            if (!val.match(validator.re))
            {
                validator.render(this);
            }
        }
    }

    BasicTextInput.prototype.pushValidator = function(validator)
    {
        var action    = this.generateValidate(validator),
            validator = new ElListener("keydown", action);

        this.validators.push(validator);
        this.listeners.push(validator);

        return validator;
    }

    return BasicTextInput;
})()


ElementCompiler = (function()
{
    function ComponentCompiler(master)
    {
        this.master = master;
    }

    ComponentCompiler.prototype.compileElement = function(element, master)
    {
        var htmlEl = document.createElement(element.tag);
        element.master = (master) ? master.get():document.body;

        this.merger(element, htmlEl);

        return element;
    }

    ComponentCompiler.prototype.renderElement = function(coreElement)
    {
        coreElement.master.appendChild(coreElement.dom);
    }

    ComponentCompiler.prototype.merger = function(coreElement, htmlEl)
    {
        var self = this;

        htmlEl.className   = coreElement.clsName
        coreElement.dom    = htmlEl;
        coreElement.render = function() {self.renderElement(coreElement)};

        if (coreElement.properties)
        {
            this.connectProperties(htmlEl, coreElement.properties);
        }
        if (coreElement.listeners)
        {
            this.connectListeners(htmlEl, coreElement.listeners);
        }

        return coreElement;
    }

    /**
     * Connect inner property on HTMLElement
     * @constructor
     * @param {HTMLElement} element - element where connect properties
     * @param {ElementsPropertiesList} properties
     */
    ComponentCompiler.prototype.connectProperties = function(htmlEl, properties)
    {
        for (var p=0; p < properties.length; p++)
        {
            var prop = properties[p];

            htmlEl[prop.name] = prop.value
        }
    }

    /**
     * Connect inner property on HTMLElement
     * @constructor
     * @param {HTMLElement} element - element where connect properties
     * @param {ElementsPropertiesList} properties
     * @param {listenersList} listeners
     */
    ComponentCompiler.prototype.connectListeners = function(htmlEl, listeners)
    {
        for (var l=0; l < listeners.length; l++)
        {
            var listener = listeners[l];

            _addEventListener(htmlEl, listener.event, listener.action)
        }
    }

    return ComponentCompiler;
})()


Engine = (function()
{
    function Engine(PageElements)
    {
        this.compiler = new ElementCompiler(this);
        this.elements = [];

        if (PageElements)
        {
            this.createElements(PageElements);
        }
    }

    Engine.prototype.createElement = function(element)
    {
        var compiled = this.compiler.compileElement(element);

        if (compiled.items) this.createElements(compiled.items);

        this.elements.push(compiled);

        return compiled;
    }

    Engine.prototype.createElements = function(elements)
    {
        for (var el=0; el < elements.length; el++)
        {
            var elem = this.createElement(elements[el]);
            console.log(elem)
            elem.render();
        }
    }

    return Engine;
})();


var SearchFieldProperties =
[
    new ElProperty("title", "Search User")
];

var SearchFieldListeners =
[
    new ElListener("click", function(){console.log("click...")})
];

var SearchFieldValidators =
[
    new Validator(/[^0-9\W]/gi, "Incorrect format, should use only word and space!", "Warring")
];

var pageElements =
[
    new BasicTextInput(SearchFieldProperties, SearchFieldListeners, SearchFieldValidators)
];

window.onload = function()
{
    window["App"] = new Engine(pageElements)
}