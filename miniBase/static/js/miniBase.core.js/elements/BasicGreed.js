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
})();