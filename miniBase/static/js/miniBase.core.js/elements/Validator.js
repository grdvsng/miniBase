/**
 * Basic validator
 * @class
 */
var Validator = (function()
{
    function Validator(params)
    {
        this.id         = "Validator-" + params.type;
        this.clsName    = "Validator";
        this.message    = params.msg;
        this.re         = params.re;
        this.min_length = params.min_length;
    }

    Validator.prototype.generateElement = function(triggerRect)
    {
        var elem = document.createElement("div");

        elem.className   = this.clsName;
        elem.id          = this.id;
        elem.style.top   = triggerRect.bottom + 2;
        elem.style.left  = triggerRect.left;
        elem.style.width = triggerRect.width;
        elem.innerHTML   = this.message;

        return elem;
    }

    Validator.prototype.remove = function()
    {
        if (this.trigger) 
        {
            this.trigger.onValid = false;
        }

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
        
        this.trigger         = trigger;
        this.trigger.onValid = true;

        if (oldV) oldV.parentNode.removeChild(oldV);
        document.body.appendChild(dom);

        this.trigger = trigger;
        this.dom = dom;
    }

    return Validator;
})();