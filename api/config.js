const config = {}

config.axios = {
    'baseURL':'https://v2.api-football.com', //https://v2.api-football.com/fixtures/live https://cat-fact.herokuapp.com
    "headers":{
        "content-type":"application/octet-stream",
        'x-rapidapi-host': 'v2.api-football.com',
        'X-RapidAPI-Key': 'afe2b686406ad901f05b583bf4297849',
        "useQueryString":true
    }
}

config.cacheOptions= { stdTTL: 15, checkperiod: 20, deleteOnExpire: true, maxKeys: 100 }

module.exports = config;