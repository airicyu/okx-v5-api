# okx-v5-api

This is a non-official [OKX V5 API](https://www.okx.com/docs-v5/) SDK for javascript.

## install

npm install okx-v5-api

------------

## Hello world

main.js

```javascript
import { OkxV5Api } from 'okx-v5-api'

const run = async () => {
    const okxV5Api = new OkxV5Api({
        apiBaseUrl: 'https://www.okx.com',
        /* profileConfig: { <-- only needed if you will call private APIs
            apiKey: 'XXX',
            secretKey: 'YYY',
            passPhrase: 'ZZZ',
        }, */
    })

    const apiResult = await okxV5Api.call({
        method: 'GET',
        path: '/api/v5/market/exchange-rate',
    })

    console.log(apiResult)
    
    const apiResult2 = await okxV5Api.call({
        method: 'GET',
        path: '/api/v5/asset/currencies?ccy=BTC,ETH,USDT,USDC',
    })
    
    console.log(apiResult2)
}

run()
```

output
```
ApiResult {
  code: '0',
  msg: '',
  data: [ { usdCny: '7.244' } ],
  error: null
}

...
```

GET method API sample

```javascript
const apiResult = (
    await okxV5Api.call({
        method: 'GET',
        path: '/api/v5/xxx/yyy?ccy=BTC'
    })
).getOrThrow()
```

POST method API sample

```javascript
const apiResult = (
    await okxV5Api.call({
        method: 'POST',
        path: '/api/v5/xxx/yyy',
        data: {
          param: 123
        }
    })
).getOrThrow()
```

By default we return an `ApiResult` object to represent the raw response body.

### Get Data or Throw Error

`ApiResult` object's `getOrThrow` method can:
- if API success, return the data
- if API error, throw the error

#### Demo success case
```javascript
const apiResult = (
    await okxV5Api.call({
        method: 'GET',
        path: '/api/v5/market/exchange-rate',
    })
).getOrThrow()

console.log(apiResult)
```

output
```
[ { usdCny: '7.244' } ]
```

#### Demo error case
```javascript
const apiResult = (
    await okxV5Api.call({
        method: 'POST',
        path: '/api/v5/account/set-position-mode',
        data: {
            posMode: 'net_mode',
        },
    })
).getOrThrow()
```

output
```
...\ApiResult.js:15
            this.error = new ApiError_1.ApiError(code, message);
                         ^

ApiError: 50114: Invalid Authority
    at new ApiResult (.....)
    at OkxV5Api.call (.....)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async run (.....\main.js:19:25) {
  code: '50114',
  msg: 'Invalid Authority'
}
```

------------

## Authentication

If you need to call private APIs, you need authentication by passing the `profileConfig` property when you create new `OkxV5Api` instance.

```javascript
const okxV5Api = new OkxV5Api({
    apiBaseUrl: 'https://www.okx.com',
    profileConfig: {
        apiKey: 'XXX',
        secretKey: 'YYY',
        passPhrase: 'ZZZ',
    },
})
```

------------

## API

### class OkxV5Api (main class)

Basically you only need to create an instance of `OkxV5Api` once, and reuse it to call different APIs by the `call` methods.

The `call` methods return a `ApiResult` object

-----

### class ApiResult (Thin wrapper to result)

It is thin wrapper of the V5 API's raw response result. It has the following attributes:

- code (string)
- msg (string)
- data (any)

In addition:
- success (boolean)
- error (of type `ApiError` or null)

It also has a method of `getOrThrow`, which return the `data` if success, or throw error otherwise.

-----

### class ApiError (Error wrapper)

just an Error wrapping V5-API's code and message.

```javascript
export class ApiError extends Error {
    code: string
    msg: string

    constructor(code: string, msg: string) {
        super(`${code}: ${msg}`)
        this.code = code
        this.msg = msg
        this.name = 'ApiError'
    }
}
```
