const originalFetch = window.fetch;
window.fetch = function(url, init) {
    return originalFetch.call(this, url, init);
};
