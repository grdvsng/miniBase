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
                    new ElProperty("placeholder", "Username"),
                    new ElProperty("title", "Search user in base"),
                    new ElProperty("required", true)
                ],

                listeners:
                [
                    new ElListener("keyup", function(){
                        var request = new Request('/rest/api/search/user', {method: 'post', body: '{"myql": "fullname -like "' + this.val + '"}'});

                        console.log(request)
                    })
                ],

                validators:
                [
                    new Validator(/[a-zA-Z ]+/gi, "Wrong format, full name does not contain numbers and special characters", "Warring")
                ]
            }]
        }]
    }]
}