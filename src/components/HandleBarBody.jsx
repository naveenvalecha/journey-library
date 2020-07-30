import React, {Component} from 'react';

class HandleBarBody extends Component {

    handleClick = () => {
        this.props.click(this.props.ID);
    }

    render() {
        let rendered = Drupal.jsonTemplate.render({data: this.props.data}, this.props.bodytemplate);
        return (<div onClick={this.handleClick} className={this.props.bodywrapper} dangerouslySetInnerHTML={{__html: rendered}}/>);
    }
}

export default HandleBarBody;
