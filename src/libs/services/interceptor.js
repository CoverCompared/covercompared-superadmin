import axios from "axios";
import store from "../../redux/store";

export default () => {
    axios.interceptors.request.use((request) => {
        const url = request.url;
        const token = localStorage.getItem("token");
        request.headers["Authorization"] = token;
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