/**
 * Copyright Morpht Pty Ltd 2020
 */
import React, {Component} from 'react';
import InputField from "./extra/InputField";

class HandleBarBody extends Component {


    constructor(props) {
        super(props);

        this.state = ({
            data: {},
        });

    }


    getField = (val, key, label, result) => {

        let data = {
            [key]: {
                name: key,
                value: val,
                status: result,
                label: label
            }
        };

        this.setState({
                data: Object.assign(this.state.data, data),
            }
            , () => this.props.getExtras(this.state.data, this.props.data.id)
        );
    }

    render() {

        this.props.extras

        var q = null;

        if (this.props.data.custquestion) {
            if (this.props.data.custquestion.type === 'text') {
                var op = <InputField
                    readOnly={false}
                    allowedChars={'^[0-9a-zA-Z]*$'}
                    suffix={''}
                    classes={''}
                    maxValue={''}
                    regex='^[0-9a-zA-Z]*$'
                    placeholder=''
                    ID={this.props.data.custquestion.label}
                    getField={this.getField}
                    Value={"x"}
                />
            }

            q = <div>
                {op}
            </div>;

        }

        console.log()

        let rendered;
        if (this.props.hb === 2) {
            rendered = Drupal.jsonTemplate.render({data: this.props.data}, this.props.bodyTemplate);
        } else if (this.props.hb === 1) {
            rendered = window.hb.rhb(this.props.bodyTemplate)({data: this.props.data});
        } else {
            rendered = data.data.attributes.field_step_body.value;
        }

        // if (q) {
        //     return (<div className={this.props.bodywrapper + this.props.bodyclasses}>
        //         <div dangerouslySetInnerHTML={{__html: rendered}}/>
        //         {q}
        //     </div>)
        // }

        return (

                    <div className={this.props.bodyWrapper + this.props.bodyClasses}
                         dangerouslySetInnerHTML={{__html: rendered}}/>

    );
    }
}

export default HandleBarBody;
