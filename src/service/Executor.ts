export class Executor<R> {
    constructor(private resolve: (value: (PromiseLike<R> | R)) => void, private reject: (reason?: any) => void) {
    }

    ok(data: {}) {
        console.log("Resolving call with OK", data)
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
        console.log("Resolving call with Error")
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