const config = {}

config.axios = {
    'baseURL':'https://cat-fact.herokuapp.com', //https://v2.api-football.com/fixtures/live https://cat-fact.herokuapp.com
    
}

config.cacheOptions= { stdTTL: 15, checkperiod: 20, deleteOnExpire: true, maxKeys: 100 }

module.exports = config;