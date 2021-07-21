import axios from "axios";
import FakeBackend from "./service/FakeBackend";
import {Backend} from "./service/Backend";

export interface Config {
    backend: Backend,
    type: string,
    apiDescription: string
}

const dev = {
    backend: axios.create({baseURL: process.env.REACT_APP_API_BASE_URL}),
    type: 'development',
    apiDescription: process.env.REACT_APP_API_BASE_URL
}

const prod = {
    backend: axios.create({baseURL: process.env.REACT_APP_API_BASE_URL}),
    type: 'production',
    apiDescription: process.env.REACT_APP_API_BASE_URL
}

const local = {
    backend: new FakeBackend(),
    type: 'local',
    apiDescription: 'fakeApi'
}

let backendConfig;
if (process.env.REACT_APP_STAGE === 'production') {
    backendConfig = prod;
} else if (process.env.REACT_APP_STAGE === 'local') {
    backendConfig = local;
} else {
    backendConfig = dev;
}

const config = {
    ...backendConfig
}
export default config;
