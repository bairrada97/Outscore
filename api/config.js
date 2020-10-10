const config = {}

config.axios = {
    'baseURL':'https://v3.football.api-sports.io/', //https://v2.api-football.com/fixtures/live https://cat-fact.herokuapp.com
    "headers": {
		"x-rapidapi-host": "v3.football.api-sports.io",
		"x-rapidapi-key": "bd3b30e0ee4efd020aaf515e7a304cba"
	}
    
}

config.cacheOptions= { stdTTL: 15, checkperiod: 20, deleteOnExpire: true, maxKeys: 100 }

module.exports = config; 