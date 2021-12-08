const axios = require('axios');
const cron = require('node-cron');
const { buyEntry } = require('./database');
const db = require('./database');
async function getTickers() {
    let response = await axios.get('https://agile-cliffs-23967.herokuapp.com/ok');
    let dataArray = response.data.resu;
    response.data.resu.pop();
    if (dataArray.length > 0) {
        dataArray.forEach(async element => {
            let formatArray = element.split('|');
            if (parseInt(formatArray[1]) % 3 == 0 || parseInt(formatArray[1]) % 5 == 0) {
                if (parseFloat(formatArray[6]) > 0) {
                    // console.log(formatArray);
                    //check for db entry
                    let entry = await db.checkENtry(formatArray[0].toLowerCase());
                    // console.log("logging entry");
                    // console.log(entry);
                    if (entry.length != 0) {
                        // call coingecko api to check price in usdt and the price movement
                        let cgprice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=' + entry[0] + '&vs_currencies=usd&include_24hr_change=true');
                        cgprice = cgprice.data;                        
                        // console.log(cgprice);
                        // console.log(cgprice[entry[0]].usd_24h_change);
                        if (cgprice[entry[0]].usd_24h_change < 50 && cgprice[entry[0]].usd_24h_change > 0){
                            db.buyEntry(entry[0], cgprice[entry[0]].usd, (100/cgprice[entry[0]].usd).toFixed(4));
                            console.log("buying " + entry[0]);
                        }
                    };
                    //check price action for the day 
                    //
                }
            }

        });
        //ticker  pings  netVol   netVol%  recentBTCVol RecentVol%  RecentNetvol  timestamp
    }

}





cron.schedule('*/1 * * * *', () => {
    getTickers()
    console.log('running a task 1 minutes');
});
// console.log(db.checkENtry('btc'));