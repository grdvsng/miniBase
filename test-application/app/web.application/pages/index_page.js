var index_page =
{
    reverse: false,
    cls: "index_page",

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
                        MINIBASE.replacePage("search_user_page");
                    }
                }]
            }, {
                cls: "BasicButton",
                innerHTML: "Push user",

                listeners:
                [{
                    "event": "click",
                    "action": function()
                    {
                        MINIBASE.replacePage("push_user_page");
                    }
                }]
            }]
        }]
    }]
}