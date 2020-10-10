const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const dinamicRoute = require("./DinamicRoute"); 


const DEBUG = process.env.CONTEXT === "development";

dinamicRoute(router, '/fixtures?live=all');
router.get("/", (req, res) => { 
    
    res.send(`<h2>Cache status: ${JSON.stringify(footabalApiCache.getStats())}</h2> ${footabalApiCache.keys()}`);
   /* res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('./src/index.html').pipe(res);
    res.send(`<h2>Cache status: ${JSON.stringify(footabalApiCache.getStats())}</h2> ${footabalApiCache.keys()}`);
  
    intervalObj = setInterval(() => {
        console.log('interviewing the interval');
        ApiFootbal.getLive()
            .then((response)=>{
                footabalApiCache.set(response.data._id, response.data )
            })
            .catch((error)=>{
                console.error(error);
            })
      }, 1000 * 55 );*/
});

router.get("/clear", (req, res) => {
    clearInterval(intervalObj);
});

//TODO:add to config? files
app.use(`/.netlify/functions/api`, router);
app.set('view engine', 'html');
module.exports = app;
module.exports.handler = serverless(app);