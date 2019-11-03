var BasicGreed = (function()
{
    function BasicGreed(params)
    {
        this.clsName = "BasicGreed";
        this.tag     = "div";
        this.format  = params.format;
        this.prefill = params.prefill;
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
        var td = document.createElement("span");

        td.className   = this.clsName + "-Cell";
        td.innerHTML   = data;
        td.style.width = this.cellWidth || this.getTdWidth();

        return td;
    }

    BasicGreed.prototype.generateRow = function(arr, clsName)
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

    BasicGreed.prototype.appendDate = function(table)
    {
        
        for (var n=0; n < table.length; n++)
        {
            var row = table[n];
            
            this.dom.appendChild(this.generateRow(row));
        }
    }

    BasicGreed.prototype.render = function()
    {
        this.master.appendChild(this.dom);
        this.dom.insertBefore(this.generateHeader(), this.dom.firstChild);
        
        if (this.prefill) this.appendDate(this.prefill);
    }

    return BasicGreed;
})();