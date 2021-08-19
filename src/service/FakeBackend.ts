import {Backend} from "./Backend";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {getFakeDB, resetFakeDB, saveFakeDB} from "./FakeDB";
import {Executor} from "./Executor";

function findInDict(dict: any, matcher: (value: any) => boolean): any {
    for (let key in dict) {
        if (matcher(dict[key])) {
            return key;
        }
    }
    return null;
}

class FakeBackend implements Backend {
    delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            const e = new Executor(resolve, reject);

            console.log(`GET Fake backend call to ${url}`, config)
            if (config == null) return e.error();
            const db = getFakeDB();

            const token = config.headers.Authorization;
            const user = db.token[token]
            if (user == null) return e.error()

            if (url.includes('/consumer/')) {
                const id = url.substring(url.lastIndexOf('/') + 1)
                const index = db.consumer[user].findIndex((it: any) => it.consumerId === +id)
                if (index < 0) return e.error()
                db.consumer[user].splice(index, 1)

                saveFakeDB(db)
                return e.ok({})
            }
            return e.error()
        })
    }

    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            const e = new Executor(resolve, reject);

            console.log(`GET Fake backend call to ${url}`, config)
            if (config == null) return e.error();
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
            const token = config.headers.Authorization;
            const user = db.token[token]
            if (user == null) return e.error()

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
            } else {
                e.error()
            }

        })
    }

    post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
        return new Promise<R>((resolve, reject) => {
        })
    }

    put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            const e = new Executor(resolve, reject);
            console.log(`PUT Fake backend call to ${url}`, config)
            if (config == null) return e.error();
            const db = getFakeDB();
            const token = config.headers.Authorization;
            const user = db.token[token]
            if (user == null) return e.error()

            const id = url.split('/').pop()
            if (id == null) return e.error()

            if (url.startsWith('/consumer')) {
                const {consumer_name, consumer_active} = config.params;
                meldArrayElement(db.consumer[user],
                    (v: any) => v.consumerId === +id,
                    {name: consumer_name, active: consumer_active}
                )
                saveFakeDB(db)

                return e.ok({})
            }

            e.error()
        })
    }
}

function meldArrayElement(array: any, elementMatcher: any, changes: any) {
    const consumerIndex = array.findIndex(elementMatcher)
    array[consumerIndex] = {...array[consumerIndex], ...changes}
}

export default FakeBackend;
