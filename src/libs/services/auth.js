import axios from "axios";
import _ from "lodash";
import { API_BASE_URL, FIREBASE_CONFIG } from "../config";
import { initializeApp } from "@firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

var firebaseConfig = FIREBASE_CONFIG;

initializeApp(firebaseConfig);

let auth = {};

auth.login = (email, password) => {
    const fauth = getAuth();

    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(fauth, email, password).then((user) => {
            if (user) {

                fauth.currentUser.getIdToken().then((token) => {
                    axios({
                        url: `${API_BASE_URL}/admin/login`,
                        method: "POST",
                        data: { authToken: token }
                    }).then((data) => {

                        if (_.get(data, "data.success", false)) {
                            let token = _.get(data, "data.data.token", "")
                            localStorage.setItem('token', token);
                            resolve({ status: true, message: "Login successfully." });
                            return;
                        } else {
                            fauth.signOut()
                            reject({ status: false, message: "Incorrect email or password." })
                            return;
                        }

                    }).catch((e) => {
                        reject({ status: false, message: "Incorrect email or password." })
                        fauth.signOut();
                    })

                })
            } else {
                resolve({ status: false, message: "Incorrect Email or Password." });
            }
        }).catch(err => {
            resolve({ status: false, message: "Incorrect Email or Password." });
        });
    });

}

auth.logout = async () => {
    return new Promise((resolve) => {
        const fauth = getAuth();
        fauth.signOut().then(() => {
            resolve(true);
        }).catch(err => {
            resolve(true)
        });
    })
}

auth.profile = async () => {
    const url = `${API_BASE_URL}/admin/profile`;
    const res = await axios({ url });
    return res;
}

auth.user = false;

auth.getProfile = (hard = false) => {
    return new Promise(async (res, rej) => {

        const fauth = getAuth();
        
        await fauth.onAuthStateChanged((user) => {
            if(!user || !localStorage.getItem("token")){
                localStorage.removeItem("token");
                hard = true;
            }

            if (auth.user && !hard) {
                res(auth.user);
            } else if (localStorage.getItem("token") || hard) {
                let userCall = auth.profile();
                userCall.then(
                    (e) => {
                        if (_.get(e, "data.success", false)) {
                            auth.user = _.get(e, "data.data");
                            res(auth.user);
                        } else {
                            auth.user = false;
                            res(false);
                        }
                    }, (er) => {
                        auth.user = false;
                        res(false);
                    }
                );
            } else {
                res(false);
            }
        });

    });
}

export default auth;