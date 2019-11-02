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
                innerHTML: "miniBase"
            }, {
                cls: "BasicBottom",
                innerHTML: "Search user",

                listeners: [{
                    "event": "click",
                    "action": function()
                    {
                        this.getEl().Engine.replacePage(window["search_user_page"]);
                    }
                }]
            }, {
                cls: "BasicBottom",
                innerHTML: "Push user" 
            }]
        }]
    }]
}