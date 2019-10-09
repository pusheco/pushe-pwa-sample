
// Path and name of the service worker
// corresponding to the file of the servcie worker
var serviceWorkerPath = "sw.js";

// First check if browser supports service worker
// Then register it
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {

        navigator.serviceWorker.register(serviceWorkerPath)
            .then(function(registration) {
                // Registration was successfull
                console.log("ServiceWorker registration successfull with scope: ", registration.scope);
            })
            .catch(function(error) {
                // Something unexpected happened
                console.error("ServiceWorker registration failed: ", error);
            });

    });
}
