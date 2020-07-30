import React, {Component} from 'react';
import Unformatted from "./Unformatted";
import HandleBar from "./HandleBar";
import HandleBarBody from "./HandleBarBody";

class Panel extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            journey: this.props.journey,
            q: '',
            as: {},
            step: this.props.step
        });

    }

    componentDidMount() {
        this.pickQuestion();
    }

    /**
     * Set the next question.
     */
    pickQuestion = () => {
        let lastkey = Object.values(this.state.journey).splice(-1, 1)[0];

        var as = {};
        Object.keys(this.props.items).map(key => {
            if (this.props.items[key].parent === lastkey) {
                as[key] = this.props.items[key];
            }
        });

        this.setState({
            q: this.props.items[lastkey],
            as: as
        });

        let journey = this.state.journey;
        this.props.saveToLs({journey});


        this.filterSmart();
    }

    /**
     * Saving step to journey
     */
    processSelection = (c) => {
        let step = this.state.step;
        let journey = this.state.journey;
        step++;
        journey[step] = c;
        if (this.props.items[c].jump !== null) {
            journey[step] = this.props.items[c].jump;
        }

        this.setState({
            journey: journey,
            step: step,
        }, () => this.pickQuestion());

        if (this.props.items[c].setter) {
            localStorage.setItem(
                this.props.items[c].setter.key,
                this.props.items[c].setter.value
            );
        }

        if (this.props.items[c].redirect && this.props.items[c].redirect !== null && this.props.items[c].redirect !== 'null') {
            // window.location.href = this.props.items[c].redirect;
        }

        if (!this.state.q) {
            this.reset();
        }
    }

    /**
     * Hides every .smart-block-item block, shows .smart-block-item-xx blocks.
     * Temporary disabled.
     */
    filterSmart = () => {
        // let step = this.state.step;
        // let journey = this.state.journey;
        // let key = journey[step];
        //
        //
        // if (this.props.items[key].tid) {
        //     var tid = this.props.items[key].tid;
        //
        //     console.log('Showing all divs with class .smart-block-item-' + tid);
        //
        //     this.toggle('smart-block-item', 'none');
        //     this.toggle('smart-block-item-' + tid, 'block');
        // }

    }

    toggle(className, displayState) {
        var elements = document.getElementsByClassName(className)

        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = displayState;
        }
    }

    /**
     * Take one step back in the journey
     */
    back = () => {
        let step = this.state.step;
        var journey = this.state.journey;

        if (step === 0 || journey.length < 2) {
            return;
        }

        delete journey[step];
        step--;

        this.setState({
            journey: journey,
            step: step,
        }, () => this.pickQuestion());
    }

    /**
     * Restarts journey
     */
    reset = () => {
        let step = 0;
        let root = this.props.root

        this.setState({
            journey: {0: root},
            step: step,
        }, () => this.pickQuestion());

    }

    render() {

        let hb = false;

        if (typeof Drupal !== 'undefined' && Drupal && Drupal.jsonTemplate && Drupal.jsonTemplate.render) {
            hb = true;
        } else {
            console.log('No handlebars handler detected. Utilise default template.');
        }


        let as = Object.keys(this.state.as).map(key => {

            if (this.state.as[key].display === 'button') {
                return <div className={'btn btn-primary'} key={key}
                            onClick={() => this.processSelection(key)}>{this.state.as[key].name}</div>
            }


            if (hb) {
                return <HandleBar
                    data={this.state.as[key]}
                    key={key}
                    click={this.processSelection}
                    info={this.state.as[key]}
                    ID={key}
                    itemtype={this.props.itemtype}
                    itemwrapper={this.props.itemwrapper}
                    optiontemplate={this.props.optiontemplate}
                    included={this.props.included}
                />
            }

            return <Unformatted
                key={key}
                click={this.processSelection}
                info={this.state.as[key]}
                ID={key}
            />;
        });


        if (hb) {
            var body = <HandleBarBody
                bodywrapper={this.props.bodywrapper}
                bodytemplate={this.props.bodytemplate}
                data={this.state.q}
            />
        } else {
            var body = <div className={'question journey__step'}>
                <ul className="list-group">
                    <li className="list-group-item">
                        <p>{this.state.q.name}</p>
                        <div dangerouslySetInnerHTML={{__html: this.state.q.field_step_body}}/>
                    </li>
                </ul>
            </div>;
        }

        let ListType = `${this.props.listtype}`;

        return (
            <ListType className={'journey'}>
                {body}
                <ListType className={'list ' + this.props.listwrapper} role="list">
                    {as}
                </ListType>
                <div className="journey__navs">
                    {this.state.step > 0 && !this.state.q.hide_back > 0 ? (
                        <div className={this.props.buttonclasses} onClick={this.back}
                             data-journey-navs-id="back">Back</div>) : (null)}
                    {this.state.step > 0 && !this.state.q.hide_reset > 0 ? (
                        <div className={this.props.buttonclasses} onClick={this.reset}
                             data-journey-navs-id="reset">Reset</div>) : (null)}
                </div>
            </ListType>
        );
    }
}

export default Panel;
