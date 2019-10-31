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

function getScrollPositionByCSS1Support(isCSS1Compat)
{
    var xy = {};

    if (isCSS1Compat)
    {
        xy.x = document.documentElement.scrollLeft;
        xy.y = document.documentElement.scrollTop;
    } else {
        xy.x = document.body.scrollLeft;
        xy.y = document.body.scrollTop;
    }

    return xy;
}

function getScrollPosition()
{
    var xy = {};

    if (window.pageXOffset || false)
    {
        xy.x = window.pageXOffset;
        xy.y = window.pageYOffset;
    } else {
        xy = getScrollPositionByCSS1Support(document.compatMode === "CSS1Compat")
    }

    return xy;
}

function getScrollYPosition()
{
    return getScrollPosition().y;
}

function keepTrackOfTheScrollY(elem)
{
    var action = function()
    {
        elem.style.top = getScrollYPosition();
    }

    _addEventListener(window, 'scroll', action);
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
var Validator = (function()
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

        elem.className   = this.clsName;
        elem.id          = this.id;
        elem.style.top   = triggerRect.bottom + 2;
        elem.style.left  = triggerRect.left;
        elem.style.width = triggerRect.right - triggerRect.left;
        elem.innerHTML   = this.message;

        return elem;
    }

    Validator.prototype.remove = function()
    {
        if (this.dom)
        {
            this.dom.parentNode.removeChild(this.dom);

            delete this.dom;
        }
    }

    Validator.prototype.render = function(trigger)
    {
        var oldV = document.getElementById(this.id),
            rect = trigger.getBoundingClientRect(),
            dom  = this.generateElement(rect);

        if (oldV) oldV.parentNode.removeChild(oldV);
        document.body.appendChild(dom);

        this.dom = dom;
    }

    return Validator;
})();


var ElProperty = (function()
{
    function ElProperty(name, value)
    {
        this.name  = name;
        this.value = value || "";
    }

    return ElProperty;
})();


