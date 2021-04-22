import React, {Component} from 'react';

class HorCard extends Component {
    render() {
        return (
            <div className="card">
                <div className="card-header">
                    {this.props.name}
                </div>
                <div className="card-body">
                    {/*<h5 className="card-title">Special title treatment</h5>*/}
                    <p className="card-text"><div dangerouslySetInnerHTML={{__html:this.props.body}}/></p>
                </div>
            </div>
        );
    }
}

export default HorCard;
