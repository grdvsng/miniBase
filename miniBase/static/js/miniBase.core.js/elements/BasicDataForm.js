var BasicDataForm = (function()
{
    function BasicDataForm(params)
    {
        this.clsName    = "BasicDataForm";
        this.tag        = "div";
        this.items      = [];
        this.fields     = params.fields  || [];
        this.innerHTML  = params.label ? "<div class='BasicDataForm-Label'>" + params.label + "<div>":null;

        this.buildFields();
        
        if (params.submit) this.items.push(this.setSubmit(params.submit));
    }
    
    BasicDataForm.prototype.checkRequired = function()
    {
        var fields = this.dom.getElementsByTagName("input");
 
        for (var n=0; n < fields.length; n++)
        {
            var field = fields[n];
            
            if (field.value === "" || field.value.onValid || field.value <= field.getEl().min_length)
            {
                return false;
            }
        }

        return true;
    }

    BasicDataForm.prototype.setOnsubmit = function(onsubmit)
    {
        var self = this;
        
        return function()
        {
            if (self.checkRequired())
            {
                return onsubmit();
            } else {
                console.log(0);
            }
        }
    }

    BasicDataForm.prototype.setSubmit = function(submit)
    {
        submit.properties = submit.properties || [];
        submit.listeners  = submit.listeners  || [];

        submit.listeners.push({
            event: "click", 
            action: this.setOnsubmit(submit.onSubmit)
        });
        
        return submit;
    }

    BasicDataForm.prototype.render = function()
    {
        MINIBASE.renderElement(this);
    }

    BasicDataForm.prototype.getFieldType = function(field)
    {
        if (field.type === "text")
        {
            return "BasicTextInput";
        } else {
            return null;
        }
    }

    BasicDataForm.prototype.getValidator = function(field)
    {
        return [{
            "re": field.re,
            "msg": field.msg,
            "type": "Error"
        }];
        
    }

    BasicDataForm.prototype.getProperties = function(field)
    {
        var props = [];
        
        for (var att in field)
        {
            if (att !== "label" && att !== "msg" && att !== "re")
            {
                props.push({
                    name: att,
                    value: field[att]
                })
            }
        }

        return props;
    }
    
    BasicDataForm.prototype.buildFields = function()
    {
        for (var n=0; n < this.fields.length; n++)
        {
            var field = this.fields[n];

            this.items.push({
            cls: "BasicRow",
            items:   
                [{
                    cls: this.getFieldType(field),
                    label: field.label,
                    properties: this.getProperties(field),
                    validators: this.getValidator(field),
                    min_length: field.min_length
                }]
            });
        }
    }

    return BasicDataForm;
})();