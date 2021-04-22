import React, {Component} from 'react';
import Question from "./Components/Question"
import Options from "./Components/Options"
import NavBar from "./Components/NavBar"
import PrePost from "./Components/PrePost"

var {assignItems} = require('./DataMapping');
var {getOptions} = require('./Logic');
var {getPrePost} = require('./Logic');
const axios = require('axios');

class Refac extends Component {

    constructor(props) {
        super(props);

        this.bodyTemplate = this.props.bodyTemplate ? this.props.bodyTemplate : 'body';
        this.bodyClasses = this.props.bodyClasses ? this.props.bodyClasses : 'body';
        this.bodyWrapper = this.props.bodyWrapper ? this.props.bodyWrapper : 'body-wrapper';
        this.outerOptionsWrapper = this.props.outerOptionsWrapper ? this.props.outerOptionsWrapper : 'list-layout-dis';
        this.optionsType = this.props.optionsType ? this.props.optionsType : 'div';
        this.optionsClasses = this.props.optionsClasses ? this.props.optionsClasses : 'list journey__options row list-layout--4-4-4';
        this.optionClasses = this.props.optionClasses ? this.props.optionClasses : 'journey__option list__item';
        this.optionType = this.props.optionType ? this.props.optionType : 'div';
        this.optionTemplate = this.props.optionTemplate ? this.props.optionTemplate : 'card';
        this.navClasses = this.props.navClasses ? this.props.navClasses : 'btn btn-primary';
        this.demostyle = this.props.demostyle ? this.props.demostyle : 'btn au-btn--secondary';
        this.demo = this.props.demo ? this.props.demo : 0;
        this.dbg = this.props.debug ? this.props.debug : 0;
        this.source = !this.props.source || this.props.source === '/' ? location.protocol + '//' + location.hostname + ':' + location.port + '/' : this.props.source;
        this.baseurl = !this.props.baseurl || this.props.baseurl === '/' ? location.protocol + '//' + location.hostname + '/' : this.props.baseurl;
        this.sourcepath = !this.props.sourcepath || this.props.sourcepath === '/' ? '/' : this.props.sourcepath;

        this.mainElementClasses = this.props.mainElementClasses ? this.props.mainElementClasses : 'journey main';
        this.wrapperElementClasses = this.props.wrapperElementclasses ? this.props.wrapperElementclasses : 'layout layout--content-sidebar';
        this.journeyWrapperClasses = this.props.journeyWrapperClasses ? this.props.journeyWrapperClasses : 'layout__region layout__region--content';
        this.historyWrapperClasses = this.props.historyWrapperClasses ? this.props.historyWrapperClasses : 'layout__region layout__region--sidebar';
        this.spacerWrapperClasses = this.props.spacerWrapperClasses ? this.props.spacerWrapperClasses : 'layout__region layout__region--content';
        this.navWrapperClasses = this.props.navWrapperClasses ? this.props.navWrapperClasses : 'layout__region layout__region--sidebar';
        this.optionsWrapperClasses = this.props.optionsWrapperClasses ? this.props.optionsWrapperClasses : 'btn au-btn--secondary';
        this.optionWrapperClasses = this.props.optionWrapperClasses ? this.props.optionWrapperClasses : 'stack stack--detail card';


        this.state = ({
            root: 0,
            items: {},
            journey: {},
            prepost: {
                pre: {},
                post: {},
            },
            question: {}
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
                let step = localStorage.getItem(this.props.uniqueid + ':step');
                if (!step) {
                    step = 0;
                }
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
                // let step = Object.keys(journey).length - 1;


                var hba = false;
                var hbh = false;

                if (typeof Drupal !== 'undefined' && Drupal && Drupal.jsonTemplate && Drupal.jsonTemplate.render) {
                    hba = 2;
                    hbh = Drupal.jsonTemplate.render;
                } else if (window.hb) {
                    console.log('No external handlebars handler detected. Utilise local handlebar templates.');
                    hba = 1;
                    hbh = window.hb;
                } else {
                    console.log('No handlebar available. Using internal defaults...');
                    hba = 0;
                }

                this.setState({
                    hb: hbh
                })

                this.setState({
                    root: root,
                    items: items,
                    journey: journey,
                    step: step,
                    included: data.included
                }, () => this.action())
            })
            .catch(error => {
                console.log(error);
            })


    }

    componentDidMount() {

        let fetchstring = this.source + '' + this.sourcepath + '/' + this.props.taxonomy + '?include=field_step_attributes,field_step_image&sort=weight';
        this.fetchData(fetchstring)
    }

