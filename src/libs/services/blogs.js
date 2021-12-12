import axios from "axios";
import _ from "lodash";
import { API_BASE_URL, FIREBASE_CONFIG } from "../config";
import utils from "../utils";

let BlogService = {};

BlogService.table = async ({ from, to, order_field, order_by, q }) => {
    let queryParams = {
        range: `[${from},${to}]`
    };

    let filter = {};
    if (q) filter['q'] = q;

    if (order_field) queryParams['order_field'] = order_field;
    if (order_by) queryParams['order_by'] = order_by;
    if (q) queryParams['q'] = q;
    
    if (Object.keys(filter).length) queryParams['filter'] = JSON.stringify(filter);
    
    
    const url = `${API_BASE_URL}/admin/blogs?${utils.objToQuery(queryParams)}`;
    const res = await axios({ url });
    console.log(res);
    return res;
}


BlogService.add = async (data) => {
    return axios({
        url: `${API_BASE_URL}/admin/blogs`,
        method: "POST", data,
        headers: { 'content-type': 'multipart/form-data' }
    })
}

 
BlogService.show = async (id) => {
    return axios({ url: `${API_BASE_URL}/admin/blogs/${id}` })
}

BlogService.delete = async (id) => {
    const url = `${API_BASE_URL}/admin/blogs/${id}`;
    const res = await axios({ url, method : "DELETE" });
    return res;
}



BlogService.update = async (id , data) => {
    const url = `${API_BASE_URL}/admin/blogs/${id}`;
    const res = await axios({
      url,
      method: "PUT",
      headers: { 'content-type': 'multipart/form-data' },
      data
    });
    return res;
  }

export default BlogService;