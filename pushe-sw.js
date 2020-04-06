/*
    Because only one service worker would works in the root scope,
    then we import all other service workers including the pwa sw
    in the pushe-sw service worker.
*/

importScripts("./sw.js");
importScripts("https://static.pushe.co/pusheweb-sw.js");
