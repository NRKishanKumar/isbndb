var express = require('express');
var router = express.Router();
let {getRetailInventory} = require("../repository/isbn/books.db");



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/inventory', function(req, res, next) {
    let queryParams = {
        ...req.query
    };
    getRetailInventory(queryParams)
        .then(res => {
            let result = JSON.parse(JSON.stringify(res))
            console.log(result, "getRetailInventory")
            res.json({data: result});
        })
        .catch(err => res.send(err))
});

module.exports = router;
