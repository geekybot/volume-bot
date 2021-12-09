var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/tradingbot";
var axios = require('axios');
let top = require('./top50.json');

async function remove50() {
    let db = await MongoClient.connect(url);
    var dbo = await db.db("tradingbot");
    top.forEach(async element => {
        console.log(element.id)
        await dbo.collection("coinlist").deleteOne({id: element.id});
    });
    // await db.close();
}
remove50()