let deployedInstance;

async function startCC(web3, address, abi) {
  console.log('\nCoffeCoin Contract Address: %s\n', address);
  deployedInstance = new web3.eth.Contract(JSON.parse(abi), address.toString());
  console.log('startCC deployedInstance: ', deployedInstance);
}

async function getChairBalance(address) {
  return new Promise(resolve => deployedInstance.methods
    .getChairBalance()
    .call({ from: address })
    .then((result) => {
      console.log('getChairBalance: %s \n', JSON.stringify(result));
      resolve(JSON.stringify(result));
    })
    .catch((err) => {
      console.log('getChairBalance', err);
      resolve();
    }));
}

async function getOwnBalance(address) {
  return new Promise(resolve => deployedInstance.methods
    .getOwnBalance()
    .call({ from: address })
    .then((result) => {
      console.log('getOwnBalance: %s \n', JSON.stringify(result));
      resolve(JSON.stringify(result));
    })
    .catch((err) => {
      console.log('getOwnBalance', err);
      resolve();
    }));
}

async function payCoffee(address) {
  return new Promise((resolve, reject) => deployedInstance.methods
    .payCoffee()
    .send({
      from: address,
      gas: 2300000,
    })
    .on('transactionHash', (hash) => {
      console.log('payCoffee hash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('payCoffee receipt: \n');
      resolve();
    })
    .on('error', (err) => {
      console.log('payCoffee error: ', err);
      reject();
    }));
}

async function payMate(address) {
  return new Promise((resolve, reject) => deployedInstance.methods
    .payMate()
    .send({
      from: address,
      gas: 2300000,
    })
    .on('transactionHash', (hash) => {
      console.log('payMate hash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('payMate receipt: \n');
      resolve();
    })
    .on('error', (err) => {
      console.log('payMate error: ', err);
      reject();
    }));
}

async function payWater(address) {
  return new Promise((resolve, reject) => deployedInstance.methods
    .payWater()
    .send({
      from: address,
      gas: 2300000,
    })
    .on('transactionHash', (hash) => {
      console.log('payWater hash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('payWater receipt: \n');
      resolve();
    })
    .on('error', (err) => {
      console.log('payWater error: ', err);
      reject();
    }));
}

async function transferGasEstimate(address) {
  console.log('transferGasEstimate: ');
  return new Promise((resolve, reject) => deployedInstance.methods
    .transfer('18ef96d887954472de5e9f47d60ba8dea371dbfe', 2)
    .estimateGas({
      from: address,
      gas: 5000000,
    })
    .then(gasAmount => resolve(gasAmount))
    .catch((error) => {
      console.log('error: ', error);
      reject();
    }));
}

async function transfer(gasAmount, address) {
  console.log('transfer: ');
  return new Promise((resolve, reject) => {
    deployedInstance.methods
      .transfer('18ef96d887954472de5e9f47d60ba8dea371dbfe', 2)
      .send({
        from: address,
        gas: gasAmount,
      })
      .on('transactionHash', (hash) => {
        console.log('hash: ', hash);
        resolve();
      })
      .on('receipt', (receipt) => {
        console.log('receipt: ', receipt);
      })
      .on('error', (err) => {
        console.log('setDrinkData error: ', err);
        reject();
      });
  });
}

module.exports = {
  startCC, payCoffee, payMate, payWater, getChairBalance, getOwnBalance,
};
