var BasicRow = (function()
{
    function BasicRow(params)
    {
        this.clsName = "BasicRow";
        this.tag     = "p";
        this.items   = params.items || [];
    }

    return BasicRow;
})();