/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { NetInfo } from 'react-native';
import {
  readFile,
  createFile,
  getAllFiles,
  removeFile,
  removeAllFiles,
} from '../file-logging/logger';

const moment = require('moment');
const { fromAscii, hexToString } = require('web3-utils');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let web3;
let deployedInstance;

async function startBvgl(_web3, address, abi) {
  // removeAllFiles();
  console.log('\nBeverageList Contract Address: %s\n', address.toString());
  deployedInstance = new _web3.eth.Contract(JSON.parse(abi), address.toString());
  web3 = _web3;
  console.log('startBvgl deployedInstance: ', deployedInstance);
}

async function setDrinkData(_drink, address) {
  try {
    const time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    const weekday = fromAscii(days[new Date().getDay()]);
    const drink = fromAscii(_drink);
    const gasAmount = await setDrinkDataGasEstimate({ address, time, weekday, drink });

    await execCachedTransactions(address);

    return writeToBchain({ address, time, drink, weekday }, gasAmount);
  } catch (error) {
    return Promise.resolve();
  }
}

async function writeToBchain(drinkdata, gasAmount) {
  const { address, time } = drinkdata;
  const path = await createFile(`${address}-${time}.json`, drinkdata);
  const isConnected = await NetInfo.isConnected.fetch();
  console.log('isConnected: ', isConnected);

  return !isConnected
    ? Promise.resolve()
    : web3.eth.net.isListening()
      .then(async () => {
        await callSmartContract(drinkdata, gasAmount, path);
      })
      .catch(Promise.resolve);
}

async function callSmartContract(drinkdata, gasAmount, path) {
  const { address, time, drink, weekday } = drinkdata;

  return new Promise((resolve) => {
    const tmout = setTimeout(() => {
      resolve();
    }, 5000);

    return deployedInstance.methods
      .setDrinkData(fromAscii(time), drink, weekday)
      .send({ from: address, gas: gasAmount })
      .on('receipt', async (receipt) => {
        printEvent(receipt);
        await removeFile(path);
        clearTimeout(tmout);
        resolve();
      })
      .on('error', (err) => {
        resolve();
        console.log('setDrinkData error: ', err);
      });
  });
}


async function execCachedTransactions(address) {
  const keys = await getAllFiles();
  const usrFiles = filterLocalFiles(keys, address);
  console.log('\n filterLocalFiles:', usrFiles);

  for (const filePath of usrFiles) {
    const adrs = address || extractAddress(filePath);
    await execTransaction(filePath, adrs);
  }
}

async function execTransaction(path, address) {
  try {
    const fileVals = await readFile(path);
    const gasAmount = await setDrinkDataGasEstimate({ address, ...fileVals });
    await callSmartContract(fileVals, gasAmount, path);
  } catch (e) {
    console.log('e: ', e);
  }
}

async function setDrinkDataGasEstimate({ address, time, weekday, drink }) {
  return new Promise((resolve) => {
    deployedInstance.methods
      .setDrinkData(fromAscii(time), drink, weekday)
      .estimateGas({ from: address })
      .then(gasAmount => resolve(gasAmount))
      .catch((error) => {
        console.log('error: ', error);
        resolve();
      });
  });
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

function filterLocalFiles(allFiles, address) {
  return allFiles
    .reduce((acc, key) => {
      // push only userspecific files
      if (address) {
        const adrs = extractAddress(key.path);
        if (adrs === address) {
          acc.push(key.path);
        }
      } else {
        // no address push all files with usr name in it
        const fileName = getFileName(key.path);
        if (fileName.includes('-')) {
          acc.push(key.path);
        }
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

// eslint-disable-next-line no-unused-vars
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
  execTransaction,
  execCachedTransactions,
};
