/**
 * Copyright Morpht Pty Ltd 2020
 */


/**
 *
 * Get related field from includes in json.
 *
 *
 * @param type
 * @param uuid
 * @param included
 * @returns Object
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
                    };
                } else if (included[key].attributes.parent_field_name && included[key].attributes.parent_field_name === "field_question") {
                    // console.log('------ Got attributes.parent_field_name ------');
                    value = {
                        "label": included[key].attributes.field_label,
                        "type": included[key].attributes.field_type,
                        "options": included[key].attributes.field_options,
                    };
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
 * Assign items from feed.
 */
function assignItems(data, baseurl) {

    var items = {};
    var root = 0;

    // console.log('--- Assigning Data ---');

    Object.keys(data.data).map(key => {

        var setter = [];
        var field_step_image = null;
        var jump = null;
        let body = '';
        let summary = '';
        let redirect = null;
        let trigger = null;
        let question = null;

        // genericJsonapiMapper(data.data[key].relationships, data.included);


        if (data.data[key].relationships.field_step_attributes) {
            if (data.data[key].relationships.field_step_attributes.data) {
                if (data.data[key].relationships.field_step_attributes.data[0]) {
                    setter.push(getRelation('field_step_attributes', data.data[key].relationships.field_step_attributes.data[0].id, data.included));

                    // field_step_custom_setter
                }
            }
        }

        if (data.data[key].attributes.field_step_custom_setter) {
            if (data.data[key].attributes.field_step_custom_setter.length) {
                data.data[key].attributes.field_step_custom_setter.map(setterkey => {
                    // console.log(data.data[key].attributes.field_step_custom_setter[setterkey]);
                    let keyset = setterkey.split(':');

                    setter.push({"key": keyset[0], "value": keyset[1]});
                })


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

        if (data.data[key].relationships.field_question && data.data[key].relationships.field_question.data !== null) {

            question = getRelation('field_question', data.data[key].relationships.field_question.data.id, data.included);

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
            } else {
                redirect = data.data[key].attributes.field_step_redirect.uri
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

            if (k.includes('classes')) {
                if (data.data[key].attributes[k] && data.data[key].attributes[k].length > 0) {
                    // console.log(data.data[key].attributes[k] && data.data[key].attributes[k]);
                    classes = classes + ' ' + data.data[key].attributes[k] && data.data[key].attributes[k];
                }
            }
        });

        let name = data.data[key].attributes.name;
        // console.log(data.data[key]);
        if(data.data[key].attributes.field_step_option_name){
            name = data.data[key].attributes.field_step_option_name;
        }


        items[data.data[key].id] = {
            //Option values
            'option': name,
            'name': name,
            'field_step_body': body,
            'field_step_image': field_step_image,
            'classes': classes,
            //Body values
            'field_step_summary': summary,
            'id': data.data[key].id,
            'display': data.data[key].attributes.field_display,
            'question': name,
            'hide_back': data.data[key].attributes.field_step_hide_back_button,
            'hide_reset': data.data[key].attributes.field_step_hide_reset_button,
            'tid': data.data[key].attributes.drupal_internal__tid,
            'jump': jump,
            'setter': setter,
            'description': desc,
            'body': body,
            'redirect': redirect,
            'weight': data.data[key].attributes.weight,
            'trigger': trigger,
            'template': data.data[key].attributes.field_step_template,
            'custquestion': question,
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
