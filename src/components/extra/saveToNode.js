saveToNode = () => {


    console.log('Saving')
    var body = {
        "data": {
            "type": "node--govcms_standard_page",
            "attributes": {
                "title": "Testing",
                "field_intro": {
                    "value": JSON.stringify(this.state.humanjourney)
                }
            }
        }
    };


    fetch(this.baseurl + "jsonapi/node/govcms_standard_page", {
        method: 'post',
        headers: {
            "Content-Type": "application/vnd.api+json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(body)
    }).then(function (response) {
        return response.json();
    }).then(function (data) {

        console.log(data);

    });

}
