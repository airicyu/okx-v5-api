/* eslint-disable @typescript-eslint/no-explicit-any */
declare type HttpClient = (args: {
    url: string
    method: string
    headers?: Record<string, string>
    params?: any
    data?: any
    timeout?: number
    [propName: string]: any
}) => Promise<any>
