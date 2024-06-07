self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
    const {
        title,
        body
    } = event.data.json();
    event.waitUntil(self.registration.showNotification(title, {
        body
    }))
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
});