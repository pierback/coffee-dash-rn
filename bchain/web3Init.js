import Web3 from "web3";
import { startCC } from "./cffcn";
import { startBvgl } from "./bvrglst";
import { getServerIP } from "./udp";
import { NetworkInfo } from "react-native-network-info";

const web3 = new Web3();

let prevCCAddress;
let prevBvgrlAddress;
let downloadIP;

async function initWeb3() {
  const ip = await determineIP();
  console.log("ip: ", ip);
  web3.setProvider(new web3.providers.WebsocketProvider(`ws://${ip}:8546`));
  downloadIP = `http://${ip}:9090/files`;

  await checkNewDeployment()
}

async function checkNewDeployment() {
  await loadCC();
  await loadBvgrl();
}

async function loadCC() {
  const response = await fetch(`${downloadIP}/cc.json`);
  const { address, abi } = await response.json();
  console.log("prevCCAddress: ", address, prevCCAddress);
  if (address !== prevCCAddress) {
    startCC(web3, address, abi);
    prevCCAddress = address;
  }
}

async function loadBvgrl() {
  const response = await fetch(`${downloadIP}/bvgl.json`);
  const { address, abi } = await response.json();
  console.log("address prevBvgrlAddress: ", address, prevBvgrlAddress);
  if (address !== prevBvgrlAddress) {
    startBvgl(web3, address, abi);
    prevBvgrlAddress = address;
  }
}

async function determineIP() {
  return new Promise(resolve => {
    NetworkInfo.getSSID(ssid => {
      if (ssid === "eduroam") {
        resolve("oc-appsrv01.informatik.uni-augsburg.de");
      } else {
        resolve(getServerIP());
      }
    });
  });
}

module.exports = {
  checkNewDeployment,
  initWeb3
};
