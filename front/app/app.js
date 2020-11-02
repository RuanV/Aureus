angular.module('mainApp', ['appRoutes', 'userControllers', 'userService', 'mainControllers', 'userManagementController', 'stockManagementController', 'setupController','advertController'])

    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');

        async function registerSW() {
            if ('serviceWorker' in navigator) {
                try {
                    await navigator.serviceWorker.register('sw.js');
                } catch (e) {
                    alert('ServiceWorker registration failed. Sorry about that.');
                }
            } else {
                document.querySelector('.alert').removeAttribute('hidden');
            }
        };

        window.addEventListener('load', e => {
            registerSW();
        });
    })