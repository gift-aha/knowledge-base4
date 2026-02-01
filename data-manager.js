// data-manager.js - 统一数据管理器（电脑端和移动端共享）
class UnifiedDataManager {
    static STORAGE_KEY = 'structuredThoughtAssistant';
    static BACKUP_PREFIX = 'structuredThoughtAssistant_backup_';
    static VERSION = '1.0';
    
    // 获取完整数据（确保字段完整）
    static getFullData() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (!saved) {
                return this.createDefaultData();
            }
            
            const data = JSON.parse(saved);
            return this.migrateData(data);
        } catch (error) {
            console.error('获取数据失败:', error);
            return this.createDefaultData();
        }
    }
    
    // 创建默认数据（与电脑端结构一致）
    static createDefaultData() {
        return {
            thoughts: [],
            models: [],
            tags: {},
            timeline: [
                {id: "t1", version: "v1.0-v5.0", date: "2023-01", event: "基础情感模型建立（工具化、错位、遗憾）"},
                {id: "t2", version: "v6.0-v10.0", date: "2023-03", event: "关系模型深化（成熟馈赠、无限博弈）"},
                {id: "t3", version: "v11.0-v15.0", date: "2023-05", event: "存在哲学拓展（存在勘探、水性智慧）"},
                {id: "t4", version: "v16.0-v18.0", date: "2023-07", event: "防御机制与病理学完善（梦境寄生、情感麻痹）"},
                {id: "t5", version: "v18.0-v20.2", date: "2023-09", event: "关系动力学、健康共建、意义整合"},
                {id: "t6", version: "v20.3-v21.3", date: "2023-11", event: "宏观社会批判、个体生存策略、哲学框架普适化"},
                {id: "t7", version: "v21.4-v22.0", date: "2024-01", event: "亲密关系光谱、存在性寄生、熵增损耗、祛魅悬置、偶像幻灭、创伤后重建、虚无美学整合"},
                {id: "t8", version: "v22.1-v22.2", date: "2024-03", event: "双轨制架构建立，新增 M-45 至 M-53 模型"},
                {id: "t9", version: "v22.33", date: "2024-05", event: "《我们很好》×《快乐星猫》关系诊疗整合版"},
                {id: "t10", version: "v22.48", date: "2024-07", event: "《寄居》×《花》整合版，模型总数达80个"}
            ],
            modelConnections: {
                "M-80": ["M-74", "M-78", "M-69", "M-77", "M-67"],
                "M-79": ["M-77", "M-71", "M-67"],
                "M-78": ["M-74", "M-73", "M-77", "M-76"],
                "M-77": ["M-69", "M-71", "M-67", "M-76"],
                "M-76": ["M-60", "M-71", "M-62", "M-66", "M-74"],
                "M-75": ["M-73", "M-72", "M-94"],
                "M-74": ["M-69", "M-30", "M-66", "M-67"],
                "M-73": ["M-94", "M-70", "M-72", "M-68"]
            },
            currentVersion: 'v22.48',
            lastSaved: new Date().toISOString(),
            nextThoughtId: 124,
            nextModelId: 81,
            dataVersion: this.VERSION,
            tagCategories: {
                "核心模型": ["🧠 核心模型", "🌌 哲学/存在智慧", "🔄 系统/模型整合", "⚙️ 决策/行动", "🎭 荒诞/幽默"],
                "关系与情感": ["💞 亲密关系/情感", "💔 失去/告别", "⚖️ 期望/错位", "🌱 成长/历程", "😶 道德/伦理"],
                "时间与存在": ["⏳ 时间/宿命", "⏰ 记忆/遗忘", "🌍 存在/感知", "🌀 循环/重复", "🚶 历程/路径"],
                "艺术与表达": ["🎵 歌曲分析", "🎭 文艺批评", "🎨 艺术/象征", "🗣️ 语言/叙事", "📚 文本分析"],
                "社会与系统": ["⚔️ 反抗/边缘", "🔄 系统/结构", "🏛️ 制度/权力", "🌐 网络/连接", "⚖️ 伦理/责任"],
                "特殊状态": ["🔥 极端体验", "🌀 解构/重构", "🎯 聚焦/专注", "💡 灵感/洞见", "🛡️ 防御/保护"]
            }
        };
    }
    
    // 数据迁移（确保向后兼容）
    static migrateData(data) {
        if (!data.dataVersion || data.dataVersion !== this.VERSION) {
            console.log('执行数据迁移...');
            
            // 确保所有必需字段都存在
            data.thoughts = data.thoughts || [];
            data.models = data.models || [];
            data.tags = data.tags || {};
            data.timeline = data.timeline || this.createDefaultData().timeline;
            data.modelConnections = data.modelConnections || this.createDefaultData().modelConnections;
            data.currentVersion = data.currentVersion || 'v22.48';
            data.lastSaved = data.lastSaved || new Date().toISOString();
            data.nextThoughtId = data.nextThoughtId || 124;
            data.nextModelId = data.nextModelId || 81;
            data.dataVersion = this.VERSION;
            
            // 确保tagCategories存在
            if (!data.tagCategories) {
                data.tagCategories = this.createDefaultData().tagCategories;
            }
        }
        return data;
    }
    
    // 保存数据（确保字段完整）
    static saveData(dataUpdates) {
        try {
            const currentData = this.getFullData();
            const newData = { 
                ...currentData, 
                ...dataUpdates, 
                lastSaved: new Date().toISOString() 
            };
            
            // 数据验证
            if (!this.validateData(newData)) {
                throw new Error('数据验证失败');
            }
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newData));
            
            // 触发数据更新事件
            this.triggerDataUpdated();
            
            console.log('数据保存成功');
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    }
    
    // 数据验证
    static validateData(data) {
        const required = ['thoughts', 'models', 'tags', 'currentVersion'];
        return required.every(key => data[key] !== undefined && data[key] !== null);
    }
    
    // 导出数据
    static exportData() {
        const data = this.getFullData();
        return JSON.stringify(data, null, 2);
    }
    
    // 导入数据
    static importData(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            
            // 验证数据
            if (!this.validateData(imported)) {
                throw new Error('数据格式无效');
            }
            
            // 创建备份
            this.createBackup();
            
            // 保存数据
            const migrated = this.migrateData(imported);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(migrated));
            
            // 触发数据更新事件
            this.triggerDataUpdated();
            
            return { success: true, message: '数据导入成功' };
        } catch (error) {
            console.error('导入数据失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 创建备份
    static createBackup() {
        try {
            const backupKey = this.BACKUP_PREFIX + new Date().toISOString().replace(/[:.]/g, '-');
            const currentData = localStorage.getItem(this.STORAGE_KEY);
            
            if (currentData) {
                localStorage.setItem(backupKey, currentData);
                
                // 清理旧备份（保留最近5个）
                this.cleanupOldBackups(5);
                
                return backupKey;
            }
        } catch (error) {
            console.error('创建备份失败:', error);
        }
        return null;
    }
    
    // 清理旧备份
    static cleanupOldBackups(keepCount = 5) {
        try {
            const backupKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.BACKUP_PREFIX)) {
                    backupKeys.push(key);
                }
            }
            
            // 按时间排序（从旧到新）
            backupKeys.sort((a, b) => a.localeCompare(b));
            
            // 删除多余的备份
            while (backupKeys.length > keepCount) {
                const oldestKey = backupKeys.shift();
                localStorage.removeItem(oldestKey);
                console.log('清理旧备份:', oldestKey);
            }
        } catch (error) {
            console.error('清理备份失败:', error);
        }
    }
    
    // 触发数据更新事件
    static triggerDataUpdated() {
        // 触发storage事件（同一浏览器不同标签页）
        const event = new StorageEvent('storage', {
            key: this.STORAGE_KEY,
            newValue: localStorage.getItem(this.STORAGE_KEY),
            oldValue: localStorage.getItem(this.STORAGE_KEY),
            storageArea: localStorage,
            url: window.location.href
        });
        
        // 在同一个页面内触发storage事件
        window.dispatchEvent(event);
        
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('data-updated', {
            detail: { timestamp: Date.now() }
        }));
    }
    
    // 检查数据完整性
    static checkDataIntegrity() {
        try {
            const data = this.getFullData();
            
            // 检查必需字段
            const requiredFields = ['thoughts', 'models', 'tags'];
            const hasRequiredFields = requiredFields.every(field => 
                Array.isArray(data[field]) || typeof data[field] === 'object'
            );
            
            if (!hasRequiredFields) {
                return { valid: false, reason: '缺少必需字段' };
            }
            
            // 检查思考记录结构
            const validThoughts = data.thoughts.every(thought => 
                thought && typeof thought === 'object' && thought.id
            );
            
            // 检查模型结构
            const validModels = data.models.every(model => 
                model && typeof model === 'object' && model.id && model.name
            );
            
            return { 
                valid: hasRequiredFields && validThoughts && validModels,
                stats: {
                    thoughts: data.thoughts.length,
                    models: data.models.length,
                    tags: Object.keys(data.tags).length,
                    lastSaved: data.lastSaved,
                    version: data.currentVersion
                }
            };
        } catch (error) {
            return { valid: false, reason: '数据解析失败: ' + error.message };
        }
    }
    
    // 修复数据
    static repairData() {
        try {
            const integrity = this.checkDataIntegrity();
            
            if (integrity.valid) {
                return { success: true, message: '数据正常，无需修复' };
            }
            
            console.log('数据损坏，尝试修复...', integrity.reason);
            
            // 创建备份
            this.createBackup();
            
            // 尝试从备份恢复
            const backupKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.BACKUP_PREFIX)) {
                    backupKeys.push(key);
                }
            }
            
            // 按时间排序，获取最新的备份
            backupKeys.sort((a, b) => b.localeCompare(a));
            
            if (backupKeys.length > 0) {
                const latestBackup = localStorage.getItem(backupKeys[0]);
                if (latestBackup) {
                    try {
                        const backupData = JSON.parse(latestBackup);
                        if (this.validateData(backupData)) {
                            localStorage.setItem(this.STORAGE_KEY, latestBackup);
                            console.log('从备份恢复成功:', backupKeys[0]);
                            return { success: true, message: '从备份恢复成功' };
                        }
                    } catch (e) {
                        console.log('备份数据也损坏，使用默认数据');
                    }
                }
            }
            
            // 如果没有可用的备份，使用默认数据
            const defaultData = this.createDefaultData();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultData));
            
            console.log('数据已重置为默认值');
            return { success: true, message: '数据已重置为默认值' };
        } catch (error) {
            console.error('修复数据失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 同步数据（重新加载）
    static sync() {
        this.triggerDataUpdated();
        return this.getFullData();
    }
}

// 如果是在浏览器环境中，添加到全局作用域
if (typeof window !== 'undefined') {
    window.UnifiedDataManager = UnifiedDataManager;
}
