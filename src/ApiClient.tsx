import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

const BASE_URI = 'https://it035137.uni-graz.at:443/v2/';

const client = axios.create({baseURL: BASE_URI});

interface LoginResponse {
    token: string;
}

export interface UserModel {
    userId: string;
    email: string;
    type: string;
    creationDate: string;
    unlockDate: string;
    treatmentGroup: string;
}

export interface ConsumerModel {
    consumerId: string;
    owner: string;
    name: string;
    variableName: string;
    active: boolean;
}

export interface UserPredictionModel {
    consumerId: string;
    data: boolean[];
}

export interface ProcessedConsumptionModel {
    type: string;
    data: number[];
}


class ApiClient {
    private accessToken: string;
    private email: string;
    isLoggedIn: boolean;

    constructor() {
        this.accessToken = localStorage.getItem("token") || "";
        this.email = localStorage.getItem("email") || "";
        this.isLoggedIn = this.accessToken !== "";
    }

    async requestPin(sharedPassword: string, email: string) {
        localStorage.setItem("email", email);
        return this.get('/request_pin', {params: {'shared_password': sharedPassword, 'email': email}}).then(() => {
            localStorage.setItem("email", email);
        });
    }

    async login(password: string) {
        const email = localStorage.getItem("email");
        return this.get<LoginResponse>('/login', {params: {'email': email, 'password': password}}).then((response) => {
            localStorage.removeItem("email");
            const token = response.data.token;
            this.accessToken = token;
            localStorage.setItem("token", token);
        });
    }

    async logout() {
        localStorage.removeItem("token");
        return this.perform('/logout');
        //axios.get()
    }

    async getUser(): Promise<UserModel> {
        return this.get<UserModel>('/user').then((response) => {
            return response.data
        });
    }

    async getConsumers(): Promise<ConsumerModel[]> {
        return this.get<ConsumerModel[]>('/consumer').then((response) => {
            return response.data;
        });
    }

    async putConsumer(consumer: ConsumerModel) {
        return this.put('/consumer/' + consumer.consumerId, null, {
            params: {
                consumer_name: consumer.name,
                consumer_active: consumer.active
            }
        })
    }

    async getProcessedConsumptions(): Promise<string[]> {
        return this.get<string[]>('/processedconsumption').then((response) => {
            return response.data;
        });
    }

    async getProcessedConsumption(date: string): Promise<ProcessedConsumptionModel[]> {
        return this.get<ProcessedConsumptionModel[]>('/processedconsumption/' + date).then((response) => {
            return response.data;
        });
    }

    async getPredictions(): Promise<string[]> {
        return this.get<string[]>('/predictions').then((response) => {
            return response.data;
        });
    }

    async getPrediction(date: string): Promise<UserPredictionModel[]> {
        return this.get<UserPredictionModel[]>('/predictions/' + date).then((response) => {
            return response.data;
        })
    }

    async postConsumption(file: File) {
        const formData = new FormData();
        formData.append("upfile", file, file.name)
        return this.post('/consumption', formData)
    }

    private async get<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return client.get(url, {...config, headers: {Authorization: `${this.accessToken}`}})
    }

    private async post<T, R = AxiosResponse<T>>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<R> {
        return client.post(url, formData, {...config, headers: {Authorization: `${this.accessToken}`}})
    }

    private async put<T, R = AxiosResponse<T>>(url: string, data: any, config?: AxiosRequestConfig): Promise<R> {
        return client.put(url, data, {...config, headers: {Authorization: `${this.accessToken}`}})
    }

    private async perform<T = any>(url?: string, params?: any) {
        return client({
            method: 'get',
            url: url,
            params: params,
            headers: {
                Authorization: `${this.accessToken}`
            },
            responseType: 'json'
        }).then(resp => {
            return resp.data ? resp.data : [];
        })
    }
}

export const apiClient = new ApiClient();
export default ApiClient;