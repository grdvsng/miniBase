var search_user_page =
{
    reverse: false,
    cls: "search_user_page",
    
    items: [{
        cls: "BasicHeader",
        keepScroll: true,
        label: "miniBase",
        
        properties:
        [{
            "name": "title",
            "value": "Back to index"
        }],

        listeners:
        [{
            event: "click",
            action: function()
            {
                MINIBASE.replacePage("index_page");
            }
        }]
    }, {
        cls: "BasicPlate",

        items: [{
            cls: "BasicSearchForm",
            properties: 
            [{
                name: "id",
                value: "#SearchForm1"
            }],

            items: [{
                cls: "BasicTextInput",
                label: "Search user in base",

                properties:
                [{
                    name: "placeholder", 
                    value: "Username"
                }, {
                    name: "title",       
                    value: "Search user in base"
                }, {
                    name: "required",    
                    value: true
                }],

                "validators":
                [{
                    "re": /[a-zA-Z@.0-9_]+/gi,
                    "msg": "Wrong format for name or mail address...",
                    "type": "Warring"
                }]
            }]
        }, {
            cls: "BasicGreed",
            format: ["Name", "Mail"],
            prefill: [["<br />", "<br />"]]
        }, {
                cls: "BasicButton",
                innerHTML: "ADD USER",

                properties:
                [{
                    name: "id",
                    value: "search_user_page_add_button"
                }],

                listeners:
                [{
                    event: "click",
                    action: function()
                    {
                        MINIBASE.replacePage("push_user_page");
                    }
                }]
        }]
    }]
}