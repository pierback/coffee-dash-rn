import Web3 from 'web3';
import { startCC } from './cffcn';
import { startBvgl } from './bvrglst';
import { getServerIP } from './udp';

const web3 = new Web3();

(async function main() {
  const ip = await getServerIP();
  console.log('ip: ', ip);
  web3.setProvider(new web3.providers.WebsocketProvider(`ws://${ip}:8546`));
  const downloadIP = `http://${ip}:9090/files`;

  this.fetch(`${downloadIP}/cc.json`)
    .then(response => response.json())
    .then(({ address, abi }) => {
      startCC(web3, address, abi);
    });

  this.fetch(`${downloadIP}/bvgl.json`)
    .then(response => response.json())
    .then(({ address, abi }) => {
      startBvgl(web3, address, abi);
    });
}());
