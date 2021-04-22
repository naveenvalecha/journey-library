import React, {Component} from 'react';

class MacButton extends Component {


    handleClick = () => {
        this.props.click(this.props.ID);
    }

    render() {

        return (
            // <div>
                <button className="button" onClick={this.handleClick}>
                    <div className="button__content">
                        {/*<div className="button__icon">*/}

                        {/*</div>*/}
                        <p className="button__text">{this.props.info.name}</p>
                    </div>
                </button>
            // </div>
        );
    }
}

export default MacButton;
