const CACHE_NAME = "auwalmb-pwa-v2";

const APP_FILES = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/certificates.html",
    "/manifest.json"
];

// INSTALL
self.addEventListener("install", event => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            for (const file of APP_FILES) {
                try {
                    const response = await fetch(file, {
                        redirect: "follow"
                    });

                    if (response.ok) {
                        const body = await response.clone().arrayBuffer();

                        const safeResponse = new Response(body, {
                            status: response.status,
                            headers: response.headers
                        });

                        await cache.put(file, safeResponse);
                    }
                } catch (error) {
                    console.log("Cache failed:", file, error);
                }
            }
        })()
    );

    self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();

            await Promise.all(
                keys
                    .filter(key => key.startsWith("auwalmb-pwa-") &&
                        key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );

            await self.clients.claim();
        })()
    );
});

// FETCH
self.addEventListener("fetch", event => {
    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) return;

    event.respondWith(
        (async () => {
            try {
                const response = await fetch(request, {
                    redirect: "follow"
                });

                if (response.ok) {
                    const body = await response.clone().arrayBuffer();

                    const safeResponse = new Response(body, {
                        status: response.status,
                        headers: response.headers
                    });

                    const cache = await caches.open(CACHE_NAME);

                    await cache.put(request, safeResponse);
                }

                return response;

            } catch (error) {
                const cache = await caches.open(CACHE_NAME);

                const cached = await cache.match(request);

                if (cached) return cached;

                if (request.mode === "navigate") {
                    const fallback = await cache.match("/index.html");

                    if (fallback) return fallback;
                }

                return new Response("You are offline.", {
                    status: 503,
                    headers: {
                        "Content-Type": "text/plain"
                    }
                });
            }
        })()
    );
});