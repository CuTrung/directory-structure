const validateRequest = (objRule, data) => {
    let messagesError = [];

    for (const [field, rules] of Object.entries(objRule)) {
        if (isObject(rules)) {
            const strObjNested = convertObjectToStringNested(rules, field);
            for (const [fieldObj, rulesObj] of Object.entries(strObjNested)) {
                const result = getValueNested(data, fieldObj);
                messagesError = isValidData({ [fieldObj]: rulesObj }, result);
                if (messagesError.length > 0) return messagesError;
            }
        } else if (Array.isArray(rules)) {
            for (let index = 0; index < rules.length; index++) {
                messagesError = validateRequest(rules[index], data[field][index]);
            }
        } else {
            messagesError = isValidData({ [field]: rules }, data[field]);
        }

        if (messagesError.length > 0) return messagesError;
    }

    return messagesError;
}

const isTypeArray = (typeArr, arr) => arr.every(item => typeof item === typeArr);

const isValidValue = (condition, value) => {
    let rule = Object.values(condition)[0];
    let typeArray = "";
    if (rule.includes('array')) {
        typeArray = rule.split("-")[1];
    }
    const field = Object.keys(condition)[0];

    let messageError = "";
    let valuesEqual;
    let conditionTypeArray;
    if ((rule.includes("string") || rule.includes("number"))) {
        const conditions = rule.includes("(") ? rule.slice(rule.indexOf("(") + 1, rule.lastIndexOf(")")).split("-") : [];
        if (conditions.length !== 0) {
            rule = rule.split(":")[0];
            conditionTypeArray = typeArray;
            typeArray = typeArray.split(":")[0];
        }
        if (conditions.length === 1) {
            const isMin = conditions[0].includes("min") ? 'min' : 'max';
            valuesEqual = {
                [isMin]: conditions[0].split(":")[1]
            }
        }
        if (conditions.length === 2) {
            const min = conditions[0].split(":")[1];
            const max = conditions[1].split(":")[1];
            if (min > max) {
                return messageError = `min = ${min} > max = ${max}`;
            }
            if (conditions[0].includes("max"))
                conditions.reverse();
            valuesEqual = { min, max }
        }
    }

    switch (rule) {
        case 'required':
            messageError = value ? "" : `${field} is required`
            if (Array.isArray(value)) {
                messageError = value.length > 0 ? "" : `${field} is required`;
            }
            return messageError;
        case 'number':
            if (!isNumeric(value)) return messageError = `${field} is not a numeric`;

            if (valuesEqual) {
                if ('min' in valuesEqual && 'max' in valuesEqual) {
                    messageError = value >= valuesEqual['min'] && value <= valuesEqual['max'] ? "" : `${field} must be between ${valuesEqual['min']} and ${valuesEqual['max']}`;
                } else {
                    if ('min' in valuesEqual) {
                        messageError = value >= valuesEqual['min'] ? "" : `${field} must be >= ${valuesEqual['min']}`
                    } else {
                        messageError = value <= valuesEqual['max'] ? "" : `${field} must be <= ${valuesEqual['max']}`
                    }
                }
            }
            return messageError;
        case 'string':
            if (typeof value !== "string") return messageError = `${field} is not a string`;
            if (valuesEqual) {
                if ('min' in valuesEqual && 'max' in valuesEqual) {
                    messageError = value.length >= valuesEqual['min'] && value.length <= valuesEqual['max'] ? "" : `${field} must be between ${valuesEqual['min']} and ${valuesEqual['max']} chars`;
                } else {
                    if ('min' in valuesEqual) {
                        messageError = value.length >= valuesEqual['min'] ? "" : `${field} must be >= ${valuesEqual['min']} chars`
                    } else {
                        messageError = value.length <= valuesEqual['max'] ? "" : `${field} must be <= ${valuesEqual['max']} chars`
                    }
                }
            }
            return messageError;
        case 'boolean':
            return typeof value === 'boolean' ? "" : `${field} is not a boolean`;
        case `array-${typeArray}`:
            messageError = isTypeArray(typeArray, value) ? "" : `${field} is not a ${typeArray}s array`

            if (valuesEqual && !messageError) {
                for (const item of value) {
                    messageError = isValidValue({ value: conditionTypeArray }, item)
                    if (messageError) break;
                }
            }

            return messageError;
        default:
            messageError = `Not found ${rule}`;
            return messageError;
    }
}

