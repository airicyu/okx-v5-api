/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict'

import axios, { AxiosInstance } from 'axios'
import http from 'http'
import https from 'https'

const httpAgent = new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 5000,
})

const httpsAgent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 5000,
})

const axiosInstance = axios.create({
    headers: {
        'content-type': 'application/json;charset=utf-8',
        Accept: 'application/json',
    },
    maxRedirects: 0,
    timeout: 5000,
    httpAgent,
    httpsAgent,
    validateStatus: (status) => {
        return status < 600
    },
}) as AxiosInstance

declare type HttpClient = (args: {
    url: string
    method: string
    headers?: Record<string, string>
    params?: any
    data?: any
    timeout?: number
    [propName: string]: any
}) => Promise<any>

const httpClient: HttpClient = (options: {
    url: string
    method: string
    headers?: Record<string, string>
    params?: any
    data?: any
    timeout?: number
    [propName: string]: any
}) => {
    return axiosInstance.request(options)
}

export { httpClient }
export type { HttpClient }
