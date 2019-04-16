import Web3 from 'web3';
import { NetworkInfo } from 'react-native-network-info';
import { startCC, payCoffee, payMate, payWater } from './cffcn';
import { startBvgl, setDrinkData } from './bvrglst';
import { getServerIP } from './udp';

let web3 = new Web3();
const ip = '192.168.52.214';
// const ip = await getServerIP();


let prevCCAddress;
let prevBvgrlAddress;
let downloadIP;

downloadIP = `http://${ip}:9090/files`;
web3.setProvider(new web3.providers.WebsocketProvider(`ws://${ip}:8546`));

async function initWeb3() {
  // const ip = 'oc-appsrv01.informatik.uni-augsburg.de';
  // const ip = '10.0.2.2';
  // const ip = '192.168.52.214';
  // const ip = await getServerIP();
  // downloadIP = `http://${ip}:9090/files`;

  return web3.eth.net
    .isListening()
    .catch(() => {
      web3 = new Web3();
      web3.setProvider(new web3.providers.WebsocketProvider(`ws://${ip}:8546`));
    });
}

async function checkNewDeployment() {
  return web3.eth.net
    .isListening()
    .then(async () => {
      await loadCC();
      await loadBvgrl();
    });
}

async function loadCC() {
  const response = await fetch(`${downloadIP}/cc.json`);
  const { address, abi } = await response.json();
  console.log('prevCCAddress: ', address, prevCCAddress);
  if (address !== prevCCAddress) {
    startCC(web3, address, abi);
    prevCCAddress = address;
  }
}

async function loadBvgrl() {
  const response = await fetch(`${downloadIP}/bvgl.json`);
  const { address, abi } = await response.json();
  console.log('address prevBvgrlAddress: ', address, prevBvgrlAddress);
  if (address !== prevBvgrlAddress) {
    startBvgl(web3, address, abi);
    prevBvgrlAddress = address;
  }
}

async function Drink(drink, address) {
  await setDrinkData(drink, address);
  return {
    mate: payMate,
    coffee: payCoffee,
    water: payWater,
  }[drink](address);
}

module.exports = {
  checkNewDeployment,
  initWeb3,
  Drink,
};
