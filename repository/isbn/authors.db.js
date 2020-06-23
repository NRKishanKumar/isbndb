let db = require("../mongo");

function getAuthorByAwards(awards, next) {
    const collection = db.get().collection('authors');
    return new Promise(async (resolve, reason) => {
        try {
            awards = Number(awards);
            collection.find({
                $where: `this.awards.length > ${awards}`
            }).toArray((err, result) => {
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

function getAuthorByQuery (params, next) {
    const collection = db.get().collection('authors');
    return new Promise(async (resolve, reason) => {
        try {
            let { birthDate, totalPrice } = params;
            collection.find([
                { $match : { "dob" : new Date(birthDate) } },
                {$lookup:{
                        from: "books",
                        localField: "name",
                        foreignField: "author",
                        as: "owner"
                    }}, {"$unwind": "$owner"},
                {"$group": {
                        _id: "$_id",
                        "TotalAmount": {
                            "$sum": "$owner.price"
                        }
                    }},
                {
                    $match: {
                        "TotalAmount": { "$gte": totalPrice }
                    }
                }
            ])
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

module.exports = {
    getAuthorByAwards,
    getAwardedAuthorByYear,
    getRetailInventory,
    getAuthorByQuery,
};