/** @format */

import { AppRegistry } from 'react-native';
import './global';
import App from './App';
import { name as appName } from './app.json';
import { createFile } from './file-logging/logger';

try {
  AppRegistry.registerComponent(appName, () => App);
} catch (error) {
  createFile('app-error', error);
  console.log(error);
}
