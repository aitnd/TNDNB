import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onthi.duongthuy',
  appName: 'Ôn thi đường thủy',
  webDir: 'public',
  server: {
    url: 'https://daotaothuyenvien.com',
    cleartext: true,
    allowNavigation: ['daotaothuyenvien.com', '*.daotaothuyenvien.com', 'daotaothuyenvien.com/*']
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      overlaysWebView: true,
      style: 'DARK'
    }
  }
};

export default config;
