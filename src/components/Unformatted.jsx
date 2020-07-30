import React, {Component} from 'react';

class Unformatted extends Component {

    handleClick = () => {
        this.props.click(this.props.ID);
    }

    render() {
        return (
            <div className={'unformatted'} onClick={this.handleClick}>
                <div className={'title'}>{this.props.info.name}</div>
                <div className={'body'}>
                    <div dangerouslySetInnerHTML={{__html: this.props.info.body}}/>
                </div>
            </div>
        );
    }
}

export default Unformatted;