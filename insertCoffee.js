
// const { getUserConsumption, getCoffeeCode, getCoffeeString } = require('./utils');
import { toHex } from 'web3-utils'

class InsertCoffee {
    constructor(_web3, _uc) {
        this.web3 = _web3;
        this.userController = _uc;
    }

    async task(email) {
        const user = toHex('fabp_92@hotmail.de');
        // const { size, strength } = getCoffeeCode(req.body.size, req.body.strength);

        // this.web3.miner.start(1);
        return new Promise((resolve, reject) => {
            this.userController.methods.insertCoffee(user, 1, 1).send({ from: '0x02e9f84165314bb8c255d8d3303b563b7375eb61' })
                .then((receipt) => {

                    // this.web3.miner.stop(1);
                    resolve(receipt)
                })
                .catch(resolve);
        })

        // res.status(200).json({ coffee: getCoffeeString(size, strength) });
    }
}
module.exports = InsertCoffee;
