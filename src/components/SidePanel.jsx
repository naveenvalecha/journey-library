/**
 * Copyright Morpht Pty Ltd 2020
 */
import React, {Component} from 'react';

class SidePanel extends Component {


    constructor(props) {
        super(props);

        this.state = {
            step: this.props.step
        }
    }


    render() {

        if (!this.props.hj || Object.keys(this.props.hj).length === 0) {
            return (<div></div>)
        }

        let side = Object.values(this.props.hj).map((item, index) => {

            let calloutclass = index === this.props.step ? 'au-callout au-callout--dark' : "au-callout"

            return <li key={index} className="list-group-item" data-index={index} data-id={item.id} onClick={this.takeStep}>
                <section className={calloutclass}>
                    {/*<h4 className="au-callout__heading">{item.hq.replace(/<[^>]*>?/gm, '')}</h4>*/}
                    <p>{item.ho.replace(/<[^>]*>?/gm, '')}</p>
                </section>
            </li>
        });

        return (
            <div>
                <h3>Your selections:</h3>
                <ul className={'list-group'}>
                    {side}
                </ul>
            </div>
        );
    }
}

export default SidePanel;
