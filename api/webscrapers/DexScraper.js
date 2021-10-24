const axios = require('axios');

const passcode = '5a102a34f60fa7ec9d643a8a0e72cab9';

exports.getMoneyInDexWallet = function(dex_reference_name, wallet_address) {
    console.log(`https://api.apeboard.finance/${dex_reference_name}/${wallet_address}`);
    return axios.get(`https://api.apeboard.finance/${dex_reference_name}/${wallet_address}`, {
            headers: {
                'passcode': passcode
            }
        }).then((data) => {
            console.log(data.data.positions)
            const pools = data.data.farms != undefined && data.data.farms.length > 0 ? data.data.farms 
                            : data.data.positions != undefined && data.data.positions.length > 0 ? data.data.positions
                            : data.data.projects;
            const farms = [];
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