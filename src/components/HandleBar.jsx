/**
 * Copyright Morpht Pty Ltd 2020
 */
import React, {Component} from 'react';

class HandleBar extends Component {

    handleClick = () => {
        this.props.click(this.props.ID);
    }

    render() {

        let tmplt = this.props.optionTemplate;

        let img = this.props.data.field_step_image;

        if (img) {
            img = this.props.baseurl + img
        } else if (!img && this.props.demo > 0) {
            img = window.unsplash.random(this.props.demostyle)
        }

        let summary = this.props.data.field_step_summary === "" && this.props.demo > 0 ? window.lipsum.one() : this.props.data.field_step_summary

        let rendered;

        console.log(this.props.optiontemplate);

        if (this.props.hb === 2) {
            rendered = Drupal.jsonTemplate.render({data: this.props.data}, this.props.optiontemplate);
        } else if (this.props.hb === 1) {
            rendered = window.hb.rhb(tmplt)({data: this.props.data, base: this.props, img, summary});
        } else{
            rendered = data.data.attributes.name;
        }

        let ItemType = `${this.props.optiontype}`;

        return (
            <ItemType role="listitem" onClick={this.handleClick}
                      className={this.props.optionClasses + ' ' + this.props.data.classes}
                      dangerouslySetInnerHTML={{__html: rendered}}/>
        );
    }
}

export default HandleBar;
