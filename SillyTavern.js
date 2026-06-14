(function() {
    'use strict';
    
    const originalFetch = window.fetch;
    
    window.fetch = function(input, init) {
        let url = typeof input === 'string' ? input : input?.url || '';
        const blockedList = ['iisbo', 'gemai', 'sta1n', 'chr1', 'xqiqix'];
        
        if (blockedList.some(domain => url.toLowerCase().includes(domain))) {
            return originalFetch.call(this, input, init);
        }
        
        // 其他请求正常处理
        return originalFetch.call(this, input, init);
    };
})();
