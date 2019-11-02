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
})();