const moment = require('moment');
const { fromAscii, hexToString } = require('web3-utils');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let deployedInstance;

async function startBvgl(web3, address, abi) {
  console.log('\nBeverageList Contract Address: %s\n', address.toString());
  deployedInstance = new web3.eth.Contract(JSON.parse(abi), address.toString());
  console.log('startBvgl deployedInstance: ', deployedInstance);
}

async function setDrinkData(_drink, address) {
  const gasAmount = await setDrinkDataGasEstimate(address);
  const time = fromAscii(moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'));
  const weekday = fromAscii(days[new Date().getDay()]);
  const drink = fromAscii(_drink);

  return new Promise((resolve, reject) => deployedInstance.methods
    .setDrinkData(time, drink, weekday)
    .send({
      from: address,
      gas: gasAmount,
    })
    .on('transactionHash', (hash) => {
      console.log('hash: ', hash);
      resolve();
    })
    .on('receipt', (receipt) => {
      printEvent(receipt);
      console.log('Starting over');
      // setTimeout(startBvgl, 7000);
    })
    .on('error', (err) => {
      console.log('setDrinkData error: ', err);
    }));
}

function printEvent(receipt) {
  if (receipt.events) {
    const {
      Address, time, drink, weekday,
    } = receipt.events.NewDrink.returnValues;
    console.log('receipt:');
    console.log('  Address', Address);
    console.log('  time', hexToString(time));
    console.log('  drink:', hexToString(drink));
    console.log('  weekday: %s\n\n', hexToString(weekday));
  } else {
    console.log('receipt: %o \n\n', receipt);
  }
}

async function setDrinkDataGasEstimate(address) {
  const fomat = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
  const weekday = fromAscii('heuterrrrr');
  const drink = fromAscii('mateteter');
  const time = fromAscii(fomat);

  return new Promise((resolve, reject) => {
    deployedInstance.methods
      .setDrinkData(time, drink, weekday)
      .estimateGas({ from: address })
      .then(gasAmount => resolve(gasAmount))
      .catch((error) => {
        console.log('error: ', error);
        reject();
      });
  });
}

async function watchEvents() {
  return deployedInstance.events
    .NewDrink({
      filter: { myIndexedParam: [20, 23] },
      fromBlock: 0,
      toBlock: 'latest',
    })
    .on('data', (event) => {
      console.log('Event data', event.returnValues);
    })
    .on('error', err => console.log('Error on watching', err));
}

module.exports = { startBvgl, setDrinkData };
