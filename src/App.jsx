/**
 * Copyright Morpht Pty Ltd 2020
 */
import 'core-js';
import React, {Component} from 'react';
import Panel from "./components/Panel";
import SidePanel from "./components/SidePanel";
import 'whatwg-fetch';

const axios = require('axios');

var {assignItems} = require('./DataMapping');


/**
 *
 *
 *
 */

/**
 *
 * OnLoad
 * 1. Fetches json
 * 2. Assigns to objects
 * 3. Checks local storage
 * 4. Sets root
 * 5. Renders Panel
 *
 *
 */

const version = 1;

class App extends Component {

    constructor(props) {
        super(props);

        this.bodyTemplate = this.props.bodyTemplate ? this.props.bodyTemplate : 'body';
        this.bodyClasses = this.props.bodyClasses ? this.props.bodyClasses : 'body';
        this.bodyWrapper = this.props.bodyWrapper ? this.props.bodyWrapper : 'body-wrapper';
        this.outerOptionsWrapper = this.props.outerOptionsWrapper ? this.props.outerOptionsWrapper : 'list-layout-dis';
        this.optionsType = this.props.optionsType ? this.props.optionsType : 'ul';
        this.optionsClasses = this.props.optionsClasses ? this.props.optionsClasses : 'list journey__options row';
        this.optionClasses = this.props.optionClasses ? this.props.optionClasses : 'journey__option col-xs-12';
        this.optionType = this.props.optionType ? this.props.optionType : 'li';
        this.optionTemplate = this.props.optionTemplate ? this.props.optionTemplate : 'card';
        this.navClasses = this.props.navClasses ? this.props.navClasses : 'btn btn-outline-primary';
        this.demostyle = this.props.demostyle ? this.props.demostyle : 'btn au-btn--secondary';
        this.demo = this.props.demo ? this.props.demo : 0;
        this.dbg = this.props.debug ? this.props.debug : 0;
        this.source = !this.props.source || this.props.source === '/' ? location.protocol + '//' + location.hostname + ':' + location.port + '/' : this.props.source;
        this.baseurl = !this.props.baseurl || this.props.baseurl === '/' ? location.protocol + '//' + location.hostname + ':' + location.port + '/' : this.props.baseurl;

        this.state = ({
            root: 0,
            items: {},
            journey: {},
            humanjourney: {},
            ej: {},
            extras: {},
            message: ''
        });
    }


    fetchData = (fetchstring) => {
        console.log('Fetching data from: ' + fetchstring);
        axios.get(fetchstring)
            .then(data => {
                var trigged = null;
                var items = assignItems(data.data, this.baseurl);
                let root = 0;
                let stage = localStorage.getItem('stage');
                let setteractive = false;
                Object.keys(items).map(key => {
                    if (items[key].setter === 'stage:' + stage) {
                        console.log('Setting root to: ' + items[key].name + ' (' + key + ')');
                        root = key;
                    }

                    if (items[key].parent === 'virtual' && root === 0) {
                        root = key;
                    } else if (items[key].parent === 'virtual' && items[key].weight < items[root].weight && !setteractive) {
                        root = key;
                    }

                    // Check if its loaded on a page that is supposed to trig to a certain step.
                    if (items[key].trigger) {
                        if (items[key].trigger === window.location.pathname.replace(/\/$/, ""))
                            trigged = key;
                    }
                });

                let journey = JSON.parse(localStorage.getItem(this.props.uniqueid + ':' + this.props.taxonomy));
                if (journey === undefined || journey === null || journey.length < 1) {
                    journey = {0: root}
                }

                if (trigged) {
                    journey[Object.keys(journey).length] = trigged
                    //Set setter
                    items[trigged].setter.map(setterkey => {
                        console.log(setterkey);
                        localStorage.setItem(
                            setterkey.key,
                            setterkey.value
                        );
                    });


                }
                let step = Object.keys(journey).length - 1;

                this.setState({
                    root: root,
                    items: items,
                    journey: journey,
                    step: step,
                    included: data.included
                })
            })
            .catch(error => {
                console.log(error);
            })


    }


    componentDidMount() {

        //Check if version number is updated. If yes, clear local storage and set new version number
        //Only update version when the data model is changed.
        if (localStorage.getItem('journeyversion') < version) {
            localStorage.removeItem(this.props.uniqueid + ':' + this.props.taxonomy);
            localStorage.setItem('journeyversion', version);
            localStorage.removeItem('ej');
        } else {
            var ej = JSON.parse(localStorage.getItem('ej'));
            this.setState({
                ej: ej
            })
        }

        this.checkUrl();
        let fetchstring = this.source + '' + this.props.sourcepath + '/' + this.props.taxonomy + '?include=field_step_attributes,field_step_image&sort=weight';
        this.fetchData(fetchstring)

    }

