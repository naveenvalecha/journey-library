import React from "react";

class InputField extends React.Component {


    constructor() {
        super()
        this.state = {
            class: 'empty',
        }
    }


    verify = (c) => {
        let val = c.target.value;

        if (this.props.allowedChars) {
            let regex = new RegExp(this.props.allowedChars);
            if (!regex.test(val)) {
                return
            }
        }
        let key = this.props.ID;

        let regex = new RegExp(this.props.regex);
        let result = regex.test(val);

        // console.log(val,key,val,result);

        let inclass = 'empty';
        if (val.lenght < 1) {
            inclass = 'empty';
        } else if (result) {
            inclass = 'success';
        } else {
            inclass = 'error';
        }

        this.props.getField(
            val, key, val, result
        );

        //If it contains a non allowed char, don't record it.

        this.setState({
            class: inclass,
        });

        //, () => console.log(this.state)

    }


    render() {

        let val = '';

        // console.log(this.props.Value)

        if (this.props.Value) {
            // if (Object.keys(this.props.Value).length > 0) {
            // console.log(Object.keys(this.props.Value));
            // console.log(Object.keys(this.props));
            // console.log(this.props.Value);

            val = this.props.Value.label;

            // }
        }


        // if(this.props.placeholder === this.props.Value){
        //
        // }

        return (
            <>
                <label
                    className="au-label">
                    {this.props.ID}
                </label>
                <input
                    readOnly={this.props.readOnly}
                    type={this.props.type}
                    onChange={this.verify}
                    className={'form-text au-text-input ' + this.state.class + ' ' + this.props.classes + ' ph-' + this.props.placeholder.replace(/[^a-zA-Z ]/g, "").replace(/ /g, '-').toLowerCase() + ' id-' + this.props.ID.replace(/[^a-zA-Z ]/g, "").replace(/ /g, '-').toLowerCase()}
                    placeholder={this.props.placeholder}
                    inid={this.props.ID}
                    value={val}
                />
                {this.props.suffix}
            </>
        );
    }

}

export default InputField;
