const publicVapidKey = "BE241iRGC1IYJjmIPznjWwJJk9WoFRMEyJ9wgTeknV5FANkDbm2v6593em151JiMejTUBgOIcinHAV6e2zCeSXg";

if ("serviceWorker" in navigator) {
    send().catch((err) => console.error(err));
}

async function send() {
    const register = await navigator.serviceWorker.register("/eszut/worker.js", {
        scope: "/eszut/",
    });
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    await fetch("/eszut/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json",
        },
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
