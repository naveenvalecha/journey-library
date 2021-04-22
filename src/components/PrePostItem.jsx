import React, {Component} from 'react';

class PrePostItem extends Component {

    click = (c) => {
        this.props.select(c.currentTarget.dataset.id, c.currentTarget.dataset.action);
    }


    render() {

        let classes = 'list-group-item';
        let subclasses = 'au-callout';
        if (this.props.active) {
            subclasses += ' au-callout--dark';
        }

        return (
            <div
                key={this.props.item.id}
                className={classes}
                data-id={this.props.item.id}
                data-action={'nav'}
                onClick={this.click}
            >
                <section className={subclasses}>
                    {this.props.item.option}
                </section>
            </div>
        );
    }
}

export default PrePostItem;
