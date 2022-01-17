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

utils.filterToQuery = ({ from, to, order_field, order_by, q, ...filters }) => {
    let queryParams = {
        range: `[${from},${to}]`
    };

    let filter = {};
    if (q) filter['q'] = q;
    for (const key in filters) {
        if (filters[key]) filter[key] = filters[key];
    }

    if (order_field) queryParams['order_field'] = order_field;
    if (order_by) queryParams['order_by'] = order_by;
    if (Object.keys(filter).length) queryParams['filter'] = JSON.stringify(filter);
    return utils.objToQuery(queryParams)
}

utils.queryToFilter = (query_string) => {
    let obj = {};

    query_string = decodeURIComponent(query_string);
    query_string = query_string.split("?");
    query_string = _.get(query_string, "1", "");
    query_string = query_string.split("&");
    query_string = query_string.map(val => val.split("="));
    let query_obj = {};
    query_string.forEach((val) => {
        query_obj[val[0]] = val[1] ? val[1] : "";
    })



    if (query_obj.range) {
        try {
            let range = JSON.parse(query_obj.range);
            obj.from = range[0];
            obj.to = range[1];
        } catch (error) { }
    }

    if (query_obj.filter) {
        try {
            const search = JSON.parse(query_obj.filter);
            obj = {...obj, ...search };
        } catch (error) { }
    }

    if (query_obj.order_field) obj["order_field"] = query_obj.order_field;
    if (query_obj.order_by) obj["order_by"] = query_obj.order_by;

    return obj;

}

export default utils;