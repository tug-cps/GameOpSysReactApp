import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {BehaviorSubject, map, Observable} from "rxjs";
import {Backend} from "./Backend";
import {
    ConsumerModel,
    LoginResponse,
    PredictionDateEntry,
    PredictionModel,
    TaskModel,
    UserModel,
    WellBeingModel
} from "./Model";

function unpack<T>(response: AxiosResponse<{ data: T }>): T {
    return response.data.data;
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
            if (token !== this.accessToken.value) this.accessToken.next(token)
        })
    }

    isLoggedIn(): Observable<boolean> {
        return this.isLoggedInObservable;
    }

    requestPin(personalCode: string, email: string) {
        return this.backend
            .get('/request-pin', {params: {'code': personalCode, 'email': email}});
    }

    login(email: string, otp: string) {
        return this.backend
            .get<{ data: LoginResponse }>('/login', {params: {'email': email, 'otp': otp}})
            .then(unpack)
            .then((response) => {
                const {token} = response;
                localStorage.setItem("token", token);
                this.accessToken.next(token)
            });
    }

    logout(): Promise<any> {
        localStorage.removeItem("token");
        return this.backend
            .get('/logout', this.addAuth())
            .finally(() => this.accessToken.next(null));
    }

    getUser(): Promise<UserModel> {
        return this.backend
            .get<{ data: UserModel }>('/user', this.addAuth())
            .then(unpack);
    }

    getConsumers(): Promise<ConsumerModel[]> {
        return this.backend
            .get<{ data: ConsumerModel[] }>('/consumers', this.addAuth())
            .then(unpack);
    }

    putConsumer(consumer: ConsumerModel) {
        return this.backend
            .patch('/consumers/' + consumer.id, {data: {active: consumer.active}}, this.addAuth());
    }

    getAvailableEnergy(date: string): Promise<number[]> {
        return this.backend
            .get<{ data: number[] }>('/available-energy/' + date, this.addAuth())
            .then(unpack);
    }

    getTasks(): Promise<TaskModel> {
        return this.backend
            .get<{ data: TaskModel }>('/tasks', this.addAuth())
            .then(unpack);
    }

    getPredictions(): Promise<PredictionDateEntry[]> {
        return this.backend
            .get<{ data: PredictionDateEntry[] }>('/predictions', this.addAuth())
            .then(unpack);
    }

    getPrediction(date: string): Promise<{ validated: boolean, data: PredictionModel[] }> {
        return this.backend
            .get<{ data: { validated: boolean, data: PredictionModel[] } }>('/predictions/' + date, this.addAuth())
            .then(unpack);
    }

    putPrediction(date: string, predictions: PredictionModel[]): Promise<AxiosResponse> {
        return this.backend
            .put('/predictions/' + date, {data: predictions}, this.addAuth());
    }

    getWellBeing(date: string): Promise<WellBeingModel> {
        return this.backend
            .get<{ data: WellBeingModel }>('/well-being/' + date, this.addAuth())
            .then(unpack);
    }

    postWellBeing(wellBeing: WellBeingModel): Promise<AxiosResponse> {
        return this.backend
            .post('/well-being', {data: wellBeing}, this.addAuth());
    }

    postConsumption(file: File) {
        const source = axios.CancelToken.source();
        const formData = new FormData();
        formData.append("upfile", file, file.name)
        return {
            promise: this.backend.post('/consumptions', formData, this.addAuth({cancelToken: source.token})),
            cancelToken: source
        }
    }

    postTracking(data: any): Promise<AxiosResponse> {
        return this.backend
            .post("/tracking", {data: data}, {});
    }

    private addAuth(config?: AxiosRequestConfig): AxiosRequestConfig {
        return {...config, headers: {Authorization: `${this.accessToken.value}`}};
    }
}

export default BackendService;
