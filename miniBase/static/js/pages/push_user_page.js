var push_user_page =
{
    reverse: false,
    cls: "push_user_page",

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
            cls: "BasicDataForm",
            label: "Append user in base",

            fields: [{
                label: "User Name",
                name: "user_name",
                required: true,
                type: "text",
                msg: "Incorect login format",
                re: LOGIN_REGEXP,
                minlength: 5
            }, {
                label: "Mail",
                name: "user_mail",
                required: true,
                type: "text",
                msg: "Incorect mail format",
                re: MAIL_REGEXP,
                minlength: 5
            }],

            submit:
            {
                cls: "BasicButton",
                innerHTML: "ADD USER",
                onSubmit: function()
                {
                    console.log(777);
                }
            }
        }]
    }]
}