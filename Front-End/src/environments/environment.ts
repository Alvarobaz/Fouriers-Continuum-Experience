// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Desarrollo local: apunta directo al backend.
// IMPORTANTE: debe terminar en '/' porque el interceptor concatena:
//   reqUrl + req.url  →  'http://localhost:9096/api/' + 'issues/user/1'
// Si falta la '/', queda '.../apiissues/user/1'

export const environment = {
  production: false,
  apiBaseUrl :'http://localhost:9096/api/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
