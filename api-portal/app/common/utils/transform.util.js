const ST = require('stjs');
const _ = require('lodash');

module.exports = class Transform {
    constructor(template) {
        this.template = template;
        this.emptyTemplate = this.getEmptyTemplate(template);
    }

    transform(data, keys = Object.keys(this.template)) {
        return _.isArray(data) ? data.map((item) => this.convert(item, keys)) : this.convert(data, keys);
    }

    convert(item, keys) {
        const data = _.merge({}, this.emptyTemplate, ST.transform(this.template, item));
        return _.pick(data, keys);
    }

    getEmptyTemplate(template) {
        template = _.isArray(template) ? template[0] : template;
        return _.keys(template).reduce((acc, item) => ({ ...acc, [item]: null }), {});
    }
};
