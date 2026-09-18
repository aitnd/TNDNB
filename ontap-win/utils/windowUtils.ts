export const toggleFullscreen = () => {
  if ((window as any).electron) {
    (window as any).electron.invoke('toggle-fullscreen');
  } else if (document.documentElement.requestFullscreen) {
    // Fallback cho Web
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
};
