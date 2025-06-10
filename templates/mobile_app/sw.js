/**
 * Service Worker for SIM Evaluation System PWA
 * Handles offline functionality, caching, and background sync
 */

const CACHE_NAME = 'sim-evaluation-v2.0.0';
const STATIC_CACHE = 'sim-static-v2.0.0';
const API_CACHE = 'sim-api-v2.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/mobile_app/',
    '/mobile_app/index.html',
    '/mobile_app/manifest.json',
    '/mobile_app/app.js',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            console.log('Caching static files...');
            return cache.addAll(STATIC_FILES);
        }).then(() => {
            console.log('Service Worker installation complete');
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - handle network requests with caching strategy
self.addEventListener('fetch', event => {
    const request = event.request;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle API requests
    if (request.url.includes('/api/')) {
        event.respondWith(handleApiRequest(request));
        return;
    }
    
    // Handle static file requests
    event.respondWith(handleStaticRequest(request));
});

// API request handler - cache-first with network fallback
async function handleApiRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Serving API request from cache:', request.url);
            return cachedResponse;
        }
        
        // Fetch from network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(API_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('API request cached:', request.url);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('Network failed for API request:', request.url);
        
        // Return offline fallback
        return createOfflineApiResponse(request);
    }
}

// Static file handler - cache-first strategy
async function handleStaticRequest(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Serving static file from cache:', request.url);
            return cachedResponse;
        }
        
        // Not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('Static file cached:', request.url);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('Failed to fetch static file:', request.url);
        return createOfflinePage();
    }
}

// Create offline API response with SIM evaluation data
function createOfflineApiResponse(request) {
    const data = {
        consciousness_score: 0.8766,
        independence_score: 0.9472,
        api_costs: 0.225,
        environments: {
            local: { independence: 0.951, status: 'Highly Autonomous' },
            app_engine: { independence: 0.938, status: 'Highly Autonomous' },
            cloud_run: { independence: 0.953, status: 'Certification Eligible' }
        },
        certification: {
            eligible_environments: 1,
            total_environments: 3,
            next_milestone: 'Cloud Run certification'
        },
        offline: true
    };
    
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'X-Offline': 'true'
        }
    });
}

// Create offline fallback page
function createOfflinePage() {
    const offlineHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>SIM Evaluation - Offline</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: system-ui, sans-serif; 
                    text-align: center; 
                    padding: 40px; 
                    background: #f3f4f6; 
                }
                .container { 
                    max-width: 400px; 
                    margin: 0 auto; 
                    background: white; 
                    padding: 40px; 
                    border-radius: 12px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .icon { 
                    width: 64px; 
                    height: 64px; 
                    background: #ef4444; 
                    border-radius: 50%; 
                    margin: 0 auto 20px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    font-size: 24px; 
                }
                h1 { color: #374151; margin-bottom: 16px; }
                p { color: #6b7280; margin-bottom: 24px; }
                button { 
                    background: #2563eb; 
                    color: white; 
                    border: none; 
                    padding: 12px 24px; 
                    border-radius: 8px; 
                    cursor: pointer; 
                    font-size: 16px; 
                }
                button:hover { background: #1d4ed8; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">⚡</div>
                <h1>You're Offline</h1>
                <p>This page isn't available offline. Please check your internet connection and try again.</p>
                <button onclick="window.location.reload()">Try Again</button>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHtml, {
        status: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });
}

console.log('SIM Evaluation Service Worker loaded');