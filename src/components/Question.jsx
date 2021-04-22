import React, {Component} from 'react';

class Question extends Component {
    render() {

        let classes = this.props.bodyWrapper + ' ' +  this.props.bodyClasses;

        if (this.props.question && this.props.question.body) {

            let body = this.props.question.data.attributes.field_step_body ? this.props.question.data.attributes.field_step_body.value : '';

            let rendered;

            if (this.props.hb === 2) {
                rendered = Drupal.jsonTemplate.render({data: this.props.question}, this.props.bodyTemplate);
            } else if (this.props.hb) {
                rendered = this.props.hb.rhb(this.props.bodyTemplate)({data: this.props.question});
            } else {
                rendered = body;
            }
//className={this.props.bodyWrapper + this.props.bodyClasses}

            return <div className={classes} dangerouslySetInnerHTML={{__html: rendered}}/>;
        } else {
            return <div className={classes + " empty"}></div>;
        }
    }
}

export default Question;
