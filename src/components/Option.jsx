import React, {Component} from 'react';

class Option extends Component {

    click = (c) => {
        this.props.select(c.currentTarget.dataset.id);
    }


    render() {

        let tmplt = this.props.optionTemplate;
        let img = this.props.option.field_step_image;

        let summary = this.props.option.field_step_summary;// === "" && this.props.demo > 0 ? window.lipsum.one() : this.props.option.data.field_step_summary

        if (img) {
            img = this.props.baseurl + img
        } else if (!img && this.props.demo > 0) {
            img = window.unsplash.random(this.props.demostyle)
        }

        let rendered;
        if (this.props.hb) {
            rendered = this.props.hb.rhb(tmplt)({data: this.props.option, base: this.props.option, img, summary});
        } else {
            rendered = this.props.option.option;
        }

        let ItemType = `${this.props.optionType}`;

        let classes = this.props.optionClasses;

        return (
            // <div data-id={this.props.option.id} onClick={this.click}>{this.props.option.option}</div>

            <ItemType role="listitem" className={classes} onClick={this.click}
                 data-id={this.props.option.id}
                // className={this.props.optionClasses + ' ' + this.props.data.classes}
                 dangerouslySetInnerHTML={{__html: rendered}}/>
        );
    }
}

export default Option;
