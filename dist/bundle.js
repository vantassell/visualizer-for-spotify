/*! For license information please see bundle.js.LICENSE.txt */
(()=>{"use strict";function e(e){for(var o=1;o<arguments.length;o++){var t=arguments[o];for(var n in t)e[n]=t[n]}return e}var o=function o(t,n){function r(o,r,s){if("undefined"!=typeof document){"number"==typeof(s=e({},n,s)).expires&&(s.expires=new Date(Date.now()+864e5*s.expires)),s.expires&&(s.expires=s.expires.toUTCString()),o=encodeURIComponent(o).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var i="";for(var c in s)s[c]&&(i+="; "+c,!0!==s[c]&&(i+="="+s[c].split(";")[0]));return document.cookie=o+"="+t.write(r,o)+i}}return Object.create({set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var o=document.cookie?document.cookie.split("; "):[],n={},r=0;r<o.length;r++){var s=o[r].split("="),i=s.slice(1).join("=");try{var c=decodeURIComponent(s[0]);if(n[c]=t.read(i,c),e===c)break}catch(e){}}return e?n[e]:n}},remove:function(o,t){r(o,"",e({},t,{expires:-1}))},withAttributes:function(t){return o(this.converter,e({},this.attributes,t))},withConverter:function(t){return o(e({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(n)},converter:{value:Object.freeze(t)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"});let t,n=INITIAL_POLLING_INTERVAL,r=!1;console.log("starting main.js"),function(){const e=window.location.search,t=new URLSearchParams(e);console.log("starting queryParamsIntoCookies");const n=t.get("accessToken"),r=t.get("refreshToken"),s=t.get("expiresAt"),i=t.get("email"),c=t.get("displayName");n&&(console.log("trying to set accessToken cookie"),o.set("accessToken",n)),r&&(console.log("trying to set refreshToken cookie"),o.set("refreshToken",r)),s&&(console.log("trying to set expiresAt cookie"),o.set("expiresAt",s)),i&&(o.set("email",i),console.log("trying to set email cookie")),c&&(console.log("trying to set displayName cookie"),o.set("displayName",c)),2===LOGGING_LEVEL&&(console.log(`accessToken: ${o.get("accessToken")}`),console.log(`refreshToken: ${o.get("refreshToken")}`),console.log(`expiresAt: ${o.get("expiresAt")}`),console.log(`email: ${o.get("email")}`),console.log(`displayName: ${o.get("displayName")}`),console.log("exiting queryParamsIntoCookies"))}();const s=o.get("accessToken"),i=document.querySelector(".sign-in"),c=document.querySelector(".spotifyLogoContainer"),l=document.getElementById("sign-out");navigator.serviceWorker&&console.log("supports service workers!"),s?(console.log(`signed in with accessToken: ${s}`),i&&(i.style.display="none"),c&&(c.style.display="flex"),l&&l.addEventListener("click",(()=>{console.log("signout clicked"),t&&clearTimeout(t),document.querySelector(".trackInfo").innerHTML="",document.querySelector(".artworkContainer").innerHTML="",console.log("clearing cookies and resetting path"),o.remove("accessToken"),o.remove("refreshToken"),o.remove("expiresAt"),o.remove("email"),o.remove("displayName"),console.log("cleared cookies, testing now"),console.log(`all Cookies: ${JSON.stringify(o.get())}`),console.log(`accessToken: ${o.get("accessToken")}`),console.log(`expiresAt: ${o.get("expiresAt")}`),console.log("exiting cookies and resetting path"),window.location.search="",r=!1})),r=!0,function e({prevTitle:s,prevArtist:i,prevAlbum:c}){console.log("polling api"),setTimeout((async()=>{if(!r)return;const{title:l,artist:a,album:g,artworkURL:u,error:p}=await async function(){2===LOGGING_LEVEL&&console.log("starting getCurrentTrackFromSpotify");const e=(r={accessToken:o.get("accessToken"),refreshToken:o.get("refreshToken")},Object.keys(r).map((e=>encodeURIComponent(e)+"="+encodeURIComponent(r[e]))).join("&")),t=`${API_PLAYERS_URL}?${e}`;var r;2===LOGGING_LEVEL&&console.log(`query: ${t}`);const s=await fetch(t).catch((e=>{console.log(`ERROR failed fetch !!!\nError: ${JSON.stringify(e)}`)}));if(!s)return void console.log("response from api was undefined");if(!s.ok){const e=`An error occurred: ${s.statusText}`;return void console.log(`no response from server, tell AVT!\t${e}`)}const{title:i,artist:c,album:l,artworkURL:a,backOff:g,newAccessToken:u,newExpiresAt:p}=await s.json();return g?n*=2:n=INITIAL_POLLING_INTERVAL,u&&(o.set({name:"accessToken",value:u,path:"/"}),console.log(`updated accessToken to: ${u}`)),p&&(o.set({name:"expiresAt",value:p,path:"/"}),console.log(`updated expiredAt to: ${p}`)),2===LOGGING_LEVEL&&console.log("exiting getCurrentTrackFromSpotify"),{title:i,artist:c,album:l,artworkURL:a,error:void 0}}();p&&console.log(`ERROR getting currentTrack: ${p}`),l===s&&a===i&&g===c||function({title:e,artist:o,album:t,artworkURL:n}){console.log("updating Track Info"),document.querySelector(".trackInfo").innerHTML=`\n      <p>Track: ${e}</p>\n      <p>Artist: ${o}</p>\n      <p>Album: ${t}</p>\n  `,document.querySelector(".artworkContainer").innerHTML=`\n     <img\n         class=artwork\n         src=${n}\n         alt="album art"\n     />\n  `}({title:l,artist:a,album:g,artworkURL:u}),t=setTimeout((()=>{e({prevTitle:l,prevArtist:a,prevAlbum:g})}),n)}),n)}({prevTitle:"",prevArtist:"",prevAlbum:""})):(console.log("no accessToken found"),i&&(i.style.display="block"),c&&(c.style.display="none")),console.log("exiting main.js")})();