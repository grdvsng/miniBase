var search_user_page =
{
    reverse: false,
    cls: "search_user_page",
    onReady: [function()
    {
        var query =
        {
            tables:  ["users_name_mail"],
            method: "select",
            params: "key like '[*]{0,}'"
        },
            table = document.getElementById("UsersGreed").getEl();

        MINIBASE.makeRequest(
            "/rest/api/getUsers",
            "post",
            query,
            true,
            function(xhr)
            {
                table.pathTableFromXhrResponse.apply(table, [xhr]);
        });
    }],

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
                }],

                "listeners": [{
                    "event": "keyup",
                    "action": function()
                    {
                        var query =
                        {
                            tables:  ["users_name_mail"],
                            method: "select",
                            params: "key like '" + this.value + "' or val like '" + this.value + "'"
                        },
                            table = document.getElementById("UsersGreed").getEl();

                        MINIBASE.makeRequest(
                            "/rest/api/getUsers",
                            "post",
                            query,
                            true,
                            function(xhr)
                            {
                                table.pathTableFromXhrResponse.apply(table, [xhr, true]);
                        });
                    }
                }]
            }]
        }, {
            cls: "BasicGreed",
            format: ["Name", "Mail"],
            properties:
            [{
                name: "id",
                value: "UsersGreed"
            }]
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