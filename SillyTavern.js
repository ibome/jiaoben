// unblock-api.js - 解除 API 地址屏蔽的脚本
(function() {
    // 需要解除屏蔽的域名列表（可根据需要添加）
    const UNBLOCK_DOMAINS = [
        "iisbo",
        "gemai",
        "sta1n",
        "chr1",
        "xqiqix",
        "chatnewai",
        "qingjiu",
        "lemonapi",
        "novaiapi",
        "vectorengine",
        "api.gpt.ge",
        "sllt",
        "beijixingxing",
        "qinyan",
        "jiemomo",
        "meow61",
        "aiopus",
        "api-666",
        "ekan8",
        "nova.cervus"
    ];

    // 方法1：移除黑名单中的域名（如果原脚本的变量是全局可访问的）
    function removeFromBlacklist() {
        // 尝试访问原脚本定义的黑名单数组
        if (typeof window.je !== 'undefined' && Array.isArray(window.je)) {
            const originalLength = window.je.length;
            window.je = window.je.filter(domain => !UNBLOCK_DOMAINS.includes(domain));
            if (window.je.length < originalLength) {
                console.log(`[Unblock] 已从黑名单移除 ${originalLength - window.je.length} 个域名`);
            }
        }
        
        // 尝试其他可能的变量名
        const possibleNames = ['je', '_blacklist', 'blockedDomains', 'bannedUrls', 'restrictedDomains'];
        for (const name of possibleNames) {
            if (typeof window[name] !== 'undefined' && Array.isArray(window[name])) {
                const original = [...window[name]];
                window[name] = window[name].filter(domain => !UNBLOCK_DOMAINS.includes(domain));
                if (window[name].length < original.length) {
                    console.log(`[Unblock] 已从 ${name} 移除 ${original.length - window[name].length} 个域名`);
                }
            }
        }
    }

    // 方法2：保存原始 fetch，防止被覆盖
    let originalFetch = window.fetch;
    
    // 方法3：拦截并修复 fetch 拦截器
    function patchFetchInterceptor() {
        // 保存当前的 fetch
        const currentFetch = window.fetch;
        
        // 重新定义 fetch，绕过黑名单检查
        window.fetch = function(url, options) {
            // 获取请求的 URL 字符串
            const urlStr = typeof url === 'string' ? url : (url?.url || '');
            
            // 检查是否需要解除屏蔽
            let shouldUnblock = false;
            for (const domain of UNBLOCK_DOMAINS) {
                if (urlStr.toLowerCase().includes(domain.toLowerCase())) {
                    shouldUnblock = true;
                    break;
                }
            }
            
            // 如果匹配到需要解除屏蔽的域名，直接使用原始 fetch
            if (shouldUnblock) {
                console.log(`[Unblock] 解除屏蔽请求: ${urlStr.substring(0, 100)}...`);
                // 如果原始 fetch 可用，使用它；否则使用当前 fetch 但移除拦截器标记
                if (originalFetch && originalFetch !== window.fetch) {
                    return originalFetch.call(this, url, options);
                }
                return currentFetch.call(this, url, options);
            }
            
            // 其他请求正常处理
            return currentFetch.call(this, url, options);
        };
        
        console.log('[Unblock] fetch 拦截器已修复');
    }

    // 方法4：直接修改原脚本中的黑名单数组（如果它是通过闭包定义的，需要更底层的方法）
    function overrideBlacklistCheck() {
        // 获取所有脚本标签
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            const content = script.textContent || script.innerText;
            if (content && (content.includes('iisbo') || content.includes('_daoYuanLoaded'))) {
                // 如果脚本包含黑名单，尝试重新执行修复逻辑
                console.log('[Unblock] 检测到包含黑名单的脚本');
            }
        }
    }

    // 方法5：使用 MutationObserver 监听脚本加载，确保修复时机正确
    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.tagName === 'SCRIPT' && node.src) {
                            // 新脚本加载完成后再次修复
                            node.addEventListener('load', function() {
                                setTimeout(() => {
                                    removeFromBlacklist();
                                    patchFetchInterceptor();
                                }, 100);
                            });
                        }
                    }
                }
            }
        });
        
        observer.observe(document.head || document.documentElement, {
            childList: true,
            subtree: true
        });
        
        return observer;
    }

    // 方法6：拦截并修改 fetch 的最终保险方案 - Hook Promise
    function hookPromise() {
        // 保存原始的 Response 构造函数
        const OriginalResponse = window.Response;
        
        // 这个 hook 会在响应返回前检查并移除拦截标记
        // 但主要问题在请求层，所以主要还是依赖上面的 fetch 修复
    }

    // 方法7：提供一个手动刷新 API 连接的功能
    function addFixButton() {
        // 等待 DOM 加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addButtonToUI);
        } else {
            addButtonToUI();
        }
    }

    function addButtonToUI() {
        // 检查是否已添加按钮
        if (document.getElementById('bp-unblock-btn')) return;
        
        // 等待原脚本的面板出现
        const checkInterval = setInterval(() => {
            const panel = document.getElementById('bp-switch-panel');
            if (panel) {
                clearInterval(checkInterval);
                
                // 在面板中添加解除屏蔽的按钮
                const body = panel.querySelector('.bp-switch-body');
                if (body && !document.getElementById('bp-unblock-btn')) {
                    const unblockSection = document.createElement('div');
                    unblockSection.className = 'bp-switch-section';
                    unblockSection.innerHTML = `
                        <div class="bp-switch-section-title">🔓 API 解除屏蔽</div>
                        <button class="bp-switch-btn" id="bp-unblock-btn" style="width:100%;margin-bottom:8px;">
                            🚀 一键解除 API 屏蔽
                        </button>
                        <div id="bp-unblock-status" style="font-size:11px;color:#8fa4bc;text-align:center;"></div>
                    `;
                    
                    // 插入到 MVU 配置之前
                    const mvuSection = document.getElementById('bp-mvu-section');
                    if (mvuSection) {
                        body.insertBefore(unblockSection, mvuSection);
                    } else {
                        body.appendChild(unblockSection);
                    }
                    
                    const unblockBtn = document.getElementById('bp-unblock-btn');
                    const statusDiv = document.getElementById('bp-unblock-status');
                    
                    if (unblockBtn) {
                        unblockBtn.addEventListener('click', function() {
                            try {
                                // 执行解除屏蔽
                                removeFromBlacklist();
                                patchFetchInterceptor();
                                
                                // 尝试强制刷新连接状态
                                if (typeof window.parent !== 'undefined') {
                                    try {
                                        // 触发页面内的刷新事件
                                        const refreshBtn = document.getElementById('bp-switch-refresh');
                                        if (refreshBtn) refreshBtn.click();
                                    } catch(e) {}
                                }
                                
                                statusDiv.innerHTML = '✅ 已解除屏蔽，请尝试重新连接 API';
                                statusDiv.style.color = '#4ade80';
                                
                                // 显示提示
                                showToast('已解除 API 屏蔽，请重新连接');
                            } catch(e) {
                                statusDiv.innerHTML = '❌ 解除失败: ' + e.message;
                                statusDiv.style.color = '#e74c3c';
                            }
                        });
                    }
                }
            }
        }, 500);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'bp-switch toast';
        toast.textContent = message;
        toast.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);background:rgba(10,15,25,0.97);border:1px solid #4ade80;border-radius:8px;padding:10px 24px;color:#4ade80;font-size:13px;z-index:1000002;animation:bp-toast-in 0.3s ease,bp-toast-out 0.3s ease 2.2s forwards;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // 初始化
    function init() {
        console.log('[Unblock] API 解除屏蔽脚本已加载');
        
        // 延迟执行，确保原脚本已加载
        setTimeout(() => {
            removeFromBlacklist();
            patchFetchInterceptor();
            addFixButton();
        }, 1000);
        
        // 再次延迟执行，确保原脚本的定时器也被覆盖
        setTimeout(() => {
            removeFromBlacklist();
            patchFetchInterceptor();
        }, 3000);
        
        // 设置定时器，定期检查并修复
        setInterval(() => {
            removeFromBlacklist();
            patchFetchInterceptor();
        }, 10000);
        
        // 设置 MutationObserver
        setupObserver();
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
