import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onthi.duongthuy',
  appName: 'ÔN thi đường thủy',
  webDir: 'public',
  server: {
    url: 'http://daotaothuyenvien.com',
    cleartext: true,
    allowNavigation: ['daotaothuyenvien.com', '*.daotaothuyenvien.com', 'daotaothuyenvien.com/*']
  }
};

export default config;
