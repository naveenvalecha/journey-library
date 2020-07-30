import React, {Component} from 'react';

class Card extends Component {


    handleClick = () => {
        this.props.click(this.props.cardID);
    }


    render() {
        return (
            <div className="list__item" onClick={this.handleClick}>
                <div className="au-card au-body au-card--shadow au-card--clickable stack stack--detail">
                    {this.props.card.field_step_image ? (
                        <div className="stack__image">
                            <img
                                src={this.props.baseurl + this.props.card.field_step_image}/>
                        </div>
                    ) : (null)}
                    <div className="stack__content">
                        <h3 className="stack__title">
                            {this.props.card.name}
                        </h3>
                        <div className="stack__summary">
                            <div dangerouslySetInnerHTML={{__html: this.props.card.field_step_summary}}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
