import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.horizon.tnd',
  appName: 'Ôn thi đường thủy',
  webDir: 'public',
  android: {
    path: '../tnd-android'
  },
  server: {
    url: 'https://daotaothuyenvien.com/ontap',
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
