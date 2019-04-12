import AsyncStorage from '@react-native-community/async-storage';
import { NetInfo } from 'react-native';
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
  let gasAmount;
  let time;
  let weekday;
  let drink;

  try {
    gasAmount = await setDrinkDataGasEstimate(address);
    time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    weekday = fromAscii(days[new Date().getDay()]);
    drink = fromAscii(_drink);

    await execCachedTransactions(address);

    writeToBchain({
      address, time, drink, weekday,
    }, gasAmount);
  } catch (error) {
    return Promise.resolve();
  }
}

async function writeToBchain(drinkdata, gasAmount) {
  const {
    address, time, drink, weekday,
  } = drinkdata;

  const path = await createFile(`${address}-${time}.json`, drinkdata);
  const isConnected = await NetInfo.isConnected.fetch();

  if (!isConnected) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => web3.eth.net.isListening()
    .then(async () => {
      const tmout = setTimeout(() => {
        resolve();
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
        .on('receipt', async (receipt) => {
          printEvent(receipt);
          console.log('Starting over');
          await removeFile(path);
          clearTimeout(tmout);
          resolve();
        })
        .on('error', (err) => {
          resolve();
          console.log('setDrinkData error: ', err);
        });
    }))
    .catch(e => Promise.resolve());
}


async function execCachedTransactions(address) {
  const keys = await getAllFiles();
  const usrKeys = filterLocalFiles(keys, address);
  console.log('filterLocalFiles: ', usrKeys);

  for (const key of usrKeys) {
    await execTransaction(key, address);
  }
}

function filterLocalFiles(allFiles, address) {
  return allFiles
    .reduce((acc, key) => {
      const adrs = extractAddress(key.path);

      console.log('adrs: ', adrs, key.path);

      if (adrs === address) {
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


async function execTransaction(key, address) {
  try {
    const fileVals = await readFile(key);
    const gasAmount = await setDrinkDataGasEstimate(address);
    await writeToBchain(fileVals, gasAmount);
    await removeFile(key);
  } catch (e) {
    console.log('e: ', e);
  }
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
    const tmout = setTimeout(() => {
      resolve();
    }, 5000);

    deployedInstance.methods
      .setDrinkData(time, drink, weekday)
      .estimateGas({ from: address })
      .then(gasAmount => resolve(gasAmount))
      .catch((error) => {
        console.log('error: ', error);
        clearTimeout(tmout);
        resolve();
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

async function storeData(key, val) {
  try {
    console.log('storeData key: ', key);
    await AsyncStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // saving error
    console.log('error on saving to keystorage', e);
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

module.exports = {
  startBvgl,
  setDrinkData,
  getAllKeys,
  execTransaction,
};
