let db = require("../mongo");

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

module.exports = {
    getRetailInventory,
};