/**
 * Light engine
 * @author - Trishkin Sergey
 * @module
 */


var ElementCompiler = (function()
{
    function ComponentCompiler(master)
    {
        this.master = master;
    }

    ComponentCompiler.prototype.compileElement = async function(element, master)
    {
        var htmlEl     = await document.createElement(element.tag);
        element.master = master || document.body;

        this.merger(element, htmlEl);

        return new Promise(function(resolve) { resolve(element) });
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

    ComponentCompiler.prototype.clearElementClone = function(elem)
    {
        if (elem.clone) 
        {
            elem.clone.parentNode.removeChild(elem.clone);
        }

        elem.clone = undefined;
    }

    ComponentCompiler.prototype.setElementClone = function(elem)
    {
        this.clearElementClone(elem);
        
        elem.clone           = elem.dom.cloneNode();
        elem.clone.innerHTML = elem.dom.innerHTML;
        elem.clone.id        = (elem.dom.id || elem.clsName) + "-Clone";

        elem.dom.parentNode.appendChild(elem.clone);
        
        return elem.clone;
    }

    ComponentCompiler.prototype.setElsDefFunctions = function(InnerEl)
    {
        var self = this;
        
        InnerEl.rmClone  = InnerEl.rmClone  || function() { return self.clearElementClone.apply(self, [InnerEl]) };
        InnerEl.setClone = InnerEl.setClone || function() { return self.setElementClone.apply(self, [InnerEl]) };
        InnerEl.render   = InnerEl.render   || function() { self.renderElement(InnerEl)  };
        InnerEl.remove   = InnerEl.render   || function() { self.removeElement(InnerEl)  };
    }

    ComponentCompiler.prototype.mergeHTMLAndInnerAttrs = function(InnerEl, htmlEl)
    {
        htmlEl.className   = InnerEl.clsName;
        htmlEl.innerHTML   = (InnerEl.innerHTML) || "";
        htmlEl.getEl       = function(){return InnerEl;};
        InnerEl.dom        = htmlEl;

        this.setElsDefFunctions(InnerEl);
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


var HTMLGataway = (function()
{
    function HTMLGataway(master)
    {
        this.master = master;
    }

    HTMLGataway.prototype.connectScript = function(path, _type, master)
    {
        var el     = document.createElement('script'),
            master = master || document.head;

        el.src  = path;
        el.type = _type || "text/javascript";

        master.appendChild(el);

        return el;
    }
    
    HTMLGataway.prototype.connectTitle = function(text)
    {
        var elem = document.createElement('title');
        elem.innerText = text;

        document.head.appendChild(elem);

        return elem;
    }

    HTMLGataway.prototype.connectStyle = function(path)
    {
        var elem = document.createElement('link');
       
        elem.href = path;
        elem.type = "text/css";
        elem.rel  = "stylesheet";

        document.head.appendChild(elem);

        return elem;
    }

    HTMLGataway.prototype.connectFavicon = function(path)
    {
        var elem = document.createElement('link');

        elem.rel  = "icon";
        elem.href = path;
        elem.type = "image/x-icon";

        document.head.appendChild(elem);

        return elem;
    }

    return HTMLGataway;
})();


var Engine = (function()
{
    function Engine(app)
    {
        this.htmlGataway = new HTMLGataway(this);
        this.config      = app;
        this.myDir       = this.getEnginePath();
        this.utillsPath  = this.myDir + "/utilities/basic_utilities.js";
        this.compiler    = new ElementCompiler(this);

       this.onStart()
    }

    Engine.prototype.getEnginePath = function()
    {
        var scripts = document.getElementsByTagName('script');

        for (var n=0; n < scripts.length; n++)
        {
            var spath = scripts[n].src.split('?')[0];

            if (spath.match(/core\.js/gi)) return spath.replace(/\/core\.js$/, "");
        }

        throw new Error("Core file renamed...");
    }

    Engine.prototype.onStart = function()
    {
        this.setBaseUttils();
        this.setBaseElements();
        this.setAppIco();
        this.setStyle();
        this.setTitle();
        this.setPages();
        this.run();
    }
    
    Engine.prototype.setStyle = function()
    {
        var path = this.myDir + "/styles/" + (this.config.style || "default") + ".css";

        this.htmlGataway.connectStyle(path);
    }

    Engine.prototype.run = function()
    {
        var self = this;

        window.onload = function()
        {
            var page = window[(self.config.index || self.config.pages[0])];

            self.initPage(page);
        }
        
    }

    Engine.prototype.setPages = function()
    {
        for (var n=0; n < this.config.pages.length; n++)
        {
            var page = this.config.pages[n],
                path = this.getPath("pages/" + page + ".js"),
                elem = this.htmlGataway.connectScript(path);
            
            elem.id = "Page-" + page;
        }
    }

    Engine.prototype.setTitle = function()
    {
        this.htmlGataway.connectTitle(this.config.name  || "Test-Page miniBase");
    }

    Engine.prototype.setAppIco = function()
    {
        if (this.config.ico)
        {
            var path = this.getPath(this.config.ico);
            
            this.htmlGataway.connectFavicon(path);
        }
    }

    Engine.prototype.getPath = function(path)
    {
        return this.myDir.replace(/[^/]+$/g, "") + path.replace(/\.\//g, "");
    }

    Engine.prototype.setBaseElements = function()
    {
        var elements = this.config.elements || MINIBASE_ALL_ELEMENTS;

        for (var n=0; n < elements.length; n++)
        {
            var path = this.myDir + "/elements/" + elements[n] + ".js",
                elem = this.htmlGataway.connectScript(path);
            
            elem.id = "Element-" + elements[n];
        }
    }

    Engine.prototype.setBaseUttils = function()
    {
        this.htmlGataway.connectScript(this.utillsPath);
    }

    Engine.prototype.destroyPage = function(page)
    {
        if (this.page && this.page.destroy) 
        {
            new BasicDestroyEffects(this.page.destroy, after);
        } else { 
            document.body.innerHTML = ""; 
        }
    }

    Engine.prototype.initPage = async function(page)
    {
        this.elements     = [];
        this.afterRender  = [];
        this.page         = page;
        this.page.reverse = (this.page.reverse !== undefined) ? this.page.reverse:false;

        await this.createElements(page.items || []);
        this._afterRender();
    }

    Engine.prototype.replacePage = function(page)
    {
        this.destroyPage();   
        this.initPage(page); 
    }
    
    Engine.prototype._afterRender = async function()
    {
        for (var n=0; n < this.afterRender.length; n++)
        {
            var schedule = this.afterRender[n];
            await schedule();
        }
    }

    Engine.prototype.createExemplar = function(cls, declElement)
    {
        var exemplar = new cls(declElement);

        exemplar.properties = declElement.properties || [];
        exemplar.listeners  = declElement.listeners  || [];
        exemplar.Engine     = this;

        return exemplar;
    }

    Engine.prototype.createElement = async function(declElement, master)
    {
        var master   = master || document.body,
            cls      = (typeof declElement.cls !== 'string') ? declElement.cls:window[declElement.cls];
            exemplar = this.createExemplar(cls, declElement),
            compiled = await this.compiler.compileElement(exemplar, master);

        compiled.render();
        this.elements.push(compiled);

        if (compiled.items) 
        {
            await this.createElements(compiled.items, compiled.dom);
        }

        return new Promise(function(resolve) { resolve(compiled) });
    }

    Engine.prototype.reDom = function(InnerEl, newDom)
    {
        newDom.render = InnerEl.dom.render;
        newDom.remove = InnerEl.dom.remove;
        newDom.getEl  = InnerEl.dom.getEl;
        InnerEl.dom   = newDom;
    }

    Engine.prototype.createElements = async function(elements, master)
    {
        var master = master || document.body;
        
        if (this.page.reverse) elements.reverse();

        for (var el=0; el < elements.length; el++)
        {
            var elem = elements[el];

           await this.createElement(elem, master);
        }
    }

    Engine.prototype.makeRequest = function(url, method, innerQl)
    {
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.open(method.toUpperCase(), url);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.send(JSON.stringify((innerQl)));

        return xmlHttp.response;
    }

    return Engine;
})();


// All core elements
var MINIBASE_ALL_ELEMENTS =
[
    "BasicButton",
    "BasicDestroyEffects",
    "BasicFloatingWindow",
    "BasicGreed",
    "BasicHeader",
    "BasicPlate",
    "BasicSearchForm",
    "BasicTextInput",
    "Validator"
];

var MINIBASE_PRIVATE_FUNCTIONS =
[
    "connectBaseUttils",
    "connectBaseElements",
    "setAppIco"
];