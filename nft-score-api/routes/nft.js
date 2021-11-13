var express = require('express');
var router = express.Router();
var opensea = require("../build/src/opensea");


/* GET users listing. */
router.get('/value/:contract/:id', async function(req, res, next) {
    //var x= require('@opensea/v1.0#8j6fksradfoi');
    //console.log(x);
    //const orders = await opensea.getNFTValue("0x8cd8155e1af6ad31dd9eec2ced37e04145acfcb3","1808");
    const value = await opensea.getNFTValue(req.params.contract,req.params.id);
    
    console.log(`value is ${value}`);
    res.send(value);   
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
