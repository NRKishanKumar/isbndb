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

function getRetailInventory(params, next) {
    const collection = db.get().collection('books');
    return new Promise(async (resolve, reason) => {
        try {
            await collection.aggregate([{
                $lookup:
                    {
                        from: "authors",
                        localField: "author",
                        foreignField: "name",
                        as: "owner"
                    }
            }, {"$unwind": "$owner"}, {
                "$group": {
                    _id: "$_id",
                    "TotalAmount": {
                        "$sum": "$price"
                    },
                    "noOfBooks": {
                        "$sum": "$sold"
                    }
                }
            }])
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
            collection.find({ $and : [
                    {dob: { $gte: params.dob }}
                ]
            })
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