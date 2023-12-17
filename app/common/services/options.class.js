const Transform = require("../utils/transform.util");

const templateOptions = {
  id: "{{#? ID}}",
  name: "{{#? NAME}}",
  parent_id: "{{#? PARENTID}}",
};

const transform = new Transform(templateOptions);
const options = (userGroups = []) => {
  return transform.transform(userGroups);
};

module.exports = {
  options,
};
