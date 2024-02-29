// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  /*
    baseWebUrl: 'https://api.febelink.com/',
    API_URL: 'https://api.febelink.com/api/',
    API_URL_AUTH: 'https://api.febelink.com/api/auth/',

    baseWebUrl: 'http://apitest.febelink.com/',
    API_URL: 'http://apitest.febelink.com/api/',
    API_URL_AUTH: 'http://apitest.febelink.com/api/auth/',
   */

  baseWebUrl: 'http://localhost/',
  API_URL: 'http://localhost/api/',
  API_URL_AUTH: 'http://localhost/api/auth/',

  // baseWebUrl: 'http://192.168.0.31/',
  // API_URL: 'http://192.168.0.31/api/',
  // API_URL_AUTH: 'http://192.168.0.31/api/auth/',


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
  HOME_PAGE: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
