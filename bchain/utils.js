const fs = require('fs');
const path = require('path');

const appDir = path.dirname(require.main.filename);
const { bytesToHex } = require('web3-utils');

async function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      err ? reject() : resolve(data);
    });
  });
}

function getAppDir() {
  return appDir;
}

async function getBchainIp() {
  const bchainIp = path.join(appDir, '..', 'private-net-docker', 'bchainIp');
  return await readFileAsync(bchainIp);
}
module.exports = {
  readFileAsync,
  getBchainIp,
  getAppDir,
};
