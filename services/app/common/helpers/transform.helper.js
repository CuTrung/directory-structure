const ST = require('stjs');
const _ = require('lodash');

module.exports = class Transform {
    constructor(template) {
        this.template = template;
        this.emptyTemplate = this.getEmptyTemplate(template);
    }

    transform(data, keys) {
        if (_.isArray(data)) {
            const result = [];
            data.forEach((item) => {
                result.push(this.convert(item, keys));
            });
            return result;
        } else {
            return this.convert(data, keys);
        }
    }

    convert(item, keys) {
        let data = ST.transform(this.template, item);
        data = _.merge({}, this.emptyTemplate, data);
        return _.pick(data, keys);
    }

    getEmptyTemplate(template) {
        // If template is array, get first element
        if (_.isArray(template)) {
            template = template[0];
        }

        let emptyTemplate = {};
        const keys = _.keys(template);

        keys.forEach((item) => {
            emptyTemplate[item] = null;
        });

        return emptyTemplate;
    }
};

