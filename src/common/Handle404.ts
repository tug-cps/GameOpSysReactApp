export default function handle404<T>(promise: Promise<T>, on404: () => T) {
    return new Promise<T>((resolve, reject) => {
        promise
            .then(resolve)
            .catch((reason: { response?: { status: number } }) => {
                if (reason.response?.status === 404) {
                    resolve(on404())
                } else {
                    reject(reason)
                }
            })
    })
}
