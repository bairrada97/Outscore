const NodeCache = require( "node-cache" );
const config = require('./config');
const axios = require("./axios");
config.cacheOptions.stdTTL = 30;
const footabalApiCache = new NodeCache(config.cacheOptions);

module.exports = function CreateRouter(router, url) { 
  console.log(url, process.env);
  return router.get(url, function(req, res){
      var params = req.params;
      console.info("✉️ get  ", url, params);
     let data = footabalApiCache.get(url);
      if ( data == undefined ){
        // handle miss!
        axios.get(url).then((response)=>{
          data = response.data;
          footabalApiCache.set(url, data )
          res.json(data);
      }).catch((err)=>(res.json(err)));
    }else{
      res.json(data);
    }  
    });
};