/**
 * Basic validator
 * @class
 */
var Validator = (function()
{
    function Validator(params)
    {
        this.id      = "Validator-" + params.type;
        this.clsName = "Validator";
        this.message = params.msg;
        this.re      = params.re;
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