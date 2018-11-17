import SwipeNavigator from 'react-native-swipe-navigation'; // 1.0.0-beta
import { Platform } from 'react-native';
import Map from './Map';
import OverallConsumption from './OverallConsumption';
import UserConsumption from './UserConsumption';
import GetUserData from '../getUserData';
import InsertCoffee from '../insertCoffee';

const Web3 = require('web3');

const web3 = new Web3();

Platform.OS === 'ios'
  ? web3.setProvider(new web3.providers.WebsocketProvider('ws://127.0.0.1:8545'))
  : web3.setProvider(new web3.providers.WebsocketProvider('ws://10.0.2.2:8545'));

/* const Login = require('./routes/login');
const Register = require('./routes/register');
const InserCoffee = require('./routes/insertCoffee');  */

web3.eth.personal.unlockAccount('0x02e9f84165314bb8c255d8d3303b563b7375eb61', '0000', 10000);
const abi = [{
  constant: true, inputs: [], name: 'userCount', outputs: [{ name: 'count', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: false, inputs: [{ name: '_email', type: 'bytes32' }, { name: '_ethAddress', type: 'address' }], name: 'insertUser', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
  constant: false, inputs: [{ name: '_email', type: 'bytes32' }, { name: '_size', type: 'uint8' }, { name: '_strength', type: 'uint8' }], name: 'insertCoffee', outputs: [], payable: true, stateMutability: 'payable', type: 'function',
}, {
  constant: false, inputs: [{ name: '_address', type: 'address' }], name: 'setTestAddress', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
  constant: true, inputs: [{ name: '_email', type: 'bytes32' }], name: 'getUser', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [], name: 'ready', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [{ name: '_size', type: 'uint8' }, { name: '_strength', type: 'uint8' }], name: 'getOverallCoffeeCnt', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [{ name: '_email', type: 'bytes32' }, { name: '_size', type: 'uint8' }, { name: '_strength', type: 'uint8' }], name: 'getUserCoffeeCnt', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [], name: 'getTestAddress', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
}];
const deployedInstance = new web3.eth.Contract(abi, '0xab37fd5b395e8acaa7c0c7009f6a1f193eb03dba');
const userData = new GetUserData(web3, deployedInstance);
const insertCoffee = new InsertCoffee(web3, deployedInstance);

global.userData = userData;
global.insertCoffee = insertCoffee;

const Navigator = SwipeNavigator({
  Map: {
    screen: Map,
    left: 'OverallConsumption',
    right: 'UserConsumption',
  },

  UserConsumption: {
    screen: UserConsumption,
    type: 'over',
  },

  OverallConsumption: {
    screen: OverallConsumption,
    type: 'over',
  },
});

export default Navigator;
