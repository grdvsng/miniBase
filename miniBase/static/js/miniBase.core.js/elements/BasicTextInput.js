/**
 * Basic input element
 * @class
 */
var BasicTextInput = (function()
{
    /**
     * BasicTextInput constructor
     * @constructor
     */
    function BasicTextInput(params)
    {
        this.listeners  = params.listeners || [];
        this.validators = (params.validators) ? this.pushValidators(params.validators):null;
        this.tag        = "input";
        this.clsName    = "BasicTextInput";
        this.label      = params.label      || null;
        this.min_length = params.min_length || 0;

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
            this.pushValidator(new Validator(validators[v]));
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
            validator = {event: "keyup", action: action};

        this.validators.push(validator);
        this.listeners.push(validator);

        return validator;
    }

    return BasicTextInput;
})();