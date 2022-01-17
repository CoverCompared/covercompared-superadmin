import axios from "axios";
import _ from "lodash";
import { API_BASE_URL, FIREBASE_CONFIG } from "../config";
import utils from "../utils";

let PolicyService = {};

PolicyService.table = async ({ from, to, order_field, order_by, q, ...filter_options }) => {

    let query_string = utils.filterToQuery({ from, to, order_field, order_by, q, ...filter_options });
    
    const url = `${API_BASE_URL}/admin/policies?${query_string}`;
    const res = await axios({ url });
    return res;
}

PolicyService.msoPolicies = async ({ from, to, order_field, order_by, q, ...filter_options }) => {

    let query_string = utils.filterToQuery({ from, to, order_field, order_by, q, ...filter_options });
    
    const url = `${API_BASE_URL}/admin/policies-mso?${query_string}`;
    const res = await axios({ url });
    return res;
}

PolicyService.show = async (id) => {
    return axios({ url: `${API_BASE_URL}/admin/policies/${id}` })
}

export default PolicyService;