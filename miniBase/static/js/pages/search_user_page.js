var search_user_page =
{
    reverse: false,
    
    items: [{
        cls: "BasicHeader",
        keepScroll: true,
        label: "miniBase"
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

                listeners:
                [
                ],

                "validators":
                [{
                    "re": /[a-zA-Z ]+/gi,
                    "msg": "Wrong format, full name does not contain numbers and special characters",
                    "type": "Warring"
                }]
            }]
        }, {
            cls: "BasicGreed",
            format: ["Name", "Patronymic", "Surname"],
            
        }]
    }]
}