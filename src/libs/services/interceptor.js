import axios from "axios";
import store from "../../redux/store";
import AuthService from "./auth";

export default () => {
    axios.interceptors.request.use((request) => {
        const url = request.url;
        request.headers = AuthService.getHeader();
        return request;
    })

    axios.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        const status = error.response.status;
        if (status === 401) {
            // console.log("Dispatch Profile");
            // store.
            window.location.href = `/superadmin/login`;
        }
        return Promise.reject(error);
    })
    return true;
}