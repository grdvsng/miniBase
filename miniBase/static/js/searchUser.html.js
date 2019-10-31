var searchPage =
{
    items: [{
        cls: "BasicHeader",
        innerHTML: "miniBase"
    }, {
        cls: "BasicPlate",

        items: [{
            cls: "BasicGreed",
            format: ["Name", "Patronymic", "Surname"],
        }, {
            cls: "BasicSearchForm",

            items: [{
                cls: "BasicTextInput",
                label: "Search user in base",

                properties:
                [
                    {"name": "placeholder", "value": "Username"},
                    {"name": "title",       "value": "Search user in base"},
                    {"name": "required",    "value": true}
                ],

                listeners:
                [
                    {
                        "event": "keyup",
                        "action": (function()
                        {
                            var response = this.getEl().Engine.makeRequest(
                                "/rest/api/getUsers",
                                "GET",
                                {
                                    "table": "users",
                                    "select":
                                    {
                                        "fullName": this.value,
                                        "method": "like"
                                    },
                                    "method": "select",
                                    "operator": "like"
                                }
                            );
                        })
                    }
                ],

                "validators":
                [{
                    "re": /[a-zA-Z ]+/gi,
                    "msg": "Wrong format, full name does not contain numbers and special characters",
                    "type": "Warring"
                }]
            }]
        }]
    }]
}