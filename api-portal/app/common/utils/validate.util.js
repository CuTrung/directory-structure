const Joi = require('joi');
const { isTypeOf, TYPES } = require('./common.util');

const schemaInit = (schemaInstance, options = {}) => {
    for (const [rule, value] of global.Object.entries(options)) {
        if (isTypeOf(value, TYPES.ARRAY) && value.length === 0) continue;
        if (rule === 'required' && !value) continue;
        schemaInstance = schemaInstance[rule](value);
    }
    return schemaInstance;
};

const String = ({ valid = [], required = false } = {}) => {
    return schemaInit(Joi.string(), { valid, required });
};

const Number = ({ valid = [], required = false, min = 0, max = 1 } = {}) => {
    return schemaInit(Joi.number(), { valid, required, min, max });
};

const Array = (rulesSchema = [], { required = false } = {}) => {
    let arraySchema = Joi.array().items(rulesSchema);
    if (required) {
        arraySchema = arraySchema.required();
    }
    return arraySchema;
};

const Object = (objSchema = []) => {
    return Joi.object(objSchema);
};

module.exports = { String, Number, Array, Object };
