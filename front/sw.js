var version = '3.0';
const cacheName = 'exercise-Version_'+version;
var dataCacheName = 'exercise-data-'+version;

const staticAssets = [
    './',
    'assets/css/bootstrap.css',
    'assets/js/jquery.js',
    'assets/js/bootstrap.js',
    'views/index.html',
    'app.js',
    'Controller/mainController.js'
];

self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});
var cachableUrls = [
    
];



self.addEventListener('fetch', function(e) {
    console.log("WORKER FETCH CALLED...");
    if(mustCache(e.request.url)) {
        
        e.respondWith(
            fetch(e.request)
            .then(function(response) {
                return caches.open(dataCacheName).then(function(cache) {
                    console.log("SAVING >>> "+e.request.url);
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            })
        );
        
    } else {
            e.respondWith(
                caches.match(e.request).then(function(response) {
                    /*var type = response ? "cached" : "network";
                    if(response && 'url' in response) {
                        console.log(type+": "+response.url);
                    }else{
                        console.log(type+": "+e.request.url);
                    }*/

                    return response || fetch(e.request);
                })
            );
    }
    
  
});

function mustCache(requestUrl) {
    
    for(var i=0;i<cachableUrls.length;i++) {
        if(requestUrl.indexOf(cachableUrls[i]) > -1) {
            return true;
        }
    }
    
    return false;
}

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || fetch(req);
}


