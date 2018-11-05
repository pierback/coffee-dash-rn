const { getUserConsumption, getOverallConsumption } = require('./utils');
import { toHex } from 'web3-utils'

class GetUserData {
    constructor(_web3, _uc) {
        this.web3 = _web3;
        this.userController = _uc;
    }

    async task(email) {
        const user = toHex(email);
        const userConsumption = await getUserConsumption(this.userController, user);
        const overallConsumption = await getOverallConsumption(this.userController);

        return {
            userConsumption,
            overallConsumption,
        };
    }
}
module.exports = GetUserData;
