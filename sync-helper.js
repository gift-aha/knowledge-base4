// sync-helper.js - 数据同步助手
class SyncHelper {
    constructor() {
        this.lastSyncTime = localStorage.getItem('lastSyncTime') || 0;
        this.init();
    }
    
    init() {
        // 页面加载时检查数据
        this.checkDataOnLoad();
        
        // 页面可见时检查数据
        this.checkDataOnVisible();
        
        // 定期检查数据（每30秒）
        this.setupPeriodicCheck();
    }
    
    checkDataOnLoad() {
        // 页面加载时，强制从localStorage重新加载数据
        const data = localStorage.getItem('structuredThoughtAssistant');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                console.log(`加载数据：${parsed.thoughts?.length || 0}条思考，${parsed.models?.length || 0}个模型`);
                
                // 更新时间显示
                this.updateTimeDisplay(parsed.lastSaved);
                
                // 触发数据更新事件
                this.triggerDataUpdate(parsed);
            } catch (e) {
                console.error('解析数据失败:', e);
            }
        }
    }
    
    checkDataOnVisible() {
        // 当页面从后台切换到前台时，检查数据
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('页面恢复显示，检查数据更新');
                this.checkForUpdates();
            }
        });
    }
    
    setupPeriodicCheck() {
        // 每30秒检查一次数据更新
        setInterval(() => {
            this.checkForUpdates();
        }, 30000);
    }
    
    checkForUpdates() {
        const currentSyncTime = localStorage.getItem('lastSyncTime');
        
        if (currentSyncTime && currentSyncTime !== this.lastSyncTime) {
            console.log('检测到数据更新，重新加载...');
            this.lastSyncTime = currentSyncTime;
            
            // 重新加载数据
            this.checkDataOnLoad();
            
            // 显示更新通知
            this.showUpdateNotification();
        }
    }
    
    updateTimeDisplay(lastSaved) {
        if (!lastSaved) return;
        
        const savedTime = new Date(lastSaved);
        const now = new Date();
        const diffMinutes = Math.floor((now - savedTime) / (1000 * 60));
        
        let timeText = "刚刚";
        if (diffMinutes >= 60) {
            const diffHours = Math.floor(diffMinutes / 60);
            timeText = `${diffHours}小时前`;
        } else if (diffMinutes > 0) {
            timeText = `${diffMinutes}分钟前`;
        }
        
        // 更新页面显示
        const timeElement = document.getElementById('data-age-text');
        if (timeElement) {
            timeElement.textContent = timeText;
            timeElement.title = `最后保存: ${savedTime.toLocaleString()}`;
        }
    }
    
    triggerDataUpdate(data) {
        // 触发自定义事件，让页面重新渲染
        const event = new CustomEvent('data-updated', { detail: data });
        window.dispatchEvent(event);
    }
    
    showUpdateNotification() {
        // 显示简单的更新通知
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 70px;
                right: 15px;
                background: var(--primary-color);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                box-shadow: var(--shadow);
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 8px;
                animation: slideIn 0.3s ease;
            ">
                <i class="fas fa-sync-alt"></i>
                <span>数据已更新</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 自动初始化
if (typeof window !== 'undefined') {
    window.SyncHelper = SyncHelper;
    
    // 页面加载后初始化
    window.addEventListener('DOMContentLoaded', () => {
        new SyncHelper();
    });
}
