(()=>{"use strict";const e="userData";console.log("hello from login.js"),function(){const o=window.location.search,a=new URLSearchParams(o);console.log("starting saveQueryParamsToUserData");const s=a.get("accessToken"),n=a.get("refreshToken"),r=a.get("expiresAt"),l=a.get("email"),t=a.get("displayName");s||console.log("failed to parse accessToken from params"),n||console.log("failed to parse refreshTokenfrom params"),r||console.log("failed to parse expiresAt from params"),l||console.log("failed to parse email from params"),t||console.log("failed to parse displayName from params"),function({accessToken:o,refreshToken:a,expiresAt:s,email:n,displayName:r}){console.log("updatingUserData");const l=function(){console.log("getting userData from localStorage");const o=window.localStorage.getItem(e);if(!o)return console.log("could not find userData in local storage, returning undefined"),{accessToken:void 0,refreshToken:void 0,expiresAt:void 0,email:void 0,displayName:void 0};const a=JSON.parse(o);return console.log("userData pulled from localStorage: ",a),console.log("returning from getUserData"),a}();o&&(l.accessToken=o),a&&(l.refreshToken=a),s&&(l.expiresAt=s),n&&(l.email=n),r&&(l.displayName=r),console.log("updating localStorage userData to ",l),window.localStorage.setItem(e,JSON.stringify(l))}({accessToken:s,refreshToken:n,expiresAt:r,email:l,displayName:t}),console.log("exiting saveQueryParamsToUserData")}(),console.log("exiting login.js"),window.location.replace(function(e){const o=window.location.href.toString();console.log(`originURL: ${o}`);const a=o.split(e)[0];return console.log(`newURL: ${a}`),a}("/login"))})();