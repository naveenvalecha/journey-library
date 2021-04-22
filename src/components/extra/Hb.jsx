import React, {Component} from 'react';
const Handlebars = require("handlebars");



class Hb extends Component {
    render() {

        var name = 'Hugo'

        var template = Handlebars.compile("Handlebars <b>{{doesWhat}}</b>");
        // execute the compiled template and print the output to the console
        console.log(template({ doesWhat: "rocks!" }));


        return (
            <div>
                {template}
            </div>
        );
    }
}

export default Hb;
