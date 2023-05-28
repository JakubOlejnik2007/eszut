if ("serviceWorker" in navigator) {
    try{
        navigator.serviceWorker
        .register("/eszut/service-worker.js", {
            scope: "/eszut/",
        })
        .then((registration) => {

            if (window.location.pathname === "/eszut/dashboard") {
            }
        })
        .catch((error) => {
        });
    } catch (error){
        
    }
    
}
