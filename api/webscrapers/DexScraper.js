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
            const farms = [];
            data.data.farms.forEach(farm => {
                farms.push({
                    symbol1: farm.tokens[0].symbol,
                    symbol2: farm.tokens[1].symbol,
                    value: (farm.tokens[0].balance * farm.tokens[0].price) + (farm.tokens[1].balance * farm.tokens[1].price)
                });
            })
            return farms;
        });
}