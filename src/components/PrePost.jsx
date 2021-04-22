import React, {Component} from 'react';
import PrePostItem from "./PrePostItem"

class PrePost extends Component {

    select = (id, action) => {
        this.props.select(id, action)
    }

    render() {
        if (!this.props.items || Object.keys(this.props.items).length === 0) {
            return <div></div>;
        }

        let items = Object.values(this.props.items).map((item, index) => {
            return <PrePostItem
                key={item.id + index}
                active={this.props.active}
                select={this.select}
                item={item}
                id={item.id + index}
            />
        })

        let classes = 'prepost';
        if (this.props.active) {
            classes += ' active';
        }

        return (
            <div className={classes}>
                {items}
            </div>
        );
    }
}

export default PrePost;
