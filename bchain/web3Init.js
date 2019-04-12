import Web3 from 'web3';
import { NetworkInfo } from 'react-native-network-info';
import { startCC } from './cffcn';
import { startBvgl } from './bvrglst';
import { getServerIP } from './udp';

const web3 = new Web3();

let prevCCAddress;
let prevBvgrlAddress;
let downloadIP;

async function initWeb3() {
  // const ip = 'oc-appsrv01.informatik.uni-augsburg.de';// await determineIP();
  const ip = '192.168.188.23';
  // const ip = await determineIP();

  downloadIP = `http://${ip}:9090/files`;

  return web3.eth.net
    .isListening()
    .catch(() => {
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

async function determineIP() {
  // return "oc-appsrv01.informatik.uni-augsburg.de"
  return new Promise((resolve) => {
    // resolve("oc-appsrv01.informatik.uni-augsburg.de");
    NetworkInfo.getSSID((ssid) => {
      if (ssid === 'eduroam') {
        resolve('oc-appsrv01.informatik.uni-augsburg.de');
      } else {
        resolve(getServerIP());
      }
    });
  });
}

module.exports = {
  checkNewDeployment,
  initWeb3,
};
