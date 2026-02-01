// ==================== 统一数据管理器 ====================
// 用于确保电脑端和移动端数据完全一致

const UnifiedDataManager = {
    // 存储键名（必须一致）
    STORAGE_KEY: 'structuredThoughtAssistant',
    
    // 数据版本，用于迁移
    DATA_VERSION: '2.0',
    
    // 获取完整数据
    getFullData: function() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            
            if (!saved) {
                console.log('未找到数据，创建默认数据');
                return this.createDefaultData();
            }
            
            const data = JSON.parse(saved);
            
            // 数据迁移：确保数据结构最新
            return this.migrateData(data);
            
        } catch (error) {
            console.error('获取数据失败，使用默认数据:', error);
            return this.createDefaultData();
        }
    },
    
    // 创建默认数据
    createDefaultData: function() {
        return {
            // 核心数据
            thoughts: [],
            models: [],
            tags: {},
            
            // 系统数据
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
            
            // 模型关联网络
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
            
            // 标签分类
            tagCategories: {
                "核心模型": ["🧠 核心模型", "🌌 哲学/存在智慧", "🔄 系统/模型整合", "⚙️ 决策/行动", "🎭 荒诞/幽默"],
                "关系与情感": ["💞 亲密关系/情感", "💔 失去/告别", "⚖️ 期望/错位", "🌱 成长/历程", "😶 道德/伦理"],
                "时间与存在": ["⏳ 时间/宿命", "⏰ 记忆/遗忘", "🌍 存在/感知", "🌀 循环/重复", "🚶 历程/路径"],
                "艺术与表达": ["🎵 歌曲分析", "🎭 文艺批评", "🎨 艺术/象征", "🗣️ 语言/叙事", "📚 文本分析"],
                "社会与系统": ["⚔️ 反抗/边缘", "🔄 系统/结构", "🏛️ 制度/权力", "🌐 网络/连接", "⚖️ 伦理/责任"],
                "特殊状态": ["🔥 极端体验", "🌀 解构/重构", "🎯 聚焦/专注", "💡 灵感/洞见", "🛡️ 防御/保护"]
            },
            
            // 系统信息
            currentVersion: 'v22.48',
            lastSaved: new Date().toISOString(),
            
            // 序列号
            nextThoughtId: 124,
            nextModelId: 81,
            
            // 版本控制
            dataVersion: this.DATA_VERSION,
            
            // 元数据
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
    },
    
    // 数据迁移
    migrateData: function(data) {
        // 如果数据没有版本号，说明是旧版本
        if (!data.dataVersion || data.dataVersion !== this.DATA_VERSION) {
            console.log(`数据迁移: ${data.dataVersion || '旧版本'} -> ${this.DATA_VERSION}`);
            
            // 确保所有必需字段都存在
            const defaultData = this.createDefaultData();
            
            // 合并数据，新字段用默认值，旧字段保留
            const migrated = {
                ...defaultData,
                ...data,
                // 确保核心数据字段不被覆盖为undefined
                thoughts: data.thoughts || defaultData.thoughts,
                models: data.models || defaultData.models,
                tags: data.tags || defaultData.tags,
                timeline: data.timeline || defaultData.timeline,
                modelConnections: data.modelConnections || defaultData.modelConnections,
                currentVersion: data.currentVersion || defaultData.currentVersion,
                lastSaved: data.lastSaved || defaultData.lastSaved,
                nextThoughtId: data.nextThoughtId || defaultData.nextThoughtId,
                nextModelId: data.nextModelId || defaultData.nextModelId,
                // 更新版本号
                dataVersion: this.DATA_VERSION,
                // 保留创建时间，更新修改时间
                createdAt: data.createdAt || defaultData.createdAt,
                lastModified: new Date().toISOString()
            };
            
            // 保存迁移后的数据
            this.saveData(migrated);
            
            return migrated;
        }
        
        // 已经是当前版本，直接返回
        return data;
    },
    
    // 保存数据
    saveData: function(dataUpdates) {
        try {
            // 获取当前数据
            const currentData = this.getFullData();
            
            // 合并数据
            const newData = {
                ...currentData,
                ...dataUpdates,
                lastSaved: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
            
            // 验证数据
            if (!this.validateData(newData)) {
                throw new Error('数据验证失败');
            }
            
            // 保存到本地存储
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newData));
            
            console.log('数据保存成功:', {
                thoughts: newData.thoughts.length,
                models: newData.models.length,
                tags: Object.keys(newData.tags).length
            });
            
            // 触发数据更新事件
            this.triggerDataUpdate();
            
            return { success: true, data: newData };
            
        } catch (error) {
            console.error('保存数据失败:', error);
            return { success: false, error: error.message };
        }
    },
    
    // 验证数据
    validateData: function(data) {
        // 必需字段检查
        const requiredFields = ['thoughts', 'models', 'tags', 'currentVersion'];
        for (const field of requiredFields) {
            if (!(field in data)) {
                console.error(`数据验证失败: 缺少必需字段 ${field}`);
                return false;
            }
        }
        
        // 类型检查
        if (!Array.isArray(data.thoughts) || !Array.isArray(data.models) || typeof data.tags !== 'object') {
            console.error('数据验证失败: 字段类型错误');
            return false;
        }
        
        // 思考记录ID唯一性检查
        const thoughtIds = new Set();
        for (const thought of data.thoughts) {
            if (thoughtIds.has(thought.id)) {
                console.error(`数据验证失败: 思考记录ID重复 ${thought.id}`);
                return false;
            }
            thoughtIds.add(thought.id);
        }
        
        // 模型ID唯一性检查
        const modelIds = new Set();
        for (const model of data.models) {
            if (modelIds.has(model.id)) {
                console.error(`数据验证失败: 模型ID重复 ${model.id}`);
                return false;
            }
            modelIds.add(model.id);
        }
        
        return true;
    },
    
    // 触发数据更新事件
    triggerDataUpdate: function() {
        // 创建storage事件（模拟其他标签页的存储事件）
        try {
            const event = new StorageEvent('storage', {
                key: this.STORAGE_KEY,
                newValue: localStorage.getItem(this.STORAGE_KEY),
                oldValue: localStorage.getItem(this.STORAGE_KEY),
                storageArea: localStorage,
                url: window.location.href
            });
            
            // 手动触发storage事件
            window.dispatchEvent(event);
            
        } catch (e) {
            // 在某些浏览器中无法创建StorageEvent，使用自定义事件
            window.dispatchEvent(new CustomEvent('unified-data-updated', {
                detail: { timestamp: Date.now() }
            }));
        }
    },
    
    // 数据一致性检查
    checkConsistency: function() {
        try {
            const data = this.getFullData();
            
            // 检查思考记录的标签是否在tags中有计数
            const tagCounts = { ...data.tags };
            
            // 重新计算标签
            data.thoughts.forEach(thought => {
                if (thought.tags && Array.isArray(thought.tags)) {
                    thought.tags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                }
            });
            
            data.models.forEach(model => {
                if (model.tags && Array.isArray(model.tags)) {
                    model.tags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                }
            });
            
            // 比较标签计数
            const inconsistencies = [];
            for (const tag in data.tags) {
                if (data.tags[tag] !== tagCounts[tag]) {
                    inconsistencies.push({
                        tag: tag,
                        stored: data.tags[tag],
                        calculated: tagCounts[tag]
                    });
                }
            }
            
            return {
                consistent: inconsistencies.length === 0,
                stats: {
                    thoughts: data.thoughts.length,
                    models: data.models.length,
                    tags: Object.keys(data.tags).length,
                    timeline: data.timeline.length,
                    modelConnections: Object.keys(data.modelConnections).length
                },
                inconsistencies: inconsistencies,
                lastSaved: data.lastSaved,
                version: data.currentVersion
            };
            
        } catch (error) {
            return {
                consistent: false,
                error: error.message,
                stats: null
            };
        }
    },
    
    // 修复数据
    repairData: function() {
        console.log('开始修复数据...');
        
        try {
            // 备份当前数据
            const backupKey = this.STORAGE_KEY + '_backup_' + new Date().toISOString().replace(/[:.]/g, '-');
            const currentData = localStorage.getItem(this.STORAGE_KEY);
            
            if (currentData) {
                localStorage.setItem(backupKey, currentData);
                console.log('数据备份已创建:', backupKey);
            }
            
            // 获取并验证数据
            const data = this.getFullData();
            
            // 重新计算标签
            const recalculatedTags = {};
            
            data.thoughts.forEach(thought => {
                if (thought.tags && Array.isArray(thought.tags)) {
                    thought.tags.forEach(tag => {
                        recalculatedTags[tag] = (recalculatedTags[tag] || 0) + 1;
                    });
                }
            });
            
            data.models.forEach(model => {
                if (model.tags && Array.isArray(model.tags)) {
                    model.tags.forEach(tag => {
                        recalculatedTags[tag] = (recalculatedTags[tag] || 0) + 1;
                    });
                }
            });
            
            // 更新标签
            data.tags = recalculatedTags;
            
            // 更新序列号
            if (data.thoughts.length > 0) {
                const thoughtNumbers = data.thoughts
                    .map(t => parseInt(t.id.replace('#', '')))
                    .filter(n => !isNaN(n));
                
                if (thoughtNumbers.length > 0) {
                    data.nextThoughtId = Math.max(...thoughtNumbers) + 1;
                }
            }
            
            if (data.models.length > 0) {
                const modelNumbers = data.models
                    .map(m => parseInt(m.id.replace('M-', '')))
                    .filter(n => !isNaN(n));
                
                if (modelNumbers.length > 0) {
                    data.nextModelId = Math.max(...modelNumbers) + 1;
                }
            }
            
            // 保存修复后的数据
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            
            console.log('数据修复完成');
            return { success: true, data: data };
            
        } catch (error) {
            console.error('修复数据失败:', error);
            return { success: false, error: error.message };
        }
    },
    
    // 导出数据
    exportData: function() {
        try {
            const data = this.getFullData();
            const exportData = {
                ...data,
                exportInfo: {
                    exportedAt: new Date().toISOString(),
                    source: '思维协同处理器',
                    version: data.currentVersion
                }
            };
            
            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('导出数据失败:', error);
            return null;
        }
    },
    
    // 导入数据
    importData: function(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            
            // 基本验证
            if (!imported.thoughts || !imported.models) {
                throw new Error('数据格式无效：缺少必要字段');
            }
            
            // 备份当前数据
            this.createBackup();
            
            // 使用迁移逻辑处理导入的数据
            const migratedData = this.migrateData(imported);
            
            // 保存数据
            const result = this.saveData(migratedData);
            
            if (result.success) {
                console.log('数据导入成功');
                return { success: true, message: '数据导入成功' };
            } else {
                throw new Error('保存导入的数据失败');
            }
            
        } catch (error) {
            console.error('导入数据失败:', error);
            return { success: false, error: error.message };
        }
    },
    
    // 创建备份
    createBackup: function() {
        try {
            const backupKey = 'backup_' + this.STORAGE_KEY + '_' + new Date().toISOString().replace(/[:.]/g, '-');
            const currentData = localStorage.getItem(this.STORAGE_KEY);
            
            if (currentData) {
                localStorage.setItem(backupKey, currentData);
                console.log('备份创建成功:', backupKey);
                return backupKey;
            }
        } catch (error) {
            console.error('创建备份失败:', error);
        }
        return null;
    },
    
    // 清除数据
    clearData: function() {
        if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
            // 创建备份
            this.createBackup();
            
            // 清除数据
            localStorage.removeItem(this.STORAGE_KEY);
            
            console.log('数据已清除');
            return true;
        }
        return false;
    },
    
    // 获取统计信息
    getStats: function() {
        const data = this.getFullData();
        return {
            thoughts: data.thoughts.length,
            models: data.models.length,
            tags: Object.keys(data.tags).length,
            timeline: data.timeline.length,
            modelConnections: Object.keys(data.modelConnections).length,
            version: data.currentVersion,
            lastSaved: data.lastSaved,
            dataVersion: data.dataVersion
        };
    },
    
    // 初始化
    init: function() {
        console.log('统一数据管理器初始化...');
        
        // 检查数据一致性
        const consistency = this.checkConsistency();
        
        if (!consistency.consistent) {
            console.warn('数据不一致，尝试修复...', consistency.inconsistencies);
            this.repairData();
        }
        
        // 设置storage事件监听
        this.setupStorageListener();
        
        return this.getStats();
    },
    
    // 设置storage事件监听
    setupStorageListener: function() {
        // 监听storage事件（来自其他标签页）
        window.addEventListener('storage', (event) => {
            if (event.key === this.STORAGE_KEY && event.newValue) {
                console.log('检测到其他页面数据更新，重新加载数据...');
                
                // 触发重新加载
                window.dispatchEvent(new CustomEvent('data-refresh-required'));
            }
        });
    }
};

// 全局可用
if (typeof window !== 'undefined') {
    window.UnifiedDataManager = UnifiedDataManager;
}

console.log('统一数据管理器加载完成');
