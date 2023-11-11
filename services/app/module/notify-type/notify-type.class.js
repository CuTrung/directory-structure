const Transform = require('../../common/helpers/transform.helper');
const template = {
    'notify_type_id': '{{#? NOTIFYTYPEID}}',
    'template_title': '{{#? TEMPLATETITLE}}',
    'template_content': '{{#? TEMPLATECONTENT}}',
    'notify_type_name': '{{#? NOTIFYTYPENAME}}',
    'feature_key': '{{#? FEATUREKEY}}',
};

let transform = new Transform(template);

const detail = (notifyType) => {
    return transform.transform(notifyType, [
        'notify_type_id', 'template_title', 'template_content', 'notify_type_name', 'feature_key'
    ]);
};

module.exports = {
    detail
};
