import {Backend} from "./Backend";
import {AxiosRequestConfig, AxiosResponse} from "axios";

class FakeBackend implements Backend {
    delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return new Promise<R>((resolve, reject) => {
        })
    }

    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            console.log(`Fake backend call to ${url}`, config)

            if (url.endsWith('/request_pin')) {
                if (config && config.params.shared_password === 'test' && config.params.email === "user@test.com") {
                    ok({})
                } else {
                    error()
                }
            } else if (url.endsWith('/login')) {
                if (config && config.params.password === "123456") {
                    ok({token: 'fakeToken.thistokenisfake'})
                } else {
                    error()
                }
            } else if (url.endsWith('/logout')) {
                ok({})
            } else if (url.endsWith('/user')) {
                ok({
                    userId: '1234',
                    email: 'user@test.com',
                    type: 'normal',
                    creationDate: '01-01-2020',
                    unlockDate: '01-01-2020',
                    treatmentGroup: 'group_1'
                })
            } else if (url.endsWith('/consumer')) {
                ok(
                    [
                        {
                            consumerId: 0,
                            owner: 0,
                            name: 'something',
                            variableName: 'something',
                            active: true
                        },
                        {
                            consumerId: 1,
                            owner: 0,
                            name: 'something else',
                            variableName: 'something else',
                            active: true
                        },
                    ]
                )
            } else {
                error()
            }


            function ok(data: {}) {
                console.log("Resolving call with OK")
                resolve({
                    data: data,
                    status: 200,
                    statusText: "OK",
                    headers: {},
                    config: {},
                    request: {}
                } as AxiosResponse<T> as unknown as R)
            }

            function error() {
                console.log("Resolving call with Error")
                reject({
                    response: {
                        data: {},
                        status: 400,
                        statusText: "BAD REQUEST",
                        headers: {},
                        config: {},
                        request: {}
                    }
                })
            }
        })
    }

    post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
        return new Promise<R>((resolve, reject) => {
        })
    }

    put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
        return new Promise<R>((resolve, reject) => {
        })
    }
}

export default FakeBackend;
