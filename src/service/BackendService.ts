import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {BehaviorSubject, map, Observable} from "rxjs";
import {Backend} from "./Backend";
import {
    ConsumerModel,
    LoginResponse,
    MoodModel,
    ProcessedConsumptionModel,
    ThermostatModel,
    UserModel,
    UserPredictionModel
} from "./Model";

function unpack<T>(response: AxiosResponse<T>): T {
    return response.data;
}

class BackendService {
    private readonly accessToken: BehaviorSubject<string | null>;
    private readonly isLoggedInObservable: any;
    private readonly backend: Backend;

    constructor(backend: Backend) {
        this.backend = backend;
        this.accessToken = new BehaviorSubject(localStorage.getItem("token"));
        this.isLoggedInObservable = this.accessToken
            .pipe(map((token) => token != null && token !== ""))

        window.addEventListener('storage', () => {
            const token = localStorage.getItem("token");
            if (token !== this.accessToken.value) {
                this.accessToken.next(token)
            }
        })
    }

    isLoggedIn(): Observable<boolean> {
        return this.isLoggedInObservable
    }

    requestPin(sharedPassword: string, email: string) {
        return this.backend
            .get('/request_pin', {params: {'shared_password': sharedPassword, 'email': email}});
    }

    login(email: string, password: string) {
        return this.backend
            .get<LoginResponse>('/login', {params: {'email': email, 'password': password}})
            .then((response) => {
                const {token} = response.data;
                localStorage.setItem("token", token);
                this.accessToken.next(token)
            });
    }

    logout(): Promise<any> {
        localStorage.removeItem("token");
        return this.backend
            .get('/logout', this.addAuth())
            .finally(() => this.accessToken.next(null))
    }

    getUser(): Promise<UserModel> {
        return this.backend
            .get<UserModel>('/user', this.addAuth())
            .then(unpack);
    }

    getConsumers(): Promise<ConsumerModel[]> {
        return this.backend
            .get<ConsumerModel[]>('/consumer', this.addAuth())
            .then(unpack);
    }

    postConsumer(consumer_name: string) {
        return this.backend
            .post('/consumer', null, this.addAuth({params: {consumer_name: consumer_name}}))
    }

    putConsumer(consumer: ConsumerModel) {
        return this.backend
            .put('/consumer/' + consumer.consumerId, null, this.addAuth({
                params: {
                    consumer_name: consumer.customName,
                    consumer_active: consumer.active
                }
            }))
    }

    removeConsumer(consumerId: String): Promise<AxiosResponse> {
        return this.backend
            .delete('/consumer/' + consumerId, this.addAuth())
    }

    getProcessedConsumptions(): Promise<string[]> {
        return this.backend
            .get<string[]>('/processedconsumption', this.addAuth())
            .then(unpack);
    }

    getProcessedConsumption(date: string): Promise<ProcessedConsumptionModel[]> {
        return this.backend
            .get<ProcessedConsumptionModel[]>('/processedconsumption/' + date, this.addAuth())
            .then(unpack);
    }

    getPredictions(): Promise<string[]> {
        return this.backend
            .get<string[]>('/predictions', this.addAuth())
            .then(unpack);
    }

    getPrediction(date: string): Promise<UserPredictionModel[]> {
        return this.backend
            .get<UserPredictionModel[]>('/predictions/' + date, this.addAuth())
            .then(unpack)
    }

    putPrediction(date: string, predictions: UserPredictionModel[]): Promise<AxiosResponse> {
        return this.backend
            .put('/predictions/' + date, {predictions: predictions}, this.addAuth())
    }

    getThermostats(): Promise<ThermostatModel | null> {
        return this.backend
            .get<ThermostatModel>('/thermostat', this.addAuth())
            .then(unpack)
            .then((data) => {
                if (!data) return data;
                data.simple = data.simple.map(day => day.map(it => ({
                    time: new Date(it.time),
                    temperature: it.temperature
                })));
                data.advanced = data.advanced.map(day => day.map(it => ({
                    time: new Date(it.time),
                    temperature: it.temperature
                })));
                return data;
            })
    }

    putThermostats(data: ThermostatModel) {
        return this.backend
            .put('/thermostat', {data: data}, this.addAuth())
    }

    putMood(date: string, mood: MoodModel): Promise<AxiosResponse> {
        return this.backend
            .put('/mood/' + date, {mood: mood}, this.addAuth())
    }

    getMood(date: string): Promise<MoodModel> {
        return this.backend
            .get('/mood/' + date, this.addAuth())
            .then(unpack)
    }

    postConsumption(file: File) {
        const source = axios.CancelToken.source();
        const formData = new FormData();
        formData.append("upfile", file, file.name)
        return {
            promise: this.backend.post('/consumption', formData, this.addAuth({cancelToken: source.token})),
            cancelToken: source
        }
    }

    postTracking(data: any): Promise<AxiosResponse> {
        return this.backend
            .post("/tracking", JSON.stringify(data), {})
    }

    private addAuth(config?: AxiosRequestConfig): AxiosRequestConfig {
        return {...config, headers: {Authorization: `${this.accessToken.value}`}}
    }
}

export default BackendService;
