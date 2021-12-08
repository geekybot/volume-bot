var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/tradingbot";
var axios = require('axios');
const { log } = require('console');

async function buyEntry(id, price, amount) {
    let db = await MongoClient.connect(url);
    var dbo = await db.db("tradingbot");
    let cgprice = await axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=false');
    cgprice = cgprice.data;
    console.log(cgprice);
    await dbo.collection("coinlist").insertMany(cgprice);
    await db.close();
}
buyEntry()