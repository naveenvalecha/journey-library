import React, {Component} from 'react';

class NavBar extends Component {

    click = (c) => {
        this.props.select(c.target.dataset.id, c.target.dataset.action);
    }

    render() {

        var classes = this.props.navclasses;

        return (
            <div>
                {this.props.back ? (<div role='button' className={classes}
                                         type="button"
                                         data-id={this.props.back}
                                         data-action={'back'}
                                         onClick={this.click}
                >Back</div>) : (<div className={classes + ' disabled'} type="button" disabled>Back</div>)}
                {this.props.next ? (<div className={classes}
                                         role='button'
                                         type="button"
                                         data-id={this.props.next}
                                         data-action={'next'}
                                         onClick={this.click}
                >Next</div>) : (<div className={classes + ' disabled'} disabled role='button'>Next</div>)}
                <div className={classes}
                     type="button"
                     role='button'
                     data-id={this.props.next}
                     data-action={'reset'}
                     onClick={this.click}
                >Reset
                </div>


            </div>
        );
    }
}

export default NavBar;
