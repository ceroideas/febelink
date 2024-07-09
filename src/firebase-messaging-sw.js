// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('../firebase-messaging-sw.js')
//   .then(function(registration) {
//     console.log('Registration successful, scope is:', registration.scope);
//   }).catch(function(err) {
//     console.log('Service worker registration failed, error:', err);
//   });
// }



importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
  apiKey: "AIzaSyDbYXGGXYL21-NK-Ob8bNZAY-jcVwx4-7s",
  authDomain: "febelink-app.firebaseapp.com",
  databaseURL: "https://febelink-app.firebaseio.com",
  projectId: "febelink-app",
  storageBucket: "febelink-app.appspot.com",
  messagingSenderId: "939891417028",
  appId: "1:939891417028:web:fc2479f6487c6fd4afce91",
  measurementId: "G-LL020HEJ1L"
});
const messaging = firebase.messaging();