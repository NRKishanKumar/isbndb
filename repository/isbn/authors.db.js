let db = require("../mongo");

function getAuthorByAwards(awards, next) {
    const collection = db.get().collection('authors');
    return new Promise(async (resolve, reason) => {
        try {
            awards = Number(awards);
            collection.find({
                $where: `this.awards.length > ${awards}`
            }).toArray((err, result) => {
                console.log(err, result, "what is this");
                resolve(result);
                next && next(null, result);
            });
        } catch (e) {
            reason(e);
            next && next(e);
        }
    })
}

function getAwardedAuthorByYear(year, next) {
    const collection = db.get().collection('authors');
    return new Promise(async (resolve, reason) => {
        try {
            year = Number(year);
            collection.find({ awards:  {$elemMatch: {year: { $gte: year }}}})
                .toArray((err, result) => {
                resolve(result);
                next && next(null, result);
            });
        } catch (e) {
            reason(e);
            next && next(e);
        }
    })
}

function

module.exports = {
    getAuthorByAwards,
    getAwardedAuthorByYear
};