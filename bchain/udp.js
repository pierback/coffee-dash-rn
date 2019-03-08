const dgram = require('react-native-udp');

const socket = dgram.createSocket({ type: 'udp4', reuseAddr: false });
const MULTICAST_ADDR = '239.0.0.0';
const PORT = 9999;

socket.bind(PORT, MULTICAST_ADDR);

socket.once('listening', () => {
  socket.addMembership(MULTICAST_ADDR);
});

async function getServerIP() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('192.168.178.34');
    }, 3000);
    socket.on('message', (message, rinfo) => {
      console.info(`Message from: ${rinfo.address}:${rinfo.port} - ${message}`);
      if (message) {
        socket.close();
      }
      return resolve(message);
    });
  });
}

module.exports = { getServerIP };
