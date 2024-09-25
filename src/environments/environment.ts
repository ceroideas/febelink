// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

    baseWebUrlWsrv: 'https://wsrv.nl?url=',

  
    baseWebUrl: 'https://api.febelink.com/',
    API_URL: 'https://api.febelink.com/api/',
    API_URL_AUTH: 'https://api.febelink.com/api/auth/',
/*
    baseWebUrl: 'http://apitest.febelink.com/',
    API_URL: 'http://apitest.febelink.com/api/',
    API_URL_AUTH: 'http://apitest.febelink.com/api/auth/',
   */

  // baseWebUrl: 'http://localhost/',
  // API_URL: 'http://localhost/api/',
  // API_URL_AUTH: 'http://localhost/api/auth/',

    // baseWebUrl: 'http://192.168.0.31/',
    // API_URL: 'http://192.168.0.31/api/',
    // API_URL_AUTH: 'http://192.168.0.31/api/auth/',

    DOOFINDER_BASE_URL: 'https://eu1-search.doofinder.com/6/',
    DOOFINDER_HASHID: '72a38bd66f322e35fa2c168a48117d02',
    DOOFINDER_API_KEY: 'eu1-eb36910de5a685bff32fd906a8e4ffe2ce4f031a',


  SOCKET_URL: 'http://localhost:3425/',

  WEB_CLIENT_ID:
    '939891417028-okph50b82lar7ftt6sivk6h441p6gm1d.apps.googleusercontent.com',
  FACEBOOK_ID: '895023747604792',
  WEB_URL: 'http://localhost/',
  stripe_publick_key: 'pk_test_9BatjAPV71ZLV0LLXxtvgMaT00zyRzltzM',

  // GooglePlaces API
  G_PLACES_API_KEY: 'AIzaSyB-s7c6IF_G7k30a0kxWFgM21PDy_dSSCs',

  // Store Urls
  GOOGLE_STORE: 'https://play.google.com/store/apps/details?id=com.xerintel.febelink54831',
  APP_STORE: 'https://febelink.us19.list-manage.com/track/click?u=2c62737fce42bba9ebb2f5d05&id=f9ee5da0af&e=45535eea63',

  // KYC Alice Token
  KYC_SELFIE: true,

  // Initial Page
  HOME_PAGE: '',

  FIREBASE_CONFIG: {
    apiKey: "AIzaSyDbYXGGXYL21-NK-Ob8bNZAY-jcVwx4-7s",
    authDomain: "febelink-app.firebaseapp.com",
    databaseURL: "https://febelink-app.firebaseio.com",
    projectId: "febelink-app",
    storageBucket: "febelink-app.appspot.com",
    messagingSenderId: "939891417028",
    appId: "1:939891417028:web:fc2479f6487c6fd4afce91",
    measurementId: "G-LL020HEJ1L"
  },
  FIREBASE_VAPID_KEY: 'BEiWoNPviKxsd2vXNfwP-N99b9EAaOfJSV9P-6894BcZwIdz_E4XUNVbaHbwoo21i3E2Q8b1RWwAQfv5fNGDirU',

  xiltec_ai_url: 'https://ai-febelink.xiltec.es',
  xiltec_ai_key: '4cd46e5a-fc09-4e66-af93-7be675869ea5',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
