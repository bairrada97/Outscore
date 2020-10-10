 const catFactsAxios = {
    'baseURL':'https://cat-fact.herokuapp.com',
}

 const apiFootballAxios = {
    'baseURL':'https://v2.api-football.com',
    "headers":{
        "content-type":"application/octet-stream",
        'x-rapidapi-host': 'v2.api-football.com',
        'X-RapidAPI-Key': 'afe2b686406ad901f05b583bf4297849', //TODO: change to env varible 
        "useQueryString":true
    }
}
export {
    apiFootballAxios,
    catFactsAxios,
};