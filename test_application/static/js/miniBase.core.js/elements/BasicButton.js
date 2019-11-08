var BasicButton = (function()
{
    function BasicButton(params)
    {
        this.clsName   = "BasicButton";
        this.items     = params.items;
        this.tag       = "button";
        this.innerHTML = params.innerHTML;
    }

    return BasicButton;
})();