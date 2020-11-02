window.unsplash = {

    random: function (type) {

        var pictures = {
            'winter': [
                '-X5FNFdq7Uw',
                '_8W52TK8Pmo',
                '8fuV1f-gZ5I',
                'q-n2vlGIfWc',
                'z4CAuzwaXrM',
                'HV_AJqzV0EQ',
                '_zf0HlWDAz0',
                'ZzpwBhVXVas',
                'dX9X0KTT42g',
                'vA1YsHDYs1Y'],
            'cars': [
                'hdMSxGizchk',
                'GRV4ypBKgxE',
                'xpcUYaZtplI',
                'zu95jkyrGtw',
                'JtP_Dqtz6D8',
                'thtUUYPdxWY',
                'LX0pplSjE2g',
                'G15HRVNAkMQ',
                'drw6RtOKDiA',
                '4WBvCqeMaDE'],
            'business': [
                'eIkbSc3SDtI',
                '2LJ4rqK2qfU',
                'hpjSkU2UYSU',
                '-1_RZL8BGBM',
                'aJTiW00qqtI',
                'Xaanw0s0pMk',
                'qfp4-Ud6Fyg',
                'Ylk5n_nd9dA',
                'tZc3vjPCk-Q',
                'unRkg2jH1j0'],
        }

        pictures[type] ? type = type : type = 'winter';

        return 'https://source.unsplash.com/' + pictures[type][Math.floor(Math.random() * 10)] + '/600x400';
    }
}

window.lipsum = {

    one: function () {
        let lipsum = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ista vestra: Si gravis, brevis; Bonum integritas corporis: misera debilitas',
            'Quae diligentissime contra Aristonem dicuntur a Chryippo. Bestiarum vero nullum iudicium puto.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Quis non odit sordidos, vanos, leves, futtiles',
            'Id est enim, de quo quaerimus',
            'Dici enim nihil potest verius',
            'A mene tu',
            'Lorem ipsum dolor sit amet',
            'Qui est in parvis malis',
            'Equidem, sed audistine modo de Carneade'];

        return lipsum[Math.floor(Math.random() * 10)];
    }

}


window.hb = {

    rhb: function (templateid) {

        let template = `<h3>{{data.data.attributes.name}}</h3>`

        switch (templateid) {
            case 'card':
                template = `
<div class="au-card au-body au-card--shadow au-card--clickable stack stack--detail">
    <div class="layout__region layout__region--image stack__image image--decorative">
        <div
            class="block block--entity-field-node-thumbnail block--layout-builder block--field-blocknodegovcms-blog-articlefield-thumbnail">
            <div class="content">
                <div
                    class="field field--name-field-thumbnail field--type-entity-reference field--label-hidden field__item">
                    <article
                        class="contextual-region media-entity media-entity--type-image media-entity--view-mode-landscape">
                        <div
                            class="field button field--type-image field--label-hidden field__item">
                            <img
                                src="{{ img }}"
                                alt="" typeof="foaf:Image">
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </div>
    <div class="stack__content">
        <h3 class="layout__region layout__region--title stack__title">
            <div
                class="block block--entity-field-node-title block--layout-builder block--field-blocknodegovcms-blog-articletitle">
                <div class="content">
                    <h2>{{data.option}}</h2>
                </div>
            </div>
        </h3>
        <div class="layout__region layout__region--summary stack__summary">
            <div
                class="block block--entity-field-node-body block--layout-builder block--field-blocknodegovcms-blog-articlebody">
                <div class="content">
                    <div
                        class="field field--name-body field--type-text-with-summary field--label-hidden field__item">
                        {{{base.data.field_step_summary}}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`
                break;
            case "button":
                template = `<div class="button btn au-btn--secondary">{{data.option}}</div>`
                break;
            case "title":
                template = `<div class="title">
                                <h3 class="layout__region layout__region--title title__title">
                                    <div class="block block--entity-field-node-title block--layout-builder block--field-blocknodegovcms-standard-pagetitle">
                                        <div class="content">
                                            <a hreflang="en">{{data.option}}</a>
                                        </div>
                                    </div>
                                </h3>
                            </div>`
                break;
            case "bodytitle":
                template = `<div class="title">
                                <h3 class="layout__region layout__region--title title__title">
                                    <div class="block block--entity-field-node-title block--layout-builder block--field-blocknodegovcms-standard-pagetitle">
                                        <div class="content">
                                            {{{data.data.attributes.field_step_body.value}}}
                                        </div>
                                    </div>
                                </h3>
                            </div>`
                break;
            case "body":
                template = "<p>{{{data.data.attributes.field_step_body.value}}}</p>"
                break;
            case 'simple':
                template = "<div>{{data.option}}</div>"
                break;
            case 'fancybody':
                template = `<div class="fancybody">{{{data.data.attributes.field_step_body.value}}}</div>`
                break;
            case 'fancycard':
                template =
                    `<div class="fancycard" style="background-image: url({{ img }})">
                        <div class="card-content">
                            <h2 class="title">{{data.data.attributes.name}}</h2>
                            <p class="copy">{{{summary}}}</p>
                        </div>
                    </div>`
                break;
        }

        return Handlebars.compile(template);
    }
}

// https://source.unsplash.com/collection/3178572/400x600
