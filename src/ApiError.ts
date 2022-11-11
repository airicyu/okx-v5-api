export class ApiError extends Error {
    code: string
    msg: string

    constructor(code: string, message: string) {
        super(`${code}: ${message}`)
        this.code = code
        this.msg = message
        this.name = 'ApiError'
    }
}
