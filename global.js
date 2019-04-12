// Inject node globals into React Native global scope.
import { decode, encode } from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

global.Buffer = require('buffer').Buffer;
global.process = require('process');
