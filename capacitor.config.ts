import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ontap.tnd',
  appName: 'Ôn Tập TND',
  webDir: 'public',
  server: {
    url: 'http://daotaothuyenvien.com',
    cleartext: true
  }
};

export default config;
