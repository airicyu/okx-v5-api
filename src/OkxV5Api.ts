import CryptoJS from 'crypto-js'
import url from 'url'
import { httpClient as defaultHttpClient } from './defaultHttpClient.js'
import { ApiResult } from './ApiResult.js'

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
}

class OkxV5Api {
    #apiBaseUrl: string
    #profileConfig?: {
        apiKey: string
        secretKey: string
        passPhrase: string
    }
    #httpClient: HttpClient
    #simulated = false

    constructor({
        apiBaseUrl,
        profileConfig,
        httpClient,
    }: {
        apiBaseUrl: string
        profileConfig?: {
            apiKey: string
            secretKey: string
            passPhrase: string
            simulated?: boolean
        }
        httpClient?: HttpClient
    }) {
        this.#apiBaseUrl = apiBaseUrl
        this.#profileConfig = profileConfig
        this.#httpClient = httpClient ?? defaultHttpClient
        if (typeof profileConfig?.simulated === 'boolean') {
            this.#simulated = profileConfig.simulated
        }
    }

    /**
     * Generic REST API call with handle of signature
     */
    async call({
        path,
        method,
        params,
        data,
        timeout = 5000,
    }: {
        path: string
        method: string
        params?: Record<string, unknown>
        data?: Record<string, unknown>
        timeout?: number
    }): Promise<ApiResult> {
        const timestamp = new Date().toISOString()

        const requestUrl = `${this.#apiBaseUrl}${path}`
        const requestPath = url.parse(requestUrl).path

        let dataSerialize = data === null || data === undefined ? '' : JSON.stringify(data)
        if (dataSerialize === '{}') {
            dataSerialize = ''
        }

        const signHeaders = {
            'OK-ACCESS-KEY': this.#profileConfig?.apiKey ?? '',
            'OK-ACCESS-SIGN': CryptoJS.enc.Base64.stringify(
                CryptoJS.HmacSHA256(timestamp + method + requestPath + dataSerialize, this.#profileConfig?.secretKey ?? ''),
            ),
            'OK-ACCESS-TIMESTAMP': timestamp,
            'OK-ACCESS-PASSPHRASE': this.#profileConfig?.passPhrase ?? '',
        }

        try {
            const response = await this.#httpClient({
                url: requestUrl,
                method,
                timeout,
                headers: { ...DEFAULT_HEADERS, ...(this.#simulated ? { 'x-simulated-trading': '1' } : {}), ...signHeaders },
                params,
                data,
            })

            if (typeof response?.data?.code === 'string' && typeof response?.data?.msg === 'string') {
                return new ApiResult(response.data.code, response.data.msg, response.data.data)
            } else {
                throw new Error('Unknown API response format')
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (typeof error.response?.data?.code === 'string' && typeof error.response?.data?.msg === 'string') {
                return new ApiResult(error.response.data.code, error.response.data.msg, error.response?.data)
            } else {
                throw error
            }
        }
    }
}

export { OkxV5Api }
