const { app, serverless, router} = require('./loaders/express')
const dinamicRoute = require("./DinamicRoute"); 
const {catFactsAxiosInstance, apiFootballInstance} = require("./loaders/axios");
const OutscoreServer = new Outscore(router);

router.get("/", (req, res) => {
    res.json(OutscoreServer.endPoints)
});

class Outscore {
    constructor(router){
  
        const catFactsEndPoint = {
            url: '/facts/random',
            axios: catFactsAxiosInstance, 
            router: router,
            cacheStdTTL: '10',
        };
        const apiFootballEndPoint = { 
            url: '/fixtures?live=all',
            axios: apiFootballInstance,
            router: router,
            cacheStdTTL: '60',
        };
        this._endPoints = [apiFootballEndPoint, catFactsEndPoint];

        this.createEndpoints();
    }

    createEndpoints() {
        this._endPoints.forEach((endPoint)=>(dinamicRoute(endPoint)))
    }
    set endPoints(endpoint){
        this._endPoints.push(endpoint);
    }
    get endPoints(){
        return this._endPoints;
    }
}

module.exports = app;
module.exports.handler = serverless(app);