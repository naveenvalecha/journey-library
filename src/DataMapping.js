/**
 *
 * @ToDo: Make more robust, handle missing parameters.
 * @ToDo: Make parameter assignement more generic.
 *
 *
 *
 *
 */



/**
 *
 * Get related field from includes in json.
 *
 *
 * @param type
 * @param uuid
 * @param included
 * @returns {null}
 */
function getRelation(type, uuid, included) {

    let value = null;

    Object.keys(included).map(key => {
        if (included[key].id === uuid) {

            if (included[key].type = "file--file") {
                // console.log('------ Processing file-file ------');
                if (included[key].attributes.uri) {
                    // console.log('------ Got attributes.uri ------');
                    value = included[key].attributes.uri.url;
                } else if (included[key].attributes.field_attribute_key) {
                    // console.log('------ Got attributes.field_attribute_key_value ------');
                    value = {
                        "key": included[key].attributes.field_attribute_key,
                        "value": included[key].attributes.field_attribute_value,
                    }
                    ;
                } else {
                    console.log('------ No mapping defined for this item ------');
                    console.log(included[key].attributes);
                    console.log('----------------------------------------------');
                }
            } else {
                console.log('------ No mapping defined for this type ------');
                console.log(included[key].type);
                console.log('----------------------------------------------');
            }

        }
    });

    return value;
}

/**
 * Genric mapper
 */

function genericJsonapiMapper(relationships, included){

        // console.log(relationships);
         console.log(included);


    Object.keys(relationships).map(key => {
        if(relationships[key].data && relationships[key].data['id']){
            console.log(relationships[key].data['id']);
        }

    });

}


/**
 * Assign items from feed.
 */
function assignItems (data, baseurl) {

    var items = {};
    var root = 0;

    console.log('--- Assigning Data ---');

    Object.keys(data.data).map(key => {

        var setter = null;
        var field_step_image = null;
        var jump = null;
        let body = '';
        let summary = '';
        let redirect = null;
        let trigger = null;

        // genericJsonapiMapper(data.data[key].relationships, data.included);


        if (data.data[key].relationships.field_step_attributes) {
            if (data.data[key].relationships.field_step_attributes.data) {
                if (data.data[key].relationships.field_step_attributes.data[0]) {
                    setter = getRelation('field_step_attributes', data.data[key].relationships.field_step_attributes.data[0].id, data.included);
                }
            }
        }

        if (data.data[key].relationships.field_step_jump) {
            if (data.data[key].relationships.field_step_jump.data) {
                if (data.data[key].relationships.field_step_jump.data.id) {
                    jump = data.data[key].relationships.field_step_jump.data.id;
                }
            }
        }

        if (data.data[key].relationships.field_step_image) {
            if (data.data[key].relationships.field_step_image.data) {
                field_step_image = getRelation('field_step_image', data.data[key].relationships.field_step_image.data.id, data.included);
            }
        }

        if (data.data[key].field_step_attributes) {
            if (data.data[key].field_step_attributes.description) {
                var desc = data.data[key].field_step_attributes.description.value
            } else {
                var desc = '';
            }
        }

        if (data.data[key].attributes.field_step_body) {
            body = data.data[key].attributes.field_step_body.processed;
        }

        if (data.data[key].attributes.field_step_summary) {
            summary = data.data[key].attributes.field_step_summary.processed;
        }


        if (data.data[key].attributes.field_step_redirect) {
            if (data.data[key].attributes.field_step_redirect.uri.startsWith("entity:")) {
                redirect = baseurl + '/' + data.data[key].attributes.field_step_redirect.uri.split(':')[1]
            }
        }

        if (data.data[key].attributes.field_step_trigger) {
            if (data.data[key].attributes.field_step_trigger[0]) {
                trigger = data.data[key].attributes.field_step_trigger[0].uri.split(':')[1];
            }
        }

        //Find classes
        var classes = '';
        Object.keys(data.data[key].attributes).map(k => {

            if(k.includes('classes')){
                if(data.data[key].attributes[k] && data.data[key].attributes[k].length > 0){
                    classes = classes + ' ' +  data.data[key].attributes[k] && data.data[key].attributes[k].join(' ');
                }
            }
        });
        items[data.data[key].id] = {

            //Option values
            'name': data.data[key].attributes.name,
            'field_step_body': body,
            'field_step_image': field_step_image,
            'classes': classes,
            //Body values
            'field_step_summary': summary,
            'id': data.data[key].id,
            'display': data.data[key].attributes.field_display,
            'question': data.data[key].attributes.name,
            'hide_back': data.data[key].attributes.field_step_hide_back_button,
            'hide_reset': data.data[key].attributes.field_step_hide_reset_button,
            'tid': data.data[key].attributes.drupal_internal__tid,
            'jump': jump,
            'setter': setter,
            'description': desc,
            'body': body,
            'redirect': redirect,
            'trigger': trigger,
            'parent': data.data[key].relationships.parent.data[0].id,
            'data': data.data[key]
        }
    });

    return items;
}

module.exports = {
    getRelation: getRelation,
    assignItems: assignItems
}
