const NodeCache = require( "node-cache" );
const {defaultCacheConfig} = require('./config');

module.exports = function CreateRouter( {router, url, cacheStdTTL, axios} ) { 
  console.log(url, process.env);
  const footabalApiCache = new NodeCache(defaultCacheConfig.stdTTL = cacheStdTTL);

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