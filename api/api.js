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
            url: '/fixtures',
            axios: apiFootballInstance,
            router: router,
            cacheStdTTL: '60',
        };
        const apiFootballStatisticsEndPoint = {
            url: '/fixtures/statistics',
            axios: apiFootballInstance,
            router: router,
            cacheStdTTL: '60',
        };
        this._endPoints = [apiFootballEndPoint, catFactsEndPoint, apiFootballStatisticsEndPoint];
        this._activeEndPoints = [];

        this.createEndpoints();
    }

    createEndpoints() {
      this._activeEndPoints = this._endPoints.map((endPoint)=>(dinamicRoute(endPoint)))

    }
    set endPoints(endpoint){
        this._endPoints.push(endpoint);
    }
    get endPoints(){
        return this._activeEndPoints.map(({cache, url}) => ({
               url: url,
               keys: cache.keys(),
               stats: cache.getStats(),
               ttl: cache.keys().map( (key) => { 
                   const myObj = {}
                    myObj[key] = new Date(cache.getTtl( key ));
                    return myObj;
                 } ),
            
                }))
    }
}

module.exports = app;
module.exports.handler = serverless(app);