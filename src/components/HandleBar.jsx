import React, {Component} from 'react';

class HandleBar extends Component {

    handleClick = () => {
        this.props.click(this.props.ID);
    }


    render() {

        let rendered = Drupal.jsonTemplate.render({data: this.props.data}, this.props.optiontemplate);
        let ItemType = `${this.props.itemtype}`;

        return (<ItemType role="listitem" onClick={this.handleClick}
                          className={this.props.itemwrapper + ' ' + this.props.data.classes}
                          dangerouslySetInnerHTML={{__html: rendered}}/>);
    }
}

export default HandleBar;
