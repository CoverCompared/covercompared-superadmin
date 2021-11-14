function reallyEmptyTrimmed(value) {
    if (!value && [false, 0].indexOf(value) < 0) {
        return true;
    }

    return !value.toString().trim();
};

const validator = {};
validator.required = (value) => {
    if (reallyEmptyTrimmed(value)) {
        return false;
    }
    return true;
};
validator.requiredMessage = (attribute) => `The ${attribute} field is mandatory.`


/**
 * 
 * @param {Object} values 
 * @param {Object} fieldRules 
 * @param {Object} options
 * @param {"Array"|"String"} options.messageType
 * @returns 
 */
validator.validate = (values, fieldRules, options = {}) => {
    let result = {};
    let messages = [];
    for (const field in fieldRules) {
        messages = [];

        for (const rule in fieldRules[field]) {
            console.log(validator[fieldRules[field][rule]](values[field]), values[field]);
            if (!validator[fieldRules[field][rule]](values[field])) {
                messages.push(validator[`${fieldRules[field][rule]}Message`](field))
            }
        }

        if (messages.length) { result[field] = (options.messageType && options.messageType === "String") ? messages[0] : messages; }
    }

    if (Object.keys(result).length) {
        return result;
    } else {
        return true;
    }
}

export default validator;

