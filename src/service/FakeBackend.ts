import {AxiosRequestConfig, AxiosResponse} from "axios";
import {v4 as uuidv4} from 'uuid';
import {Backend} from "./Backend";
import {DefaultExecutor, Executor, FaultyExecutor} from "./Executor";
import {getFakeDB, resetFakeDB, saveFakeDB} from "./FakeDB";
import {ConsumerModel} from "./Model";

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
    delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        const promise = new Promise<R>((resolve, reject) => {
            let e: Executor = new DefaultExecutor(resolve, reject);

            console.log(`FAKEBACKEND DELETE Fake backend call to ${url}`, config);
            if (!config?.headers) return e.error();
            const db = getFakeDB();

            const token = config.headers.Authorization;
            const user = db.token[token];
            if (user == null) return e.error();
            if (db.user[user].userId === "faulty") e = new FaultyExecutor(e);

            if (url.includes('/consumer/')) {
                const id = url.substring(url.lastIndexOf('/') + 1);
                const index = db.consumer[user].findIndex((it: any) => it.consumerId.toString() === id.toString());
                if (index < 0) return e.error();
                db.consumer[user].splice(index, 1);

                saveFakeDB(db);
                return e.ok({});
            }
            return e.error();
        });
        return delayedPromise(promise);
    }

    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        const promise = new Promise<R>((resolve, reject) => {
            let e: Executor = new DefaultExecutor(resolve, reject);

            console.log(`FAKEBACKEND GET Fake backend call to ${url}`, config)
            if (!config) return e.error();
            const db = getFakeDB();

            if (url.endsWith('/request_pin')) {
                const {shared_password, email} = config.params;
                if (shared_password === 'test' && db.user[email] != null) {
                    return e.ok({})
                }
                return e.error()
            } else if (url.endsWith('/login')) {
                const {email, password} = config.params;
                const user = db.user[email]
                if (user != null && password === "123456") {
                    return e.ok({token: findInDict(db.token, (v: string) => v === email)})
                }
                return e.error()
            }
            if (!config.headers) return e.error();
            const token = config.headers.Authorization;
            const user = db.token[token]
            if (user == null) return e.error();
            if (db.user[user].userId === "faulty") e = new FaultyExecutor(e);

            if (url.endsWith('/logout')) {
                resetFakeDB()
                e.ok({})
            } else if (url.endsWith('/user')) {
                e.ok(db.user[user])
            } else if (url.endsWith('/consumer')) {
                e.ok(db.consumer[user])
            } else if (url.endsWith('/processedconsumption')) {
                e.ok(Object.keys(db.processedConsumption[user]))
            } else if (url.includes('/processedconsumption/')) {
                const index = url.substring(url.lastIndexOf('/') + 1)
                e.ok(db.processedConsumption[user][index])
            } else if (url.endsWith('/predictions')) {
                e.ok(Object.keys(db.predictions[user]))
            } else if (url.includes('/predictions/')) {
                const index = url.substring(url.lastIndexOf('/') + 1)
                e.ok(db.predictions[user][index] ?? [])
            } else if (url.includes('/thermostat')) {
                e.ok(db.thermostats[user])
            } else if (url.includes('/mood/')) {
                const index = url.substring(url.lastIndexOf('/') + 1)
                e.ok(db.mood[user][index] ?? {x: 5, y: 5})
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
            const user = db.token[token]
            if (user == null) return e.error()
            if (db.user[user].userId === "faulty") e = new FaultyExecutor(e);

            if (url.endsWith('/consumer')) {
                const {consumer_name} = config.params;
                if (consumer_name == null) return e.error();
                db.consumer[user].push({
                    consumerId: uuidv4(),
                    owner: '0',
                    customName: consumer_name,
                    type: 'misc',
                    active: true
                } as ConsumerModel);
                saveFakeDB(db)
                return e.ok({});
            }
            if (url.endsWith('/consumption')) {
                return e.ok({});
            }

            return e.error();
        })
        if (url.endsWith('/consumption')) return delayedPromise(promise, 3000);
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
            if (db.user[user].userId === "faulty") e = new FaultyExecutor(e);

            const id = url.split('/').pop()
            if (id == null) return e.error()

            if (url.startsWith('/consumer')) {
                const {consumer_name, consumer_active} = config.params;
                meldArrayElement(db.consumer[user],
                    (c: ConsumerModel) => c.consumerId.toString() === id.toString(),
                    {customName: consumer_name, active: consumer_active}
                )
                saveFakeDB(db);

                return e.ok({})
            } else if (url.startsWith('/predictions')) {
                const date = url.substring(url.lastIndexOf('/') + 1)
                db.predictions[user][date] = data['predictions'];
                saveFakeDB(db);

                return e.ok({})
            } else if (url.startsWith('/mood')) {
                const date = url.substring(url.lastIndexOf('/') + 1)
                db.mood[user][date] = data['mood'];
                saveFakeDB(db);

                return e.ok({})
            } else if (url.startsWith('/thermostat')) {
                db.thermostats[user] = data['data'];
                saveFakeDB(db);

                return e.ok({})
            }

            e.error()
        })
        return delayedPromise(promise);
    }
}

function meldArrayElement(array: any, elementMatcher: any, changes: any) {
    const consumerIndex = array.findIndex(elementMatcher)
    array[consumerIndex] = {...array[consumerIndex], ...changes}
}

export default FakeBackend;
