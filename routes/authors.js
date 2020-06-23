let {getAuthorByAwards, getAwardedAuthorByYear,
    getRetailInventory, getAuthorByQuery} = require("../repository/isbn/authors.db");

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    let queryParams = {
        ...req.query
    }
    let { awards, year } = queryParams;
    if (awards) {
        console.log(awards);
        getAuthorByAwards(awards)
            .then(res => {
                let result = JSON.parse(JSON.stringify(res))
                res.json({data: result});
            })
            .catch(err => res.send(err))
    } else if (year) {
        getAwardedAuthorByYear(year)
            .then(res => {
                let result = JSON.parse(JSON.stringify(res))
                console.log(result, "getAwardedAuthorByYear")
                res.json({data: result});
            })
            .catch(err => res.send(err))
    } else {
        res.json({
            resource: "Author resource"
        });
    }
});

module.exports = router;