var ElListener = (function()
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
var BasicTextInput = (function()
{
    /**
     * BasicTextInput constructor
     * @constructor
     * @param {Validator} validator
     * @param {Array<ElProperty>} properties
     * @param {Array<ElListener>} listeners
     */
    function BasicTextInput(params)
    {
        this.properties = params.properties || [];
        this.listeners  = params.listeners  || [];
        this.validators = (params.validators) ? this.pushValidators(params.validators):null;
        this.tag        = "input";
        this.clsName    = "BasicTextInput";
        this.label      = params.label || null;

        if (params.label) this.render = this.generateLabel;
    }

    BasicTextInput.prototype.generateLabel = function()
    {
        var tb = document.createElement("div"),
            lb = document.createElement("span"),
            el = document.createElement("span");

        lb.className = this.clsName + "-Label";
        lb.innerHTML = this.label;

        el.appendChild(this.dom);
        tb.appendChild(lb);
        tb.appendChild(el);

        this.Engine.reDom(this, tb);
        this.master.appendChild(tb);
    }

    BasicTextInput.prototype.pushValidators = function(validators)
    {
        this.validators = this.validators || [];

        for (v=0; v < validators.length; v++)
        {
            this.pushValidator(validators[v]);
        }

        return this.validators;
    }

    BasicTextInput.prototype.generateValidate = function(validator)
    {
        return function()
        {
            var val = this.value.replace(validator.re, "");

            if (val !== "")
            {
                validator.remove();
                validator.render(this);
            } else {
                validator.remove();
            }
        }
    }

    BasicTextInput.prototype.pushValidator = function(validator)
    {
        var action    = this.generateValidate(validator),
            validator = new ElListener("keyup", action);

        this.validators.push(validator);
        this.listeners.push(validator);

        return validator;
    }

    return BasicTextInput;
})()


var BasicGreed = (function()
{
    function BasicGreed(params)
    {
        this.clsName = "BasicGreed";
        this.items   = params.items;
        this.tag     = "div";
        this.format  = params.format;
        this.rows    = [];
    }

    BasicGreed.prototype.getTdWidth = function(data)
    {
        if (!this.cellWidth)
        {
            var rect  = this.master.getBoundingClientRect(),
                width = rect.width;

            this.cellWidth = (width / this.format.length) + 'px';
        }

        return this.cellWidth;
    }

    BasicGreed.prototype.generateCell = function(data)
    {
        var td = document.createElement("div");

        td.className   = this.clsName + "-Cell";
        td.innerText   = data;
        td.style.width = this.cellWidth || this.getTdWidth();

        return td;
    }

    BasicGreed.prototype.generateRow= function(arr, clsName)
    {
        var row = document.createElement("div");
        row.className = clsName || this.clsName + "-Row";

        for (var n=0; n < arr.length; n++)
        {
            row.appendChild(this.generateCell(arr[n]));
        }

        return row;
    }

    BasicGreed.prototype.generateHeader = function()
    {
        var clsName = this.clsName + "-Row-Head",
            tHead   = this.generateRow(this.format, clsName);

        return tHead;
    }

    BasicGreed.prototype.render = function()
    {
        this.master.appendChild(this.dom);
        this.dom.insertBefore(this.generateHeader(), this.dom.firstChild);
    }

    return BasicGreed;
})()


var BasicPlate = (function()
{
    function BasicPlate(params)
    {
        this.clsName = "BasicPlate";
        this.items   = params.items;
        this.tag     = "div";
    }

    return BasicPlate;
})()


var BasicSearchForm = (function()
{
    function BasicSearchForm(params)
    {
        this.clsName    = "BasicSearchForm";
        this.tag        = "div";
        this.properties = params.properties || [];
        this.listeners  = params.listeners  || [];
        this.items      = params.items  || [];
        this.innerHTML  = params.label ? "<div class='BasicSearchFormLabel'>" + params.label + "<div>":null;
    }

    return BasicSearchForm;
})()


var BasicHeader = (function()
{
    function BasicHeader(params)
    {
        this.clsName    = "BasicHeader";
        this.tag        = "div";
        this.properties = params.properties || [];
        this.listeners  = params.listeners  || [];
        this.innerHTML  = params.innerHTML;
    }

    BasicHeader.prototype.render = function()
    {
        var self = this;

        this.master.appendChild(this.dom);
        keepTrackOfTheScrollY(this.dom);
    }

    return BasicHeader;
})()


var ElementCompiler = (function()
{
    function ComponentCompiler(master)
    {
        this.master = master;
    }

    ComponentCompiler.prototype.compileElement = function(element, master)
    {
        var htmlEl     = document.createElement(element.tag);
        element.master = master || document.body;

        this.merger(element, htmlEl);

        return element;
    }

    ComponentCompiler.prototype.renderElement = function(InnerEl)
    {
        InnerEl.master.appendChild(InnerEl.dom);
    }

    ComponentCompiler.prototype.removeElement = function(InnerEl)
    {
        var _engine = compiled.Engine;

        InnerEl.dom.parentNode.removeChild(InnerEl.dom);

        if (_engine)
        {
            _engine.elements = _engine.elements.filter(function(el)
            {
                return el !== InnerEl;
            })
        }
    }

    ComponentCompiler.prototype.mergeHTMLAndInnerAttrs = function(InnerEl, htmlEl)
    {
        var self = this;

        htmlEl.className   = InnerEl.clsName;
        htmlEl.innerHTML   = (InnerEl.innerHTML) || "";
        htmlEl.getEl       = function(){return InnerEl;};
        InnerEl.dom        = htmlEl;
        InnerEl.render     = InnerEl.render || function() {self.renderElement(InnerEl)};
        InnerEl.remove     = InnerEl.render || function() {self.removeElement(InnerEl)};
    }

    ComponentCompiler.prototype.merger = function(InnerEl, htmlEl)
    {
        this.mergeHTMLAndInnerAttrs(InnerEl, htmlEl);

        if (InnerEl.properties)
        {
            this.connectProperties(htmlEl, InnerEl.properties);
        }
        if (InnerEl.listeners)
        {
            this.connectListeners(htmlEl, InnerEl.listeners);
        }

        return InnerEl;
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


var Engine = (function()
{
    function Engine(page)
    {
        this.compiler = new ElementCompiler(this);
        this.elements = [];

        if (page.items)
        {
            this.createElements(page.items);
        }
    }

    Engine.prototype.createElement = function(declElement, master)
    {
        var master   = master || document.body,
            cls      = (typeof declElement.cls !== 'string') ? declElement.cls:window[declElement.cls];
            exemplar = new cls(),
            compiled = this.compiler.compileElement(exemplar, master);
        compiled.Engine = this;

        compiled.render();
        this.elements.push(compiled);

        if (compiled.items) this.createElements(compiled.items, compiled.dom);

        return compiled;
    }

    Engine.prototype.reDom = function(InnerEl, newDom)
    {
        newDom.render = InnerEl.dom.render;
        newDom.remove = InnerEl.dom.remove;
        newDom.getEl  = InnerEl.dom.getEl;
        InnerEl.dom   = newDom;
    }

    Engine.prototype.createElements = function(elements, master)
    {
        var master = master || document.body;
        elements   = elements.reverse();

        for (var el=0; el < elements.length; el++)
        {
            var elem = elements[el];

            this.createElement(elem, master);
        }
    }

    return Engine;
})();