if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/eszut/service-worker.js', {
        scope: '/eszut/'
      })
      .then(registration => {
        console.log('Service Worker zarejestrowany:', registration);
      })
      .catch(error => {
        console.log('Błąd podczas rejestracji Service Workera:', error);
      });
  }