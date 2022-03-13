const axios = require('axios');

const passcode = 'A63uGa8775Ne89wwqADwKYGeyceXAxmHL';

exports.getMoneyInDexWallet = function(dex_reference_name, wallet_address) {
    console.log(`https://api.apeboard.finance/${dex_reference_name}/${wallet_address}`);
    return axios.get(`https://api.apeboard.finance/${dex_reference_name}/${wallet_address}`, {
            headers: {
                'passcode': passcode
            }
        }).then((scraped_data) => {
            const data = scraped_data.data ? scraped_data.data : scraped_data; 
            const pools = data.farms != undefined && data.farms.length > 0 ? data.farms 
                            : data.positions != undefined && data.positions.length > 0 ? data.positions
                            : data.projects != undefined && data.projects.length > 0 ? data.projects
                            : data.savings;
            if(!pools) {
                return [];
            }
            var farms = [];
            pools.forEach(farm => {
                const token_price = farm.tokens.map(t => t.price * t.balance).reduce((p, n) => p + n);
                const rewards = farm.rewards ? farm.rewards.map(r => r.balance * r.price).reduce((p,n) => p + n) : 0;
                farms.push({
                    symbol1: farm.tokens[0].symbol,
                    symbol2: farm.tokens.length > 1 ? farm.tokens[1].symbol : "",
                    value: token_price + rewards,
                    rewards: rewards
                });
            })
            return farms;
        });
}