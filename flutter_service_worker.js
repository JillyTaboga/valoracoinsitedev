'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "69c4c76ec0763a417c6d14eabaf4527d",
"assets/assets/fonts/Montserrat/Montserrat-Bold.ttf": "d14ad1035ae6da4e5a71eca362a8d696",
"assets/assets/fonts/Montserrat/Montserrat-Medium.ttf": "aca6287f22eef510c1e622c97bb1e1e1",
"assets/assets/fonts/Montserrat/Montserrat-Regular.ttf": "34de1239b12123b85ff1a68b58835a1f",
"assets/assets/fonts/Montserrat/Montserrat-SemiBold.ttf": "7ffeec2b4edb434d393875ffbe633c30",
"assets/assets/i18n/en_US.yaml": "3ec0d83535f0519ba135b53a192e4f1d",
"assets/assets/i18n/pt_BR.yaml": "b9ed62680e8fddc70dfbf2369443cdb5",
"assets/assets/images/background.png": "20e7f56e8bcab5d55ce4dabd77de50f4",
"assets/assets/images/comporation_b.png": "cbdfccccf7d9950f0cbcf62ca203e926",
"assets/assets/images/impact1.png": "e531634d76be4ee064002eb35f527153",
"assets/assets/images/impact2.png": "59a07f58ba1f9d73748787e2d531363e",
"assets/assets/images/impact3.png": "99fa7ecd44f48966c1b1bb717e40dc5b",
"assets/assets/images/impact4.png": "c7287bf8234fc8091ddac8a187c634de",
"assets/assets/images/impact5.png": "a628300f0043981d13755f56e8183c2d",
"assets/assets/images/impact6.png": "0f91f11e5a714e81cbdadae9bf70294e",
"assets/assets/images/logo.png": "dc325585e24d4ef94ea67c0b6ee45387",
"assets/assets/images/logo_branco_valora.png": "7b5662b9257bea26a61741854b522189",
"assets/assets/images/mercado_pago.png": "0c5155c47be36fe03dbfaa3719ec1234",
"assets/assets/images/SmallLogo.png": "04064de11c2615776f8e80669835e18c",
"assets/assets/images/social_download.png": "7f2288e68a979d28344b7d1e7aaec50c",
"assets/FontManifest.json": "d31bf73fb57c270d21b168afdf80c1b5",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "60a27837574ab992e3a02be107588382",
"assets/packages/amplify_auth_cognito_dart/lib/src/workers/workers.min.js": "9026f7a8898fcc20e0e029f42cb94e7f",
"assets/packages/amplify_auth_cognito_dart/lib/src/workers/workers.min.js.map": "a321afa7f5c4232356527c02709a3294",
"assets/packages/amplify_secure_storage_dart/lib/src/worker/workers.min.js": "6b4bd1527531d31f05f1c5f21661fd96",
"assets/packages/amplify_secure_storage_dart/lib/src/worker/workers.min.js.map": "ae4520ff528698db2e57c2bf0e9996e5",
"assets/shaders/ink_sparkle.frag": "b92b2fa369b426e4315cec540a35f0db",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"favicon.png": "f18889bdb30523f1cd17a300a6aa2823",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"icons/Icon-192.png": "81a644cda2330549b3fa99fb8ea3eced",
"icons/Icon-512.png": "d17a1a6648b34a291488826f94b8ad4e",
"icons/Icon-maskable-192.png": "81a644cda2330549b3fa99fb8ea3eced",
"icons/Icon-maskable-512.png": "d17a1a6648b34a291488826f94b8ad4e",
"index.html": "84cc09afbf0b911e019194cff9768288",
"/": "84cc09afbf0b911e019194cff9768288",
"main.dart.js": "926ade879d75f240d812744566d583e4",
"manifest.json": "8c156c387f11077fd82d2a5938877b6f",
"mp_sdk.js": "31c57e9f0b729453d3c44f69d2532724",
"version.json": "73ce3d8b76a08639550c222eb42d00a8"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
