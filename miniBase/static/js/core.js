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
    function Validator(re, message, $type)
    {
        this.className = validatorClassName || "BasicValidator";
        this.className = $type;
        this.message   = message;
        this.re        = re;
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
BasicInput = (function()
{
    /**
     * BasicInput constructor
     * @constructor
     * @param {Validator} validator
     * @param {Array<ElProperty>} properties
     * @param {Array<ElListener>} listeners
     */
    function BasicInput(properties, listeners, validator)
    {
        this.validator  = validator;
        this.properties = properties || [];
        this.listeners  = listeners  || [];
        this.tag        = "input";
        this.className  = "BasicInput";
    }

    BasicInput

    return BasicInput;
})()


ElementCompiler = (function()
{
    function ComponentCompiler(debug)
    {
        this.debug = debug || false;
    }

    ComponentCompiler.prototype.compileElement = function(element, master)
    {
        var master = (master) ? master:document.body,
            htmlEl = document.createElement(element.tag);

        this.merger(htmlEl, element)
    }

    ComponentCompiler.prototype.merger = function(coreElement, htmlEl)
    {
        htmlEl.className = coreElement.className

        this.connectProperties(htmlEl, coreElement.properties);
        this.connectListeners(htmlEl, coreElement.listeners);
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