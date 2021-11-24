// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
/*
  baseWebUrl: 'https://api.febelink.com/',
  API_URL: 'https://api.febelink.com/api/',
  API_URL_AUTH: 'https://api.febelink.com/api/auth/',
  SOCKET_URL: 'https://febelink-chat.herokuapp.com/',
 */ 
  
  baseWebUrl: "http://localhost/",
  API_URL: "http://localhost/api/",
  API_URL_AUTH: "http://localhost/api/auth/",
  SOCKET_URL: 'https://febelink-chat.herokuapp.com/',
 

  WEB_CLIENT_ID:
    "939891417028-okph50b82lar7ftt6sivk6h441p6gm1d.apps.googleusercontent.com",
  FACEBOOK_ID: "895023747604792",
  WEB_URL:'http://localhost/',
  stripe_publick_key:'pk_test_9BatjAPV71ZLV0LLXxtvgMaT00zyRzltzM',

  // GooglePlaces API
  G_PLACES_API_KEY: 'AIzaSyB-s7c6IF_G7k30a0kxWFgM21PDy_dSSCs',

  // Store Urls
  GOOGLE_STORE: 'https://play.google.com/store/apps/details?id=com.xerintel.febelink54831',
  APP_STORE: 'https://febelink.us19.list-manage.com/track/click?u=2c62737fce42bba9ebb2f5d05&id=f9ee5da0af&e=45535eea63',

  // KYC Alice Token
  KYC_TOKEN: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJpc3N1ZXItc2FuZGJveCIsInR5cCI6IlNBTkRCT1giLCJleHAiOjE2NDI5MjkzNjAsImlhdCI6MTYzNzc0NTM2MCwiY2xpIjoiZmViZWxpbmstZGV2In0.Clzkpz19wEXnbkjsVtPwUceOd09hMVMy7sBGaaz9chcMESkuZ1VfFvIlp-gedt79vZ67rIJ7XHskjZdjEnFyUN0rc-TaV9XRodBIGGbbfq8-LDjjpzAVKvILH8lguHqQQXoT9LNppmxC9OYFbqkhuTeaS1p2FISdgYBHe8DFMmoAdu7M7x8KNAgGbfJ5jZ4NAgl1dGoESnBaBmyj_oRQhL9u-PsUHZpDrmpTyRLTD3Fwuzyq6YMFEQE7EG1YSGMBTLkVvFVXQjDaXO7L_-RFUDS2Idy5UCFKnAL97f2qH0tvA6hA0A1Ki2Hi8sHvHhJ7VLnz5U5UyIXWm9H0F3f01g'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
