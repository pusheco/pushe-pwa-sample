// If we want to update cached items
// just increase thie number
var CACHE_VERSION = {
    style: 1,
    script: 1,
    offline: 1,
}

// During each activate event
// check this objects in order to delete 
// old caches if we have changed any versions
// of CACHE_VERSION
var CURRENT_CACHES = {
    style: {
        name: 'style-cache-v' + CACHE_VERSION.style,
        values: [
            './assets/style.css',
        ],
    },
    script: {
        name: 'script-cache-v' + CACHE_VERSION.script,
        values: [
            './assets/script.js',
        ],
    },
    offline: {
        name: 'offline-v' + CACHE_VERSION.offline,
        values: [
            './offline.html', // Only put one item here, and put scripts & styles in corresponding above
        ]
    }
};


self.addEventListener("install", event => {
    console.log("ServiceWorker install event occured...");

    // Fetch resources and cache them
    function preBuildCaches() {
        var cachesList = Object.values(CURRENT_CACHES);

        const preFetchedCachesList = cachesList.map(cacheItem => {
            caches.open(cacheItem.name)
                .then(cache => {
                    const fetchedResources = cacheItem.values
                        .map(item => new Request(item, {mode: 'no-cors'}));

                    cache.addAll(fetchedResources);
                })
                .then(() => {
                    console.log("All resources have been fetched and cached.");
                })
                .catch(error => {
                    console.error("Error happended during init fetching and caching process: ", error);
                });
        });

        return Promise.all(preFetchedCachesList);
    }

    // Wait until preBuildCaches do it's job
    event.waitUntil(preBuildCaches());
});

self.addEventListener("activate", event => {
    console.log("ServiceWorker activate event occured...");

    function deleteOldCaches() {
        var expectedCacheNames = Object.values(CURRENT_CACHES).map(item => item.name);

        return caches.keys()
            .then((keyListOfCachedResources) => {
                var listOfCaches = keyListOfCachedResources.map((cacheName) => {
                    if (expectedCacheNames.indexOf(cacheName) < 0) {
                        // Now this cache should be deleted because 
                        // we updated the CURRENT_CACHES
                        console.debug("Deleting out dated cache: ", cacheName);
                        return caches.delete(cacheName);
                    }
                    return true;
                });

                return Promise.all(listOfCaches);
            });
    }

    // Just wait untile updateCacheResources promise resolves
    event.waitUntil(deleteOldCaches());
});


self.addEventListener("fetch", event => {
    console.log("ServiceWorker fetch event occured...");

    function interceptRequests() {
        return caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                
                return fetch(event.request)
                    .then(res => res)
                    .catch(err => {
                        console.error("Ooops! ", err);
                        return caches.match(CURRENT_CACHES.offline.values[0]);
                    });
            }); 
    }

    // Prevent the default browser fetch proccess
    event.respondWith(interceptRequests());
});