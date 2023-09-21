import { OkxV5Api } from './core/okxV5Api.js'

const run = async () => {
    const okxV5Api = new OkxV5Api({
        apiBaseUrl: 'https://www.okx.com',
    })

    const apiResult = await okxV5Api.call({
        method: 'GET',
        path: '/api/v5/market/exchange-rate',
    })

    console.log(apiResult)
}

run()
