import React, {Component} from 'react';

class HandleBarBody extends Component {

    render() {
        let rendered = Drupal.jsonTemplate.render({data: this.props.data}, this.props.bodytemplate);
        return (<div className={this.props.bodywrapper} dangerouslySetInnerHTML={{__html: rendered}}/>);
    }
}

export default HandleBarBody;
