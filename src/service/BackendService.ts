import {AxiosRequestConfig, AxiosResponse} from 'axios';
import {Backend} from "./Backend";
import {ConsumerModel, LoginResponse, ProcessedConsumptionModel, UserModel, UserPredictionModel} from "./Model";
import {BehaviorSubject, map, Observable} from "rxjs";

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

    isLoggedIn() : Observable<boolean>{
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
        this.accessToken.next(null)
        return this.backend
            .get('/logout', this.addAuth());
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

    putConsumer(consumer: ConsumerModel) {
        return this.backend
            .put('/consumer/' + consumer.consumerId, null, this.addAuth({
                params: {
                    consumer_name: consumer.name,
                    consumer_active: consumer.active
                }
            }))
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

    postConsumption(file: File) {
        const formData = new FormData();
        formData.append("upfile", file, file.name)
        return this.backend
            .post('/consumption', formData, this.addAuth())
    }

    private addAuth(config?: AxiosRequestConfig): AxiosRequestConfig {
        return {...config, headers: {Authorization: `${this.accessToken.value}`}}
    }
}

export default BackendService;
