import moment from "moment";
import _ from "lodash";

const utils = {};

utils.getFormattedDate = (timestamp) => {
    try {
        let time = moment(timestamp).format('LL')
        return time;
    } catch (error) {
        return "-";
    }
}

utils.getFormattedDateTime = (timestamp) => {
    try {
        let time = moment(timestamp).format('LLL')
        return time;
    } catch (error) {
        return "-";
    }
}

utils.getFormattedAmount = (amount) => {
    amount = parseFloat(amount).toFixed(3);
    amount = amount === "NaN" ? "0.000" : amount
    amount = amount.split(".");
    amount[0] = parseInt(amount[0]).toLocaleString()
    return amount.join(".");
}

utils.getTomorrowDate = () => {
    let a = new Date();
    a.setDate(a.getDate() + 1)
    return a;
}


/**
 * This function will convert json object to query string
 * @param {object} obj 
 */
utils.objToQuery = (obj = {}) => {
    let query = [];
    for (const key in obj) {
        query.push(`${key}=${obj[key]}`)
    }
    return query.join("&");
}

utils.random = (n) => {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for (var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

/**
 * If you pass "1" => "001"
 * @param {Number} number 
 * @returns 
 */
utils.getPadNumber = (number) => {
    return `${_.padStart((number), 3, '0')}`
}

utils.getFormValues = (form) => {
    let values = {};

    for (const field in form) {
        values[field] = form[field].value;
    }

    return values;
}

utils.getFormRules = (form) => {
    let rules = {};

    for (const field in form) {
        if (form[field].rules && form[field].rules.length) {
            rules[field] = form[field].rules;
        }
    }

    return rules;
}

utils.formTouchAllField = (form) => {
    for (const field in form) {
        form[field].isTouched = true;
    }
    return form;
}

utils.convertPaginationResponse = (response) => {
    let range = {
        from: _.get(response.data.data.range.split("/"), "0", 0).split("-")[0],
        to: _.get(response.data.data.range.split("/"), "0", 0).split("-")[1],
        total: _.get(response.data.data.range.split("/"), "1", 0)
    };

    return {
        total_records: range.total,
        current_page: (range.to / (range.to - range.from)) - 1,
        rows_per_page: (range.to - range.from),
        rows: response.data.data.data
    };
}

export default utils;