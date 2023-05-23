document.addEventListener('DOMContentLoaded', init, false);

function init() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => {
          console.log('Service worker registered -->', reg);
        })
        .catch((err) => {
          console.error('Service worker not registered -->', err);
        });
    });
  }
}
