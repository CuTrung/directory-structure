const { capitalizeFirstLetter } = require("./string.util")

const TYPES = {
    NUMBER: 'Number',
    STRING: 'String',
    BOOLEAN: 'Boolean',
    OBJECT: 'Object',
    ARRAY: 'Array',
    MAP: 'Map',
    SET: 'Set',
    FUNCTION: 'Function',
    NULL: 'Null',
    UNDEFINED: 'Undefined'
}

const that = module.exports = {
    TYPES,
    isTypeArray: (typeArr, arr) => arr.every(item => that.typeOf(item) === capitalizeFirstLetter(typeArr)),
    currencyVND: (value) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 3 }).format(value),
    typeOf: (value) => Object.prototype.toString.call(value).slice(8, -1),
}