/**
 * Copyright Morpht Pty Ltd 2020
 */
import React, {Component} from 'react';
import HandleBar from "./HandleBar";
import HandleBarBody from "./HandleBarBody";
// import {motion, AnimatePresence} from "framer-motion"

const mac = false;

class Panel extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            journey: this.props.journey,
            q: '',
            as: {},
            step: this.props.step,
            extras: {},
            ej: {},
        });

    }

    componentDidMount() {
        this.pickQuestion();
    }

    /**
     * Show the next question and options.
     */
    pickQuestion = () => {

        let lastkey = this.state.journey[this.state.step];

        //Set to root if no question available.
        if (!this.props.items[lastkey]) {
            lastkey = this.props.root;
        }

        //Create object with answer objects.
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

        // FilterSmart has been postponed
        // this.filterSmart();
    }

    /**
     * Saving step to journey
     */
    processSelection = (c) => {

        //Detect what step we are at
        let step = this.state.step;
        let journey = this.state.journey;
        step++;
        journey[step] = c;

        let ej = this.state.ej;

        ej[step] = {
            id: c,
            ho: this.state.as[c].option,
            hs: this.state.as[c].field_step_summary,
            q: this.state.q.id,
            hq: this.state.q.body,
        };

        if (this.props.items[c].jump !== null) {
            journey[step] = this.props.items[c].jump;
            console.log(journey[step])
        }

        //If the next in line does not belong to the current. Clear selection.

        if (this.props.items[journey[step + 1]] && this.props.items[journey[step + 1]].parent) {
            console.log(this.props.items[journey[step + 1]].parent);
            console.log(journey[step]);

            let i = 1;
            while (journey[step + i]) {
                delete journey[step + i];
                delete ej[step + i];
            }
        }


        this.setState({
            journey: journey,
            step: step,
            ej: ej,
        }, () => this.pickQuestion());

        this.props.saveEJ(ej);

        if (this.props.items[c].setter) {
            if (this.props.items[c].setter.length) {
                this.props.items[c].setter.map(key => {
                    // console.log(key);
                    // console.log(this.props.items[c].setter[key]);
                    if (key.key) {
                        localStorage.setItem(
                            key.key,
                            key.value
                        );
                    }
                });

                localStorage.setItem(
                    this.props.items[c].setter.key,
                    this.props.items[c].setter.value
                );
            }
        }

        if (this.props.items[c].redirect && this.props.items[c].redirect !== null && this.props.items[c].redirect !== 'null') {

            //@ToDo: Get url rather than internal id(or feed current node to template)
            console.log('Current');
            console.log(window.location.href);
            console.log('Redirect');
            console.log(this.props.items[c].redirect);
            console.log('Redirecting to ' + this.props.items[c].redirect);
            window.location.href = this.props.items[c].redirect;
        }

        this.props.saveToLs({journey}, 'journey', step);
        //Reset to beginning of journey if object data model doesn't match.
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
        this.takeStep(-1)
    }

    takeStep = (adjust) => {

        var step = this.state.step;
        var journey = this.state.journey;
        var ej = this.state.ej;

        if ((step === 0 || journey.length < 2) && adjust < 0) {
            return;
        }

        step = step + adjust;

        this.setState({
            journey: journey,
            ej: ej,
            step: step,
        }, () => this.pickQuestion());

        this.props.saveEJ(ej);
        this.props.saveToLs({journey}, 'journey', step);
    }


    forward = () => {
        this.takeStep(1)
    }

    /**
     * Restarts journey
     */
    reset = () => {
        let step = 0;
        let root = this.props.root
        let journey = {0: root}

        this.setState({
            journey: {0: root},
            step: step,
            ej: {}
        }, () => this.pickQuestion());

        this.props.saveEJ({});
        this.props.saveToLs({journey}, 'journey', step);

    }

    /**
     * Extras not used at the moment.
     **/
    getExtras = (extras, id) => {
        let storedextras = this.state.extras;
        storedextras[id] = extras;

        this.setState({
            extras: storedextras
        }, () => this.props.saveToLs(storedextras, 'extras'));
    }

    render() {

        let hb = false;

        //Debugging for json template
        if (typeof Drupal !== 'undefined' && Drupal){
            console.log('Drupal object exists, printing jsonTemplate')
            // console.log(Drupal)
            console.log(Drupal.jsonTemplate)
            // console.log('window')
            // console.log(window)


        }


            if (typeof Drupal !== 'undefined' && Drupal && Drupal.jsonTemplate && Drupal.jsonTemplate.render) {
            hb = 2;
            console.log('Drupal json template detected. Using it to render.');
        } else if (window.hb) {

            // console.log(Drupal);
            // console.log(Drupal.jsonTemplate);
            console.log('No external handlebars handler detected. Utilise local handlebar templates.');
            hb = 1;
        } else {
            console.log('No handlebar available. Using internal defaults');
            hb = 0;
        }
        let template = this.props.optionTemplate;

        if (this.state.q.template) {
            template = this.state.q.template
        }

        let as = Object.keys(this.state.as).map(key => {

            return <HandleBar
                data={this.state.as[key]}
                key={key}
                click={this.processSelection}
                info={this.state.as[key]}
                ID={key}
                optiontype={this.props.optionType}
                optionClasses={this.props.optionClasses}
                optionTemplate={template}
                included={this.props.included}
                baseurl={this.props.baseurl}
                hb={hb}
                demo={this.props.demo}
                demostyle={this.props.demostyle}
            />
        });

        var body =
            <HandleBarBody
                bodyWrapper={this.props.bodyWrapper}
                bodyTemplate={this.props.bodyTemplate}
                bodyClasses={this.props.bodyClasses}
                data={this.state.q}
                extras={this.state.extras[this.state.q.id]}
                hb={hb}
                getExtras={this.getExtras}
                demo={this.props.demo}
                demostyle={this.props.demostyle}
            />

        if (this.state.q.template && this.state.q.template.startsWith('takeover-')) {
            if (this.state.q.template === 'takeover-calculator') {
                body = <Calculator

                    data={this.state.q}

                />
            }
        }

        let ListType = `${this.props.optionsType}`;

        return (

            <div className={'journey'}>
                {body}
                <div className={this.state.q.classes ? this.state.q.classes : this.props.outerOptionsWrapper}>
                    {/*Animations disabled for demo*/}
                    {/*<AnimatePresence exitBeforeEnter>*/}
                    {/*    <motion.div key={this.state.q.id}*/}
                    {/*                initial={{x: 400, opacity: 0}}*/}
                    {/*                animate={{x: 0, opacity: 1}}*/}
                    {/*                exit={{x: -400, opacity: 0}}*/}
                    {/*    >*/}
                    <ListType className={this.props.optionsClasses} role="list">
                        {as}
                    </ListType>
                    {/*    </motion.div>*/}
                    {/*</AnimatePresence>*/}
                </div>
                <div className="journey__navs">
                    {this.state.step > 0 && !this.state.q.hide_back > 0 ? (
                        <div className={this.props.navClasses} onClick={this.back}
                             data-journey-navs-id="back">Back</div>) : (null)}
                    {!this.state.q.hide_back > 0 && this.state.step + 1 < Object.keys(this.state.journey).length ? (
                        <div className={this.props.navClasses} onClick={this.forward}
                             data-journey-navs-id="back">Forward</div>) : (null)}
                    {this.state.step > 0 && !this.state.q.hide_reset > 0 ? (
                        <div className={this.props.navClasses} onClick={this.reset}
                             data-journey-navs-id="reset">Reset</div>) : (null)}
                </div>
            </div>

        );
    }
}

export default Panel;