const isValidData = (condition, data) => {
    const messagesError = [];
    let rulesStr = Object.values(condition)[0];
    if (
        (!rulesStr.includes("required") && rulesStr.includes(typeof data)) ||
        (!rulesStr.includes("required") && rulesStr.includes('array'))
    )
        return messagesError;
    let rules;
    const field = Object.keys(condition)[0];
    const isRuleArray = rulesStr.includes("array");
    if (isRuleArray) {
        if (rulesStr.includes("required")) {
            const messageError = isValidValue({ [field]: "required" }, data);
            if (messageError) return [...messagesError, messageError];
        }
        rulesStr = rulesStr.slice(rulesStr.indexOf("(") + 1, rulesStr.lastIndexOf(")"));
    }
    rules = rulesStr.split("|");
    for (const rule of rules) {
        if (isRuleArray) {
            const messageError = isValidValue({ [field]: `array-${rule}` }, data);

            if (rule === 'required') {
                if (!messageError) continue;
                return [...messagesError, messageError];
            }

            messagesError.push(messageError);
            if (messagesError.includes("")) {
                messagesError.length = 0;
                return messagesError;
            }
        } else {
            const messageError = isValidValue({ [field]: rule }, data);
            if (rule === 'required') {
                if (!messageError) continue;
                return [...messagesError, messageError];
            }

            messagesError.push(messageError);
            if (messagesError.includes("")) {
                messagesError.length = 0;
                return messagesError;
            }
        }
    }

    return messagesError;
}


function isNumeric(value) {
    if (typeof value === 'string') return !isNaN(value % 1);
    return typeof value === 'number';
}

const isObject = (value) => {
    return typeof value === 'object' && !Array.isArray(value) &&
        value !== null;
}

const getValueNested = (obj, keyNested) => {
    keyNested = keyNested.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    keyNested = keyNested.replace(/^\./, '');           // strip a leading dot
    var a = keyNested.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in obj) {
            obj = obj[k];
        } else {
            return;
        }
    }
    return obj;
}

function getValueLastNested(obj) {
    if (typeof obj !== 'object') {
        return obj;
    }
    for (prop in obj) {
        return getValueLastNested(obj[prop])
    }
}

const convertObjectToStringNested = (obj, name) => {
    let outputObj = {};
    let recursive = (obj, name) => {
        for (let key in obj) {
            if (typeof obj[key] == 'object') {
                recursive(obj[key], name + '.' + key)
            } else {
                outputObj[name + '.' + key] = obj[key];
            }
        }
    }
    recursive(obj, name)
    return outputObj;
}



const messageErrors = validateRequest({
    // name: 'required|string:(min:3)|number:(max:4)',
    // student: {
    //     info: {
    //         age: 'required|number:(max:4)'
    //     },
    //     name: 'required|string:(min:2)'
    // },

    // listName: 'array:(string|number)',
    // listName: 'array:(number:(min:3)|string)',
    // info: {
    //     student: 'required|array:(string|number:(min:3))'
    // }

    // listOther: [
    //     {
    //         name: 'string',
    //         age: 'required|number:(max:4)'
    //     },
    // ],
}, {
    // name: 'trung',
    // student: {
    //     info: {
    //         age: 2
    //     },
    //     name: 'trung'
    // },
    // listName: [],
    // info: {
    //     student: [null, 7, 3]
    // },
    // listOther: [
    //     {
    //         name: undefined,
    //         age: 4
    //     },
    // ],
});


