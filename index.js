import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

function registerRootComponent(component) {
  AppRegistry.registerComponent('main', () => component);
}

registerRootComponent(App);
