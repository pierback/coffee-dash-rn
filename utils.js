const coffeeCodes = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]];

function getCoffeeString(...coffeeCode) {
    const [size, strength] = coffeeCode;
    const mapping = {
        size: {
            0: 'Small',
            1: 'Big',
        }[size],
        strength: {
            0: 'Mild',
            1: 'Normal',
            2: 'Strong',
        }[strength],
    };
    return `${mapping.size} & ${mapping.strength}`;
}

async function getUserConsumption(contract, user) {
    const promise = await Promise.all(coffeeCodes.map(async (el) => {
        const coffeeObj = await getUserCoffeeCnt(contract, user, el)
        return coffeeObj;
    }))
    return Promise.resolve(promise)
}

function getUserCoffeeCnt(contract, user, el) {
    return new Promise(resolve => {
        contract.methods.getUserCoffeeCnt(user, ...el).call((err, result) => {
            resolve({ [getCoffeeString(...el)]: result });
        });
    })
}

async function getOverallConsumption(contract) {
    return await Promise.all(coffeeCodes.map(async (el) => {
        const coffeeObj = await getOverallCoffeeCnt(contract, el)
        return coffeeObj;
    }));
}

function getOverallCoffeeCnt(contract, el) {
    return new Promise(resolve => {
        contract.methods.getOverallCoffeeCnt(...el).call((err, result) => {
            resolve({ [getCoffeeString(...el)]: result });
        });
    })
}

function getCoffeeCode(coffeeSize, coffeeStrength) {
    const size = coffeeSize.toLowerCase();
    const strength = coffeeStrength.toLowerCase();

    return {
        size: {
            small: 0,
            big: 1,
        }[size],
        strength: {
            mild: 0,
            normal: 1,
            strong: 2,
        }[strength],
    };
}

module.exports = {
    getCoffeeCode,
    getCoffeeString,
    getOverallConsumption,
    getUserConsumption,
};
