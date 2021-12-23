import axios from "axios";
import _ from "lodash";
import { API_BASE_URL, FIREBASE_CONFIG } from "../config";
import utils from "../utils";

let PolicyRequestService = {};

PolicyRequestService.table = async ({ from, to, order_field, order_by, q, ...filter_options }) => {
    
    let query_string = utils.filterToQuery({ from, to, order_field, order_by, q, ...filter_options });
    
    const url = `${API_BASE_URL}/admin/policy-requests?${query_string}`;
    const res = await axios({ url });
    return res;
}




export default PolicyRequestService;