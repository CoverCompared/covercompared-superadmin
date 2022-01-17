import _ from "lodash";
import v from "validator";

function reallyEmptyTrimmed(value) {
    if (!value && [false, 0].indexOf(value) < 0) {
        return true;
    }

    return !value.toString().trim();
};

const validator = {};
validator.required = (values, field, args) => {
    if (!values[field] || reallyEmptyTrimmed(values[field])) {
        return false;
    }
    return true;
};
validator.requiredMessage = (attribute) => `The ${_.lowerCase(attribute)} field is mandatory.`

validator.same = (values, field, args) => {
    if(values[field] && values[args[0]] && values[field] == values[args[0]]){
        return true
    }
    return false;
};
validator.sameMessage = (attribute, args) => `The ${_.lowerCase(attribute)} and ${_.lowerCase(args[0])} must match.`

validator.minLength = (values, field, args) => {
    if(values[field] && values[field].length >= args[0]){
        return true
    }
    return false;
};
validator.minLengthMessage = (attribute, args) => `The ${_.lowerCase(attribute)} can not be less than ${_.lowerCase(args[0])}.`

validator.email = (values, field, args) => {
    if(values[field] && v.isEmail(values[field])){
        return true
    }
    return false;
};
validator.emailMessage = (attribute, args) => `The ${_.lowerCase(attribute)} must be a valid email address.`


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
    let ruleName, args, value, ruleSplit;
    for (const field in fieldRules) {
        messages = [];
        ruleName = "";
        args = [];
        value = values[field];
        ruleSplit = [];
        for (const rule in fieldRules[field]) {
            ruleSplit = fieldRules[field][rule].split(":");
            ruleName = ruleSplit[0];
            args = ruleSplit.length > 1 ? ruleSplit[1].split(",") : [];
            if (!validator[ruleName](values, field, args)) {
                messages.push(validator[`${ruleName}Message`](field, args))
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

