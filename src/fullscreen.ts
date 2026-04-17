export async function requestAppFullscreen(element: HTMLElement = document.documentElement) {
  if (!document.fullscreenElement && element.requestFullscreen) {
    await element.requestFullscreen();
  }
}

export async function exitAppFullscreen() {
  if (document.fullscreenElement && document.exitFullscreen) {
    await document.exitFullscreen();
  }
}

export async function toggleAppFullscreen(element: HTMLElement = document.documentElement) {
  if (document.fullscreenElement) {
    await exitAppFullscreen();
  } else {
    await requestAppFullscreen(element);
  }
}
