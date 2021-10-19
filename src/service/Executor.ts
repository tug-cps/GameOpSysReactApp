export interface Executor {
    ok(data: {}): void

    error(): void
}

export class DefaultExecutor<R> implements Executor {
    constructor(private resolve: (value: (PromiseLike<R> | R)) => void, private reject: (reason?: any) => void) {
    }

    ok(data: {}) {
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

    error() {
        console.log("FAKEBACKEND Resolving call with Error")
        this.reject({
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
}

export class FaultyExecutor implements Executor {
    constructor(private executor: Executor) {
    }

    ok(data: {}): void {
        if (Math.random() > 0.6) this.executor.ok(data); else this.executor.error();
    }

    error() {
        this.executor.error();
    }
}
