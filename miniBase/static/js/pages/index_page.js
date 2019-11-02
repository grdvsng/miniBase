var index_page =
{
    reverse: false,

    items: [{
        cls: "BasicPlate",
        properties: [{
            "name": "style",
            "value": "position: fixed; bottom: 0%;"
        }],

        items: [{
            cls: "BasicFloatingWindow",

            items: 
            [{
                cls: "BasicHeader",
                label: "miniBase"
            }, {
                cls: "BasicButton",
                innerHTML: "Search user",

                listeners:
                [{
                    "event": "click",
                    "action": function()
                    {
                        this.getEl().Engine.replacePage(window["search_user_page"]);
                    }
                }]
            }, {
                cls: "BasicButton",
                innerHTML: "Push user" 
            }]
        }]
    }]
}