    readAction = (id, type = null) => {

        //Get current step
        let step = this.state.step;
        let journey = this.state.journey;
        if (type === 'reset') {
            journey = {0: this.state.root}
            step = 0
        } else if (!type) {
            //Add to journey


            //Detect if its a jump
            if (this.state.items[id].jump) {
                console.log(this.state.items[id].jump)
                id = this.state.items[id].jump
                step++;
                journey[step] = id;
            } else {
                step++;
                journey[step] = id;
            }
            //Detect if its a redirect
            if (this.state.items[id].redirect) {
                console.log(this.state.items[id].redirect)
                console.log('Redirecting to ' + this.state.items[id].redirect);
                window.location.href = this.state.items[id].redirect;
            }

            //If the next in line does not belong to the current flow. Clear journey.
            if (journey[step + 1] && this.state.items[journey[step + 1]] && this.state.items[journey[step + 1]].parent) {

                console.log(this.state.items[journey[step + 1]].parent)
                console.log(journey[step])

                if (this.state.items[journey[step + 1]].parent !== journey[step]) {
                    let i = 1;
                    while (journey[step + i]) {
                        delete journey[step + i];
                        i++;
                    }
                }

            }

        } else if (type === 'back') {
            step--;
        } else if (type === 'next') {
            step++;
        } else if (type === 'nav') {
            Object.keys(journey).map(key => {
                if (id === journey[key]) {
                    step = key;
                }
            })
        }

        this.save(journey, step);

        this.setState({
            step: step,
            journey: journey,
        }, () => this.action(id))


    }

    action(id = null) {
        if (!id) {
            id = this.state.journey[this.state.step];
        }

        let options = getOptions(this.state.items, id);
        let question = this.state.items[id];
        let prepost = getPrePost(this.state.items, this.state.journey, id, this.state.step);

        this.setState({
            question: question,
            options: options,
            prepost: prepost,
        });
    }


    save = (journey, step) => {
        localStorage.setItem(this.props.uniqueid + ':journey', JSON.stringify(journey));
        localStorage.setItem(this.props.uniqueid + ':step', step);
    }


    render() {

        let current = this.state.question ? {[this.state.question.id]: this.state.question} : {}

        if (!this.state.question) {
            return <>Loading</>
        }

        console.log('this.mainElementClasses')
        console.log(this.mainElementClasses)

        return (
            <>
                <main role="main" className={this.mainElementClasses}>
                        <div role="row" className={this.wrapperElementClasses}>
                            <div role="journey" className={this.journeyWrapperClasses}>
                                <Question question={this.state.question}
                                          hb={this.state.hb}
                                          bodyClasses={this.bodyClasses}
                                          bodyWrapper={this.bodyWrapper}
                                          bodyTemplate={this.bodyTemplate}
                                />
                                <Options options={this.state.options}
                                         select={this.readAction}
                                         hb={this.state.hb}
                                         optionTemplate={this.optionTemplate}
                                         outerOptionsWrapper={this.outerOptionsWrapper}
                                         optionsType={this.optionsType}
                                         optionsClasses={this.optionsClasses}
                                         optionClasses={this.optionClasses}
                                         optionType={this.optionType}
                                         qTemplate={this.state.question.template}
                                         baseurl={this.baseurl}
                                />
                            </div>
                            <div role="history" className={this.historyWrapperClasses}>
                                <div className={'list-group'}></div>
                                <PrePost
                                    key={this.state.step + 'pre'}
                                    items={this.state.prepost.pre}
                                    select={this.readAction}
                                />
                                <PrePost
                                    key={this.state.step + 'current'}
                                    items={current}
                                    active={true}
                                    select={this.readAction}
                                />
                                <PrePost
                                    key={this.state.step + 'post'}
                                    items={this.state.prepost.post}
                                    select={this.readAction}
                                />
                            </div>
                            <div role="spacer" className={this.spacerWrapperClasses}>
                            </div>
                            <div role="navbar" className={this.navWrapperClasses}>
                                <NavBar
                                    select={this.readAction}
                                    root={this.state.root}
                                    navclasses={this.navClasses}
                                    current={this.state.journey[this.state.step]}
                                    back={this.state.journey[this.state.step - 1]}
                                    next={this.state.journey[this.state.step + 1]}
                                />
                            </div>
                        </div>
                </main>
            </>
        );
    }
}

export default Refac;
