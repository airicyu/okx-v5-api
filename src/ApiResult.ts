/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from './ApiError'

export class ApiResult {
    code: string
    message: string
    data: any = undefined
    error: ApiError | null = null

    constructor(code: string, message: string, data: any) {
        this.code = code
        this.message = message
        this.data = data
        if (this.code !== '0') {
            this.error = new ApiError(code, message)
        }
    }

    get success() {
        return this.code === '0'
    }

    getOrThrow() {
        if (!this.success) {
            throw this.error
        } else {
            return this.data
        }
    }
}
