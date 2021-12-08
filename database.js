var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/tradingbot";


async function checkENtry(symbol) {
    try {
        let db = await MongoClient.connect(url);
        var dbo = await db.db("tradingbot");
        let coinid = await dbo.collection("coinlist").findOne({ symbol: symbol });
        console.log(coinid);
        let result = await dbo.collection("activeTrades").find({ id: coinid.id }).toArray();
        var length = await result.length;
        await db.close();
        if (length != 0) {
            console.log("here ");
            return [];
        }
        else {
            console.log("here", coinid["id"]);
            return [coinid["id"]]
        }
    } catch (error) {
        throw error;
    }
}

async function buyEntry(id, price, amount) {
    let db = await MongoClient.connect(url);
    var dbo = await db.db("tradingbot");
    let time = Math.floor(new Date().getTime() / 1000.0);
    var myobj = {
        "id": id,
        "timeStarted": time,
        "spotPrice": price,
        "quantity": amount,
        "totalPrice": (price * amount).toFixed(4)
    };
    await dbo.collection("activeTrades").insertOne(myobj);
    await db.close();
}

async function checkSell() {
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

async function sellEntry(id, timeStarted, buyPrice, sellPrice, amount) {
    let db = await MongoClient.connect(url);
    var dbo = await db.db("tradingbot");
    let time = Math.floor(new Date().getTime() / 1000.0);
    var myobj = {
        "id": id,
        "timeStarted": timeStarted,
        "timeClosed" : time,
        "buyPrice": buyPrice,
        "sellPrice": sellPrice,
        "quantity": amount,
        "profit": ((sellPrice-buyPrice)*amount).toFixed(4)
    };
    await dbo.collection("balanceSheet").insertOne(myobj);
    await db.close();
}

async function deleteActiveTrade(id){
    let db = await MongoClient.connect(url);
    var dbo = await db.db("tradingbot");
    await dbo.collection("activeTrades").deleteOne({id: id});
    await db.close();
}

module.exports = {
    checkENtry, buyEntry, checkSell, sellEntry, deleteActiveTrade
}
// module.exports = checkENtry;
// module.exports = buyEntry;
// console.log(checkENtry('eth'))