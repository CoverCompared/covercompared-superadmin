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

UtilsService.dashboard = async () => {
    const url = `${API_BASE_URL}/admin/dashboard`;
    const res = await axios({ url });
    return res;
}

export default UtilsService;