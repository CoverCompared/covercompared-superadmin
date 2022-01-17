import axios from "axios";
import _ from "lodash";
import { API_BASE_URL, FIREBASE_CONFIG } from "../config";
import utils from "../utils";

let BlogService = {};

BlogService.table = async ({ from, to, order_field, order_by, q, ...filter_options }) => {
    
    let query_string = utils.filterToQuery({ from, to, order_field, order_by, q, ...filter_options });
    
    const url = `${API_BASE_URL}/admin/blogs?${query_string}`;
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
    console.log(res);
    return res;
  }

export default BlogService;