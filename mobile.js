// 移动端专用逻辑
const MobileManager = {
    init: function() {
        console.log('MobileManager.init() 开始');
        
        // 只有移动端才执行
        if (!this.isMobile()) return;
        
        try {
            this.bindMobileEvents();
            this.adjustMobileLayout();
            console.log('MobileManager.init() 完成');
        } catch (error) {
            console.error('移动端初始化失败:', error);
        }
    },
    
    isMobile: function() {
        return window.innerWidth <= 768;
    },
    
    bindMobileEvents: function() {
        // 移动端菜单按钮
        const menuToggle = document.getElementById('mobile-menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                menuToggle.classList.toggle('active');
            });
        }
        
        // 移动端搜索功能
        this.bindMobileSearchEvents();
        
        // 移动端视图切换按钮
        const viewToggle = document.getElementById('mobile-view-toggle');
        const viewSwitcher = document.getElementById('mobile-view-switcher');
        if (viewToggle && viewSwitcher) {
            viewToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                viewSwitcher.classList.toggle('active');
                viewToggle.classList.toggle('active');
            });
        }
        
        // 移动端导航项
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // 移除所有active类
                mobileNavItems.forEach(nav => nav.classList.remove('active'));
                
                // 添加active类到当前项
                item.classList.add('active');
                
                // 加载视图
                const view = item.getAttribute('data-view');
                if (App && App.loadView) {
                    App.loadView(view);
                }
                
                // 滚动到顶部
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
        
        // 移动端视图切换器选项
        const viewOptions = document.querySelectorAll('.mobile-view-option');
        viewOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const view = option.getAttribute('data-view');
                if (App && App.loadView) {
                    App.loadView(view);
                }
                
                // 更新活动状态
                viewOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // 关闭切换器
                if (viewSwitcher) viewSwitcher.classList.remove('active');
            });
        });
    },
    
    bindMobileSearchEvents: function() {
        console.log('绑定移动端搜索事件');
        
        // 移动端搜索按钮
        const searchToggle = document.getElementById('mobile-search-toggle');
        const searchBar = document.getElementById('mobile-search-bar');
        
        if (searchToggle && searchBar) {
            // 防止重复绑定
            searchToggle.removeEventListener('click', this.handleSearchToggle);
            searchToggle.addEventListener('click', this.handleSearchToggle.bind(this));
        }
        
        // 移动端搜索清除按钮
        const searchClear = document.getElementById('mobile-search-clear');
        const mobileSearchInput = document.getElementById('mobile-search-input');
        
        if (searchClear && mobileSearchInput) {
            searchClear.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                mobileSearchInput.value = '';
                mobileSearchInput.focus();
                
                // 执行搜索（空搜索将显示所有内容）
                if (App && App.performSearch) {
                    App.performSearch('');
                }
            });
        }
        
        // 移动端搜索输入事件
        if (mobileSearchInput) {
            // 输入时搜索
            let searchTimeout;
            mobileSearchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (App && App.performSearch) {
                        App.performSearch(e.target.value);
                    }
                }, 300);
            });
            
            // 回车键搜索
            mobileSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (App && App.performSearch) {
                        App.performSearch(e.target.value);
                    }
                    // 隐藏搜索栏
                    if (searchBar) searchBar.classList.remove('active');
                    if (searchToggle) searchToggle.classList.remove('active');
                }
            });
        }
        
        // 点击其他地方关闭搜索
        document.addEventListener('click', (e) => {
            const searchBar = document.getElementById('mobile-search-bar');
            const searchToggle = document.getElementById('mobile-search-toggle');
            
            if (searchBar && searchBar.classList.contains('active')) {
                // 如果点击的不是搜索相关元素
                const isSearchElement = 
                    (searchBar && searchBar.contains(e.target)) ||
                    (searchToggle && (searchToggle === e.target || searchToggle.contains(e.target)));
                
                if (!isSearchElement) {
                    searchBar.classList.remove('active');
                    if (searchToggle) {
                        searchToggle.classList.remove('active');
                    }
                }
            }
        });
    },
    
    handleSearchToggle: function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const searchToggle = e.currentTarget;
        const searchBar = document.getElementById('mobile-search-bar');
        
        if (!searchBar) return;
        
        console.log('移动端搜索按钮点击');
        
        // 切换搜索栏显示
        searchBar.classList.toggle('active');
        searchToggle.classList.toggle('active');
        
        // 如果打开搜索栏，聚焦输入框
        if (searchBar.classList.contains('active')) {
            setTimeout(() => {
                const searchInput = document.getElementById('mobile-search-input');
                if (searchInput) {
                    searchInput.focus();
                    // 移动端虚拟键盘可能遮挡，滚动到可视区域
                    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        } else {
            // 如果关闭搜索栏，清空搜索并恢复视图
            const searchInput = document.getElementById('mobile-search-input');
            if (searchInput) {
                searchInput.value = '';
            }
            // 恢复之前的视图
            if (App && App.currentView && App.loadView) {
                App.loadView(App.currentView);
            }
        }
    },
    
    adjustMobileLayout: function() {
        // 添加移动端样式类
        document.body.classList.add('mobile-mode');
        
        // 隐藏桌面端元素
        const desktopElements = document.querySelectorAll('.desktop-only');
        desktopElements.forEach(el => el.style.display = 'none');
        
        // 调整内容区域间距
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.style.paddingTop = '80px';
            contentArea.style.paddingBottom = '80px';
        }
    }
};

// 初始化移动端管理器
document.addEventListener('DOMContentLoaded', function() {
    MobileManager.init();
});

// 窗口大小变化时重新检测
window.addEventListener('resize', function() {
    if (MobileManager.isMobile()) {
        document.body.classList.add('mobile-mode');
    } else {
        document.body.classList.remove('mobile-mode');
    }
});
