import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCidQSnCyIfGFdUsZpeVavNoOJXPhRkG_4",
  authDomain: "notifications-eszut.firebaseapp.com",
  projectId: "notifications-eszut",
  storageBucket: "notifications-eszut.appspot.com",
  messagingSenderId: "948034757169",
  appId: "1:948034757169:web:6416a993eb0ff8d1b9ab10",
  measurementId: "G-W1TNZR86YV"
};

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const app = initializeApp(firebaseConfig);

      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey:
          "BCKNSY0FAgDlbgevvqBGsXdadLiRCrFR1wbWXqFYgQJOV3jX8nTSHAQzXcB91c6GGlmFwCfCcxCUK_UxDL7nTLA",
      }).then((currentToken) => {
        if (currentToken) {
          console.log("currentToken: ", currentToken);
        } else {
          console.log("Can not get token");
        }
      });
    } else {
      console.log("Do not have permission!");
    }
  });
}

requestPermission();