import React, {Component} from 'react';

class Unformatted extends Component {

    handleClick = () => {
        this.props.click(this.props.ID);
    }

    render() {

        console.log(this.props.itemtype);

        let ItemType = `${this.props.itemtype}`;

        return (
            <ItemType role="listitem" onClick={this.handleClick} className={this.props.itemwrapper + ' ' + this.props.data.classes}>
                <div className={'title'}>{this.props.info.name}</div>
                <div className={'body'}>
                    <div dangerouslySetInnerHTML={{__html: this.props.info.summary}}/>
                </div>
            </ItemType>

        );
    }
}

export default Unformatted;
