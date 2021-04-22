import React, {Component} from 'react';
import Option from "./Option"

class Options extends Component {

    select = (id) => {
        this.props.select(id)
    }

    render() {

        if (!this.props.options) {
            return <div></div>
        }

        let template = this.props.qTemplate ? this.props.qTemplate : this.props.optionTemplate;

        var options = Object.keys(this.props.options).map(key => {
            return <Option

                hb={this.props.hb}
                select={this.select}
                data-id={this.props.options[key].id}
                key={this.props.options[key].id}
                option={this.props.options[key]}
                optionTemplate={template}
                optionClasses={this.props.optionClasses}
                optionType={this.props.optionType}
                baseurl={this.props.baseurl}
            />
        })

        let ItemType = `${this.props.optionsType}`;

        return (
            <ItemType className={this.props.optionsClasses}>
                {options}
            </ItemType>
        );
    }
}

export default Options;
