// Request browser notification permission
export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.warn('This browser does not support desktop notification');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

// Trigger browser notification
export const showBrowserNotification = (title, options = {}) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return null;
    }

    const defaultOptions = {
        icon: '/logo.png', // Fallback icon path
        badge: '/logo.png',
        vibrate: [200, 100, 200],
        ...options,
    };

    try {
        const notification = new Notification(title, defaultOptions);
        return notification;
    } catch (error) {
        console.error('Error creating Notification:', error);
        return null;
    }
};
