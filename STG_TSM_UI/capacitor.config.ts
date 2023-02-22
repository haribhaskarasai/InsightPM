import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'STG-TSM',
  webDir: 'www',
  bundledWebRuntime: false,
  server:{
    url:'http://172.16.2.88:4200'
  }
};

export default config;
