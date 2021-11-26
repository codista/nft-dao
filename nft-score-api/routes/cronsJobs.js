var express = require('express');
var router = express.Router();
var blockchain = require("../build/src/blockchain");

router.post('/scores',async function(request,response) {
    
    const value = await blockchain.updateScores();
    
    response.json({"data": {"success": true}});
});

router.post('/expirations',async function(request,response) {
    
    const value = await blockchain.updateExpirations();
    
    response.json({"data": {"success": true}});
});


module.exports = router;