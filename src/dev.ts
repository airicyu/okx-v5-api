import { OkxV5Api } from './OkxV5Api'

const run = async () => {
    const okxV5Api = new OkxV5Api({
        apiBaseUrl: 'https://www.okx.com',
    })

    const apiResult = await okxV5Api.restApi({
        method: 'GET',
        path: '/api/v5/market/exchange-rate',
    })

    console.log(apiResult)
}

run()
