export interface Executor {
    ok<T>(data: T): void

    error(response?: {status: number, statusText?: string}): void
}

export class DefaultExecutor<R> implements Executor {
    constructor(private resolve: (value: (PromiseLike<R> | R)) => void, private reject: (reason?: any) => void) {
    }

    ok<T>(data: T) {
        console.log("FAKEBACKEND Resolving call with OK", data)
        this.resolve({
            data: data,
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
            request: {}
        } as any)
    }

    error(response?: {status: number, statusText?: string}) {
        console.log("FAKEBACKEND Resolving call with Error")
        this.reject({
            response: {
                data: {},
                status: response?.status ?? 400,
                statusText: response?.statusText ?? "BAD REQUEST",
                headers: {},
                config: {},
                request: {}
            }
        })
    }
}

export class FaultyExecutor implements Executor {
    constructor(private executor: Executor) {
    }

    ok<T>(data: T): void {
        if (Math.random() > 0.6) this.executor.ok(data); else this.executor.error();
    }

    error(response?: {status: number, statusText?: string}) {
        this.executor.error(response);
    }
}
