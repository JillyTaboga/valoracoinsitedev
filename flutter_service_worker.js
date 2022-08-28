'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "9118579b3d17de322ef59aa61340ce16",
"index.html": "6e01bc3dd264deb3d1ffc767cd248cf3",
"/": "6e01bc3dd264deb3d1ffc767cd248cf3",
"main.dart.js": "0a154101b69b1f1da9c7daefa0919bcf",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"mp_sdk.js": "31c57e9f0b729453d3c44f69d2532724",
"favicon.png": "f18889bdb30523f1cd17a300a6aa2823",
"icons/Icon-192.png": "81a644cda2330549b3fa99fb8ea3eced",
"icons/Icon-maskable-192.png": "81a644cda2330549b3fa99fb8ea3eced",
"icons/Icon-maskable-512.png": "d17a1a6648b34a291488826f94b8ad4e",
"icons/Icon-512.png": "d17a1a6648b34a291488826f94b8ad4e",
"manifest.json": "2b032c30ef99861eeacbf5700db12949",
"assets/AssetManifest.json": "e51419886335a39272ce4eb26c262ede",
"assets/NOTICES": "02807b6fe2002e9ebec48e7273fd4dd4",
"assets/FontManifest.json": "d31bf73fb57c270d21b168afdf80c1b5",
"assets/packages/amplify_auth_cognito_dart/lib/src/workers/workers.min.js.map": "a321afa7f5c4232356527c02709a3294",
"assets/packages/amplify_auth_cognito_dart/lib/src/workers/workers.min.js": "9026f7a8898fcc20e0e029f42cb94e7f",
"assets/packages/amplify_secure_storage_dart/lib/src/worker/workers.min.js.map": "ae4520ff528698db2e57c2bf0e9996e5",
"assets/packages/amplify_secure_storage_dart/lib/src/worker/workers.min.js": "6b4bd1527531d31f05f1c5f21661fd96",
"assets/shaders/ink_sparkle.frag": "5e995b0e53dc1b9e92ce33ef44b02f85",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/comporation_b.png": "cbdfccccf7d9950f0cbcf62ca203e926",
"assets/assets/images/mercado_pago.png": "0c5155c47be36fe03dbfaa3719ec1234",
"assets/assets/images/background.png": "20e7f56e8bcab5d55ce4dabd77de50f4",
"assets/assets/images/impact4.png": "c7287bf8234fc8091ddac8a187c634de",
"assets/assets/images/impact5.png": "a628300f0043981d13755f56e8183c2d",
"assets/assets/images/impact6.png": "0f91f11e5a714e81cbdadae9bf70294e",
"assets/assets/images/logo.png": "dc325585e24d4ef94ea67c0b6ee45387",
"assets/assets/images/impact2.png": "59a07f58ba1f9d73748787e2d531363e",
"assets/assets/images/SmallLogo.png": "04064de11c2615776f8e80669835e18c",
"assets/assets/images/impact3.png": "99fa7ecd44f48966c1b1bb717e40dc5b",
"assets/assets/images/impact1.png": "e531634d76be4ee064002eb35f527153",
"assets/assets/images/logo_branco_valora.png": "7b5662b9257bea26a61741854b522189",
"assets/assets/images/social_download.png": "7f2288e68a979d28344b7d1e7aaec50c",
"assets/assets/i18n/en_us.yaml": "fe8f1689abca1382a915f75adc233005",
"assets/assets/i18n/pt_br.yaml": "5c2aaa571638fec8e61fd9c87efb1b62",
"assets/assets/fonts/Montserrat/Montserrat-Medium.ttf": "aca6287f22eef510c1e622c97bb1e1e1",
"assets/assets/fonts/Montserrat/Montserrat-Bold.ttf": "d14ad1035ae6da4e5a71eca362a8d696",
"assets/assets/fonts/Montserrat/Montserrat-SemiBold.ttf": "7ffeec2b4edb434d393875ffbe633c30",
"assets/assets/fonts/Montserrat/Montserrat-Regular.ttf": "34de1239b12123b85ff1a68b58835a1f",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
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
