const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'indegenie';

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });
let db;

function connect (cb) {
    // Use connect method to connect to the Server
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        db = client.db(dbName);
        cb();
    });

}

function get() {
    return db;
}

function close() {
    db.close();
}


const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}

module.exports = {
    get,
  connect,
  close
};