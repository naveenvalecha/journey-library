import React, {Component} from 'react';
import Panel from "./components/Panel";
import 'whatwg-fetch';

var {assignItems} = require('./DataMapping');


/**
 *
 * Ideas:
 *      Can this be turned into a calculator?
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
 * Functions
 * 1. Saves to Local Storage
 *
 */

const version = 1;


class App extends Component {

    constructor(props) {
        super(props);


        this.state = ({
            root: 0,
            items: {},
            journey: {}
        });
    }

    componentDidMount() {

        //Check if version number is updated. If yes, clear local storage and set new version number
        //Only update version when the data model is changed.
        if (localStorage.getItem('journeyversion') < version) {
            localStorage.removeItem(this.props.uniqueid + ':' + this.props.taxonomy);
            localStorage.setItem('journeyversion', version);
        }


        this.checkUrl();
        var trigged = null;

        let fetchstring = this.props.source + '/' + this.props.sourcepath + '/' + this.props.taxonomy + '?include=field_step_attributes,field_step_image';

        console.log('Fetching data from: ' + fetchstring);

        fetch(fetchstring, {
            crossDomain: true
        })
            .then(response => response.json())
            .then(data => {
                    var items = assignItems(data, this.props.baseUrl);
                    let root = 0;
                    let stage = localStorage.getItem('stage');
                    Object.keys(items).map(key => {
                        if (items[key].setter === 'stage:' + stage) {
                            console.log('Setting root to: ' + items[key].name + ' (' + key + ')');
                            root = key;
                        }
                        if (items[key].parent === 'virtual' && root === 0) {
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
                    }
                    let step = Object.keys(journey).length - 1;

                    this.setState({
                        root: root,
                        items: items,
                        journey: journey,
                        step: step,
                        included: data.included
                    })

                }
            )
            .catch(
                function (ex) {
                    console.log('parsing failed', ex)
                }
            )
        ;

    }

    checkUrl = () => {
        console.log(window.location.pathname.replace(/\/$/, ""));
    }


    saveToLs = (values) => {
        Object.keys(values).map(key => {
            localStorage.setItem(this.props.uniqueid + ':' + this.props.taxonomy, JSON.stringify(values[key]));
        });
    }

    /**
     *
     * Set data-debug="true" in the index file to display debug info below Journey.
     *
     * @returns {*}
     */
    debug = () => {
        if (this.props.debug === 'true') {
            return <div className={'debug'}>
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
                    </tr>                    <tr>
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
                <h6>Items</h6>
                <code>{JSON.stringify(this.state.items)}</code>
            </div>

        }

    }


    render() {

        if (this.state.root === 0) {
            return <div>Reading data</div>
        }

        return (
            <>
                <Panel
                    items={this.state.items}
                    step={this.state.step}
                    root={this.state.root}
                    saveToLs={this.saveToLs}
                    journey={this.state.journey}
                    baseurl={this.props.baseurl}
                    optiontemplate={this.props.optiontemplate}
                    bodytemplate={this.props.bodytemplate}
                    buttonclasses={this.props.buttonclasses}
                    listwrapper={this.props.listwrapper}
                    bodywrapper={this.props.bodywrapper}
                    itemwrapper={this.props.itemwrapper}
                    listtype={this.props.listtype}
                    itemtype={this.props.itemtype}
                    bodytemplate={this.props.bodytemplate}
                    included={this.state.included}
                />
                {this.debug()}
            </>);


    }
}

export default App;
