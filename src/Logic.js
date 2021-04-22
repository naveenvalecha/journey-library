/**
 *
 * Get options.
 *
 * @param items
 * @param id
 */
function getOptions(items, id) {

    let q = items[id];

    let options = {}

    Object.keys(items).map(key => {
        if (items[key].parent === id) {
            options[key] = items[key]
        }
        // console.log(items[key].parent)
    })

    return options;
}

/**
 *
 * Get items to show before and after in the overview.
 *
 *
 * @param items
 * @param journey
 * @param id
 */
function getPrePost(items, journey, id, step) {

    var pre = {};
    var post = {};

    Object.keys(journey).map(key => {
        if(key < step){
            pre[journey[key]] = items[journey[key]]
        } else if(key > step){
            post[journey[key]] = items[journey[key]]
        }
    });

    return {
        pre: pre,
        post: post
    }

}


module.exports = {
    getOptions: getOptions,
    getPrePost: getPrePost
}
