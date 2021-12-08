const axios = require('axios');
const cron = require('node-cron');
const { buyEntry, sellEntry } = require('./database');
const db = require('./database');


async function sellWithProfit() {
    let actives = await db.checkSell();

    if (actives.length > 0) {
        actives.forEach(async element => {
            let cgprice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=' + element.id + '&vs_currencies=usd&include_24hr_change=true');
            cgprice = cgprice.data;
            console.log(cgprice);
            let time = Math.floor(new Date().getTime() / 1000.0);
            if (cgprice[element.id].usd > element.spotPrice * 1.1 || element.timeStarted + 86400 <= time) {
                console.log(element.id, element.timeStarted, element.spotPrice, cgprice[element.id].usd, element.quantity)
                await db.sellEntry(element.id, element.timeStarted, element.spotPrice, cgprice[element.id].usd, element.quantity);
                await db.deleteActiveTrade(element.id);
            }
        });
        //ticker  pings  netVol   netVol%  recentBTCVol RecentVol%  RecentNetvol  timestamp
    }

}


cron.schedule('*/1 * * * *', () => {
    sellWithProfit()
    console.log('running a task 1 minutes');
});

// db.checkSell();