import axios from "axios";
import { API_BASE_URL } from "../config";
import _ from "lodash";

let UtilsService = {};


UtilsService.constants = false;

UtilsService.getConstant = (hard = false) => {
    return new Promise(async (resolve, reject) => {

        if (UtilsService.constants && !hard) {
            return resolve(UtilsService.constants);
        } else {
            const url = `${API_BASE_URL}/admin/constants`;

            axios({ url }).then(
                (e) => {
                    if (_.get(e, "data.success", false)) {
                        UtilsService.constants = _.get(e, "data.data");
                        resolve(UtilsService.constants);
                    } else {
                        UtilsService.constants = false;
                        resolve(false);
                    }
                }, (er) => {
                    UtilsService.constants = false;
                    resolve(false);
                }
            );
        }

    });
}

/**
 * 
 * @param {string} url 
 * @param {Object} queryParams 
 * @returns 
 */
 UtilsService.addQueryParams = (url, queryParams) => {
    queryParams = _.map(queryParams, (value, key) => {
        return `${key}=${value}`;
    })
    queryParams = Object.values(queryParams).join("&")

    return `${url}?${queryParams}`;
}

UtilsService.dashboard = async (queryParams = {}) => {
    const url = UtilsService.addQueryParams(`${API_BASE_URL}/admin/dashboard`, queryParams);
    const res = await axios({ url });
    return res;
}

export default UtilsService;