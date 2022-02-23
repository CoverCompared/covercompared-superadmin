let env;
let baseURL;
let previewURL;
let firebaseConfig;
const productionHostname = 'covercompared.com';
const stagingHostname = 'staging-covercompared.polkacover.com';

if (window.location.hostname === productionHostname) {
  env = 'production';
  baseURL = 'https://covercompared.com/api';
  previewURL = 'https://covercompared.com';
} else if (window.location.hostname === stagingHostname) {
  env = 'staging';
  baseURL = 'https://staging-covercompared.polkacover.com/api';
  previewURL = 'https://staging-covercompared.polkacover.com';
} else {
  env = 'local';
  baseURL = 'http://localhost:3006/api';
  previewURL = 'http://localhost:3006';
  // baseURL = 'https://staging-covercompared.polkacover.com/api';
}

if (env === "local") {
  firebaseConfig = {
    apiKey: "AIzaSyB0Eg0ZzCgL0OXI-_67l-vlRgPOrp-thHo",
    authDomain: "cover-compared-local.firebaseapp.com",
    projectId: "cover-compared-local",
    storageBucket: "cover-compared-local.appspot.com",
    messagingSenderId: "839819959843",
    appId: "1:839819959843:web:59b38d88a9bbe98cf9db96"
  }
} else {
  firebaseConfig = {
    apiKey: "AIzaSyChMVCulzgEG9LK-8rGPFzlMIfS2vnTxn0",
    authDomain: "cover-compared.firebaseapp.com",
    projectId: "cover-compared",
    storageBucket: "cover-compared.appspot.com",
    messagingSenderId: "1079932890735",
    appId: "1:1079932890735:web:3b6ebc62d0f258bf42a79a"
  }
}

export const ENV = env;
export const API_BASE_URL = baseURL;
export const BASE_URL = previewURL;
export const FIREBASE_CONFIG = firebaseConfig;
