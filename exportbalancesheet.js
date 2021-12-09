var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/tradingbot";


async function exportBalanceSheet() {
    try {
        let db = await MongoClient.connect(url);
        var dbo = await db.db("tradingbot");
        let result = await dbo.collection("activeTrades").find({}).toArray();
        // console.log(result);
        await db.close();
        return result;
    } catch (error) {
        throw error;
    }
}