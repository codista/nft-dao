var express = require('express');
var router = express.Router();
var opensea = require("../build/src/opensea");

router.post('/score',async function(request,response) {
    //code to perform particular action.
    //To access POST variable use req.body()methods.
    console.log(request.body);
    //let rt = '{"data": {"symbol": "ETH-USD","last": {"price": 467.85,"size": 0.01816561,"timestamp": 1528926483463}}}';
    const value = await opensea.getExpertScore(request.body.data.address);
    response.json({"data": {"NFTEXPERTScore": value}});
});




module.exports = router;