    saveToLs = (values, item, step) => {

        if (item === 'journey') {
            this.translateJourney(values.journey);
            // console.log(values)
            // console.log('Step: ' + step)
            Object.keys(values).map(key => {
                localStorage.setItem(this.props.uniqueid + ':' + this.props.taxonomy, JSON.stringify(values[key]));
            });
            this.setState({
                journey: values.journey,
                step: step
            });
        }
    }

    saveEJ = (ej) => {
        this.setState({
            ej: ej
        });

        localStorage.setItem('ej', JSON.stringify(ej));

    }

    /**
     *
     * Set data-debug="true" in the index file to display debug info below Journey.
     *
     */
    debug = () => {


        if (this.dbg > 0) {
            return <div className={'debug'} key={this.state.step}>
                <h2>Debug</h2>
                <table className={'table'}>
                    <thead>
                    <tr>
                        <th>Variable</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>version</td>
                        <td>{version}</td>
                    </tr>
                    <tr>
                        <td>step</td>
                        <td>{this.state.step}</td>
                    </tr>
                    <tr>
                        <td>root</td>
                        <td>{this.state.root}</td>
                    </tr>
                    <tr>
                        <td>baseurl</td>
                        <td>{this.props.baseurl}</td>
                    </tr>
                    <tr>
                        <td>journey</td>
                        <td>{JSON.stringify(this.state.journey)}</td>
                    </tr>
                    </tbody>
                </table>
                <h6>Readable Journey</h6>
                <code>{JSON.stringify(this.state.humanjourney)}</code>
                <h6>Items</h6>
                <code>{JSON.stringify(this.state.items)}</code>
            </div>

        }

    }

    translateJourney = (values) => {

        var hj = {};
        let prev;
        Object.keys(values).map(key => {
            hj[key] = {}
            if (this.state.items[values[key]]) {
                hj[key].label = this.state.items[values[key]].name;
                if (this.state.items[values[prev]]) {
                    hj[key].q = this.state.items[values[prev]].field_step_body.replace(/<[^>]*>?/gm, '');

                    if (hj[key].q === '' || hj[key].q === null) {
                        // console.log(this.state.items[values[prev]]);
                        // console.log(this.state.items[values[prev]].field_step_body);
                    }

                } else {
                    //console.log(this.state.items[values[key]])
                }

                if (this.state.extras[values[key]]) {
                    hj[key].extras = this.state.extras[values[key]];
                }
            }
            prev = key;
        });

        localStorage.setItem(this.props.uniqueid + ':' + this.props.taxonomy + ':' + 'humanjourney', JSON.stringify(hj));

        this.setState({
            humanjourney: hj
        })
    }

    takeStep = (step) => {
        this.setState({
            step: step + 1
        }, () => this.render())
    }

    render() {

        if (this.state.root === 0 && this.state.message === '') {
            return <div>Reading data</div>
        } else if (this.state.root === 0) {
            return <div>{this.state.message}</div>
        }

        return (
            <>
                <main className="au-grid">
                    <div className="container">


                        <div className="row">
                            <div className="col-xs-8 ">
                                <Panel
                                    // key={this.state.step}
                                    items={this.state.items}
                                    step={this.state.step}
                                    ej={this.state.ej}
                                    root={this.state.root}
                                    saveToLs={this.saveToLs}
                                    saveEJ={this.saveEJ}
                                    journey={this.state.journey}
                                    baseurl={this.props.baseurl}
                                    included={this.state.included}

                                    bodyTemplate={this.bodyTemplate}
                                    bodyClasses={this.bodyClasses}
                                    bodyWrapper={this.bodyWrapper}

                                    outerOptionsWrapper={this.outerOptionsWrapper}
                                    optionsType={this.optionsType}
                                    optionsClasses={this.optionsClasses}

                                    optionClasses={this.optionClasses}
                                    optionType={this.optionType}
                                    optionTemplate={this.optionTemplate}

                                    navClasses={this.navClasses}

                                    demo={this.demo}
                                    demostyle={this.demostyle}

                                    save={this.saveToNode}

                                />
                            </div>
                            <div className="col-xs-4">
                                <SidePanel hj={this.state.ej}
                                           step={this.state.step}
                                           takeStep={this.takeStep}
                                /></div>
                        </div>
                    </div>
                </main>

                {this.debug()}
            </>
        );


    }
}

export default App;
