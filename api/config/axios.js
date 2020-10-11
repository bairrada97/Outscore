 const catFactsAxios = {
    'baseURL':'https://cat-fact.herokuapp.com',
}

 const apiFootballAxios = {
    'baseURL':'https://v3.football.api-sports.io/',
    "headers":{
        "content-type":"application/octet-stream",
        'x-rapidapi-host': 'v3.api-football.com',
        'X-RapidAPI-Key': 'bd3b30e0ee4efd020aaf515e7a304cba', //TODO: change to env varible 
        "useQueryString":true
    }
}
module.exports = {
    apiFootballAxios,
    catFactsAxios,
};   