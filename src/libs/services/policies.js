import axios from "axios";
import _ from "lodash";
import { API_BASE_URL, FIREBASE_CONFIG } from "../config";
import utils from "../utils";

let PolicyService = {};

PolicyService.table = async ({ from, to, status, product_type, order_field, order_by, q }) => {
    let queryParams = {
        range: `[${from},${to}]`
    };

    let filter = {};
    if (status) filter['status'] = status;
    if (product_type) filter['product_type'] = product_type;
    if (q) filter['q'] = q;

    if (order_field) queryParams['order_field'] = order_field;
    if (order_by) queryParams['order_by'] = order_by;
    if (Object.keys(filter).length) queryParams['filter'] = JSON.stringify(filter);
    
    const url = `${API_BASE_URL}/admin/policies?${utils.objToQuery(queryParams)}`;
    const res = await axios({ url });
    return res;
}

PolicyService.show = async (id) => {
    return axios({ url: `${API_BASE_URL}/admin/policies/${id}` })
}

export default PolicyService;