const Transform = require('../helpers/transform.helper');

const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'parent_id':'{{#? PARENTID}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name','parent_id']);
};

module.exports = {
  options,
};
