var express = require('express');
var router = express.Router();
var opensea = require("../build/src/opensea");
const { curly } = require("node-libcurl");

/* GET users listing. */
router.get('/value/:contract/:id', async function(req, res, next) {
    //var x= require('@opensea/v1.0#8j6fksradfoi');
    //console.log(x);
    //const orders = await opensea.getNFTValue("0x8cd8155e1af6ad31dd9eec2ced37e04145acfcb3","1808");
    const value = await opensea.getNFTValue(req.params.contract,req.params.id);
    
    console.log(`value is ${value}`);
    res.send(value);   
});

router.get('/data/:contract/:id', async function(req, res, next) {
    
    //const value = await opensea.getNFTValue(req.params.contract,req.params.id);
    url="https://api.nftport.xyz/v0/nfts/"+req.params.contract+"/"+req.params.id;
    const { statusCode, data, headers } = await curly.get(url, {
        httpHeader: [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: edf0f0e5-a382-4023-8f39-c01a4d9326f8'
        ],
        })
    //console.log(statusCode+" "+JSON.stringify(data)+" "+url);
    if (statusCode!=200) {
        console.error("failed to retrieve inft info from nftport ",statusCode);
        return false;
    }
    console.log(data)
    response.json(data);
});


router.post('/value',async function(request,response) {
    //code to perform particular action.
    //To access POST variable use req.body()methods.
    console.log(request.body);
    //let rt = '{"data": {"symbol": "ETH-USD","last": {"price": 467.85,"size": 0.01816561,"timestamp": 1528926483463}}}';
    const value = await opensea.getNFTValue(request.body.data.contract,request.body.data.id);
    response.json({"data": {"NFTPrice": value}});
});

module.exports = router;
