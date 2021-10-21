import {AxiosRequestConfig, AxiosResponse} from "axios";
import {Backend} from "./Backend";
import {DefaultExecutor, Executor, FaultyExecutor} from "./Executor";
import {getFakeDB, resetFakeDB, saveFakeDB} from "./FakeDB";
import {ConsumerModel, TaskModel} from "./Model";

function findInDict(dict: any, matcher: (value: any) => boolean): any {
    for (let key in dict) {
        if (matcher(dict[key])) {
            return key;
        }
    }
    return null;
}

const defaultDelay = 30;

function delayedPromise<T>(promise: Promise<T>, delay = defaultDelay): Promise<T> {
    return promise
        .then(value => new Promise<T>(resolve => setTimeout(() => resolve(value), delay)))
        .catch(reason => new Promise<T>((resolve, reject) => setTimeout(() => reject(reason), delay)));
}

class FakeBackend implements Backend {
    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        const promise = new Promise<R>((resolve, reject) => {
            let e: Executor = new DefaultExecutor(resolve, reject);

            console.log(`FAKEBACKEND GET Fake backend call to ${url}`, config)
            if (!config) return e.error();
            const db = getFakeDB();

            if (url.endsWith('/request-pin')) {
                const {code, email} = config.params;
                if (code === 'test' && db.user[email]!!) return e.ok({})
                return e.error()
            } else if (url.endsWith('/login')) {
                const {email, otp} = config.params;
                const user = db.user[email]
                if (user != null && otp === "123456") return e.ok({data: {token: findInDict(db.token, (v: string) => v === email)}})
                return e.error()
            }
            if (!config.headers) return e.error();
            const token = config.headers.Authorization;
            const user = db.token[token]
            if (user == null) return e.error();
            if (db.user[user].id.startsWith("faulty")) e = new FaultyExecutor(e);

            if (url.endsWith('/logout')) {
                resetFakeDB()
                e.ok({})
            } else if (url.endsWith('/user')) {
                e.ok({data: db.user[user]})
            } else if (url.endsWith('/consumers')) {
                e.ok({data: db.consumer[user]})
            } else if (url.endsWith('/predictions')) {
                e.ok({
                    data: Object.keys(db.predictions[user]).map(date => ({
                            validated: db.predictions[user][date].validated,
                            date: date
                        })
                    )
                })
            } else if (url.includes('/predictions/')) {
                const date = url.substring(url.lastIndexOf('/') + 1)
                const prediction = db.predictions[user][date];
                console.log(db.predictions[user])
                if (!prediction) return e.error({status: 404, statusText: 'Not found'})
                e.ok({data: prediction})
            } else if (url.includes('/available-energy/')) {
                e.ok({data: [0, 0.1, 0.1, 0.1, 0.1, 0.2, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 1, 1, 0.8, 0.6, 0.6, 0.4, 0.3, 0.5, 0.7, 0.3, 0, 0]})
            } else if (url.includes('/well-being/')) {
                const index = url.substring(url.lastIndexOf('/') + 1)
                const mood = db.mood[user][index]
                if (!mood) return e.error({status: 404})
                e.ok({data: mood})
            } else if (url.endsWith('/tasks')) {
                e.ok<{ data: TaskModel }>({
                    data: {
                        todoPrediction: true,
                        todoVerifyPrediction: true,
                        todoUpload: true,
                        todoWellBeing: true
                    }
                })
            } else {
                e.error()
            }
        });
        return delayedPromise(promise);
    }

    post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
        const promise = new Promise<R>((resolve, reject) => {
            let e: Executor = new DefaultExecutor(resolve, reject);

            console.log(`FAKEBACKEND POST Fake backend call to ${url}`, config)
            if (!config) return e.error();
            const db = getFakeDB();

            if (url.endsWith('/tracking')) {
                console.log('FAKEBACKEND Tracking data:', data);
                return e.ok({});
            }

            if (!config.headers) return e.error();
            const token = config.headers.Authorization;
            const user = db.token[token];
            if (user == null) return e.error();
            if (db.user[user].id.startsWith("faulty")) e = new FaultyExecutor(e);
            if (url.endsWith('/consumptions')) {
                e.ok({});
            } else if (url.startsWith('/well-being')) {
                const date = new Date().toISOString().slice(0, 10);
                db.mood[user][date] = data.data;
                saveFakeDB(db);

                e.ok({})
            }
            e.error();
        })
        if (url.endsWith('/consumptions')) return delayedPromise(promise, 3000);
        return delayedPromise(promise);
    }

    put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
        const promise = new Promise<R>((resolve, reject) => {
            let e: Executor = new DefaultExecutor(resolve, reject);
            console.log(`FAKEBACKEND PUT Fake backend call to ${url}`, 'config:', config, 'data:', data)
            if (!config?.headers) return e.error();
            const db = getFakeDB();
            const token = config.headers.Authorization;
            const user = db.token[token]
            if (user == null) return e.error()
            if (db.user[user].id.startsWith("faulty")) e = new FaultyExecutor(e);

            const id = url.split('/').pop()
            if (id == null) return e.error()

            if (url.startsWith('/predictions')) {
                const date = url.substring(url.lastIndexOf('/') + 1)
                db.predictions[user][date] = {validated: true, data: data.data};
                saveFakeDB(db);

                e.ok({})
            } else {
                e.error()
            }
        })
        return delayedPromise(promise);
    }

    patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<R> {
        const promise = new Promise<R>((resolve, reject) => {
            let e: Executor = new DefaultExecutor(resolve, reject);
            console.log(`FAKEBACKEND PATCH Fake backend call to ${url}`, 'config:', config, 'data:', data)
            if (!config?.headers) return e.error();
            const db = getFakeDB();
            const token = config.headers.Authorization;
            const user = db.token[token]
            if (user == null) return e.error()
            if (db.user[user].id.startsWith("faulty")) e = new FaultyExecutor(e);

            const id = url.split('/').pop()
            if (id == null) return e.error()

            if (url.startsWith('/consumers')) {
                const {active} = data.data;
                meldArrayElement<ConsumerModel>(db.consumer[user], c => c.id.toString() === id.toString(), {active: active})
                saveFakeDB(db);

                e.ok({})
            } else {
                e.error()
            }
        })
        return delayedPromise(promise);
    }
}

function meldArrayElement<T>(array: Array<T>, elementMatcher: (value: T) => boolean, changes: any) {
    const consumerIndex = array.findIndex(elementMatcher)
    array[consumerIndex] = {...array[consumerIndex], ...changes}
}

export default FakeBackend;
