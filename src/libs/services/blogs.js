import axios from "axios";
import _ from "lodash";
import { API_BASE_URL, FIREBASE_CONFIG } from "../config";
import utils from "../utils";

let BlogService = {};

BlogService.table = async ({ from, to, order_field, order_by, q }) => {
    let queryParams = {
        range: `[${from},${to}]`
    };

    if (order_field) queryParams['order_field'] = order_field;
    if (order_by) queryParams['order_by'] = order_by;
    if (q) queryParams['q'] = q;
    
    const url = `${API_BASE_URL}/admin/blogs?${utils.objToQuery(queryParams)}`;
    const res = await axios({ url });
    return res;
}

BlogService.add = async (bodyFormData ,config) => {
    console.log(bodyFormData);
    return axios({
        url: `${API_BASE_URL}/admin/blogs`,
        method: "POST",
        data:bodyFormData,
        config
    })
}
export default BlogService;