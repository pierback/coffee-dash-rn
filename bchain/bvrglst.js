import AsyncStorage from '@react-native-community/async-storage';
import {
  deleteFile,
  readFile,
  createFile,
  getAllFiles,
  removeFile,
  removeAllFiles,
} from '../file-logging/logger';

const moment = require('moment');
const { fromAscii, hexToString } = require('web3-utils');

let web3;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let deployedInstance;

async function startBvgl(_web3, address, abi) {
  // removeAllFiles();
  // await AsyncStorage.clear();
  console.log('\nBeverageList Contract Address: %s\n', address.toString());
  deployedInstance = new _web3.eth.Contract(JSON.parse(abi), address.toString());
  web3 = _web3;
  console.log('startBvgl deployedInstance: ', deployedInstance);
}

async function setDrinkData(_drink, address) {
  const gasAmount = await setDrinkDataGasEstimate(address);
  const time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
  const weekday = fromAscii(days[new Date().getDay()]);
  const drink = fromAscii(_drink);

  await execCachedTransactions(address);

  return writeToBchain({
    address, time, drink, weekday,
  }, gasAmount);
}
let cnt = 0;

async function writeToBchain(drinkdata, gasAmount) {
  const {
    address, time, drink, weekday,
  } = drinkdata;

  return new Promise((resolve, reject) => web3.eth.net.isListening()
    .then(async () => {
      if (cnt <= 1) {
        // await storeData(`${address}-${time}`, drinkdata);
        await createFile(`${address}-${time}`, drinkdata);

        const keys = await getAllFiles();
        console.log('getAllFiles: ', keys);
        cnt++;
        return resolve();
      }
      const tmout = setTimeout(() => {
        throw new Error();
      }, 5000);
      return deployedInstance.methods
        .setDrinkData(fromAscii(time), drink, weekday)
        .send({
          from: address,
          gas: gasAmount,
        })
        .on('transactionHash', (hash) => {
          console.log('hash: ', hash);
        })
        .on('receipt', (receipt) => {
          printEvent(receipt);
          console.log('Starting over');
          clearTimeout(tmout);
          resolve();
        })
        .on('error', (err) => {
          console.log('setDrinkData error: ', err);
        });
    }))
    .catch(async (e) => {
      console.log('NOT listening');
      // await storeData(`${address}-${time}`, drinkdata);
      await createFile(`${address}-${time}.json`, drinkdata);
    });
}

function filterLocalFiles(allFiles, address) {
  return allFiles
    .reduce((acc, key) => {
      const adrs = extractAddress(key.path);

      console.log('adrs: ', adrs, key.path);

      // await removeFile(key.path);
      if (adrs === address /* && key.includes('-') */) {
        acc.push(key.path);
      }
      return acc;
    }, [])
    .sort(SortAsc);
}

function extractAddress(str) {
  return getFileName(str).split('-').shift();
}

function getFileName(str) {
  const path = str.split('/').pop();
  const encodedFilename = atob(path.split('.').shift());
  return encodedFilename;
}


async function execCachedTransactions(address) {
  const keys = await getAllFiles();
  console.log('getAllFiles: ', keys);
  const usrKeys = filterLocalFiles(keys, address);
  console.log('filterLocalFiles: ', usrKeys);

  /*  const usrKeys = keys
    .reduce((acc, key) => {
      const adrs = key.split('-').shift();
      if (adrs === address && key.includes('-')) {
        acc.push(key);
      }
      return acc;
    }, [])
    .sort(SortAsc); */

  console.log('usrKeys: ', usrKeys);
  if (cnt <= 1) return;

  for (const key of usrKeys) {
    await execTransaction(key, address);
  }
}

function SortAsc(key1, key2) {
  const fn1 = getFileName(key1);
  const fn2 = getFileName(key2);
  const newkey1 = fn1.split('-');
  newkey1.shift();
  newkey1.join('-');

  const newkey2 = fn2.split('-');
  newkey2.shift();
  newkey2.join('-');

  const date1 = moment(newkey1, 'YYYY-MM-DDTHH:mm:ss').toDate();
  const date2 = moment(newkey2, 'YYYY-MM-DDTHH:mm:ss').toDate();

  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
}

async function storeData(key, val) {
  try {
    console.log('storeData key: ', key);
    await AsyncStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // saving error
    console.log('error on saving to keystorage', e);
  }
}

async function execTransaction(key, address) {
  try {
    console.log('execTransaction(key): ', key);
    // const value = await AsyncStorage.getItem(key);
    /* if (value !== null || false) {
      const gasAmount = await setDrinkDataGasEstimate(address);
      const {
        address, time, drink, weekday,
      } = JSON.parse(value);
      await writeToBchain({
        address, time, drink, weekday,
      }, gasAmount);
      await removeValue(key);

      await deleteFile(key);
    } else { */
    const fileVals = await readFile(key);
    const gasAmount = await setDrinkDataGasEstimate(address);
    // console.log('address, time, drink, weekday,: ', address, time, drink, weekday);
    await writeToBchain(fileVals, gasAmount);
    await removeFile(key);
    /* } */
  } catch (e) {
    console.log('e: ', e);
    // error reading value
  }
}

async function getAllKeys() {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (e) {
    // read key error
  }
  return [];
}


async function removeValue(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }

  console.log('Done.');
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

module.exports = {
  startBvgl,
  setDrinkData,
  getAllKeys,
  execTransaction,
};
