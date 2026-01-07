# PC Builder Studio - 图标配置完整指南

## 📁 图标目录结构

```
pcbuilder/
├── images/
│   ├── icons/                    # 组件和功能图标
│   │   ├── components/           # 硬件组件图标
│   │   ├── ui/                  # UI交互图标
│   │   ├── social/              # 社交互动图标
│   │   └── status/              # 状态图标
│   ├── tabbar/                  # 底部导航图标
│   └── placeholder/             # 占位图
└── utils/
    └── icon-map.js              # 图标映射配置
```

---

## 🎯 一、硬件组件图标 (images/icons/components/)

### 1. CPU 相关图标
```
✓ cpu.png (128×128px) - CPU/处理器
✓ cpu-lga1700.png (64×64px) - LGA1700插槽
✓ cpu-am4.png (64×64px) - AM4插槽
✓ cpu-am5.png (64×64px) - AM5插槽
```

### 2. GPU 相关图标
```
✓ gpu.png (128×128px) - 显卡
✓ gpu-nvidia.png (64×64px) - NVIDIA显卡
✓ gpu-amd.png (64×64px) - AMD显卡
```

### 3. 主板相关图标
```
✓ motherboard.png (128×128px) - 主板
✓ motherboard-z790.png (64×64px) - Z790芯片组
✓ motherboard-b660.png (64×64px) - B660芯片组
```

### 4. 内存相关图标
```
✓ memory.png (128×128px) - 内存条
✓ memory-ddr4.png (64×64px) - DDR4内存
✓ memory-ddr5.png (64×64px) - DDR5内存
```

### 5. 存储相关图标
```
✓ storage.png (128×128px) - 硬盘
✓ storage-ssd.png (64×64px) - SSD固态硬盘
✓ storage-hdd.png (64×64px) - HDD机械硬盘
✓ storage-nvme.png (64×64px) - NVMe固态
```

### 6. 电源相关图标
```
✓ power.png (128×128px) - 电源
✓ power-550w.png (64×64px) - 550W电源
✓ power-750w.png (64×64px) - 750W电源
```

### 7. 机箱相关图标
```
✓ case.png (128×128px) - 机箱
✓ case-atx.png (64×64px) - ATX机箱
✓ case-matx.png (64×64px) - mATX机箱
```

### 8. 散热相关图标
```
✓ cooler.png (128×128px) - 散热器
✓ cooler-air.png (64×64px) - 风冷散热
✓ cooler-water.png (64×64px) - 水冷散热
```

### 9. 通用图标
```
✓ component.png (128×128px) - 通用组件
✓ empty.png (128×128px) - 空状态
```

---

## 🔧 二、UI交互图标 (images/icons/ui/)

### 操作类图标
```
✓ back.png (48×48px) - 返回/后退
✓ close.png (48×48px) - 关闭
✓ more.png (48×48px) - 更多/菜单
✓ menu.png (48×48px) - 菜单
✓ search.png (48×48px) - 搜索
✓ filter.png (48×48px) - 筛选
✓ sort.png (48×48px) - 排序
✓ refresh.png (48×48px) - 刷新
```

### 编辑类图标
```
✓ edit.png (48×48px) - 编辑
✓ delete.png (48×48px) - 删除
✓ copy.png (48×48px) - 复制
✓ paste.png (48×48px) - 粘贴
✓ save.png (48×48px) - 保存
✓ upload.png (48×48px) - 上传
✓ download.png (48×48px) - 下载
```

### 输入类图标
```
✓ clear.png (48×48px) - 清除/重置
✓ confirm.png (48×48px) - 确认
✓ cancel.png (48×48px) - 取消
```

---

## 💬 三、社交互动图标 (images/icons/social/)

### 点赞收藏类
```
✓ like.png (48×48px) - 点赞（未选中）
✓ like-active.png (48×48px) - 点赞（已选中）❤️
✓ save.png (48×48px) - 收藏（未选中）☆
✓ save-active.png (48×48px) - 收藏（已选中）⭐
```

### 评论分享类
```
✓ comment.png (48×48px) - 评论💬
✓ share.png (48×48px) - 分享📤
✓ reply.png (48×48px) - 回复
✓ mention.png (48×48px) - @提及
```

### 关注类
```
✓ follow.png (48×48px) - 关注
✓ following.png (48×48px) - 已关注
```

---

## ✅ 四、状态图标 (images/icons/status/)

### 成功状态
```
✓ success.png (64×64px) - 成功✅
✓ success-circle.png (64×64px) - 成功圆形
```

### 错误状态
```
✓ error.png (64×64px) - 错误❌
✓ error-circle.png (64×64px) - 错误圆形
```

### 警告状态
```
✓ warning.png (64×64px) - 警告⚠️
✓ warning-circle.png (64×64px) - 警告圆形
```

### 信息状态
```
✓ info.png (64×64px) - 信息ℹ️
✓ loading.png (64×64px) - 加载中（动画）
✓ empty.png (64×64px) - 空状态
```

---

## 📱 五、底部导航图标 (images/tabbar/)

### 首页图标
```
✓ home.png (81×81px) - 首页（未选中）
✓ home-active.png (81×81px) - 首页（已选中）
  - 颜色: 未选中 #999999 / 选中 #3B82F6
  - 图标: 房子/主页图标
```

### 装机图标
```
✓ builder.png (81×81px) - 装机（未选中）
✓ builder-active.png (81×81px) - 装机（已选中）
  - 颜色: 未选中 #999999 / 选中 #3B82F6
  - 图标: 电脑/CPU图标
```

### 社区图标
```
✓ community.png (81×81px) - 社区（未选中）
✓ community-active.png (81×81px) - 社区（已选中）
  - 颜色: 未选中 #999999 / 选中 #3B82F6
  - 图标: 气泡/用户组图标
```

### 我的图标
```
✓ profile.png (81×81px) - 我的（未选中）
✓ profile-active.png (81×81px) - 我的（已选中）
  - 颜色: 未选中 #999999 / 选中 #3B82F6
  - 图标: 用户/人像图标
```

---

## 🖼️ 六、占位图 (images/placeholder/)

### 功能占位图
```
✓ placeholder-component.png (400×400px) - 组件占位
✓ placeholder-build.png (400×400px) - 配置占位
✓ placeholder-user.png (100×100px) - 用户头像占位
✓ placeholder-post.png (400×250px) - 帖子占位
```

### 颜色占位图
```
✓ blue-400.png (400×400px) - 蓝色背景 #3B82F6
✓ green-400.png (400×400px) - 绿色背景 #10B981
✓ purple-400.png (400×400px) - 紫色背景 #8B5CF6
✓ gray-100.png (400×400px) - 灰色背景 #F3F4F6
```

---

## 📋 七、Emoji 图标映射（临时方案）

### 硬件相关
```javascript
const COMPONENT_EMOJI = {
  cpu: '💻',
  gpu: '🎮',
  motherboard: '🖥️',
  memory: '💾',
  storage: '💿',
  power: '⚡',
  case: '📦',
  cooler: '❄️'
}
```

### 操作相关
```javascript
const ACTION_EMOJI = {
  back: '←',
  close: '✕',
  more: '⋮',
  search: '🔍',
  filter: '🔽',
  sort: '⇅',
  refresh: '🔄'
}
```

### 社交相关
```javascript
const SOCIAL_EMOJI = {
  like: '👍',
  liked: '❤️',
  save: '☆',
  saved: '⭐',
  comment: '💬',
  share: '📤',
  follow: '➕'
}
```

### 状态相关
```javascript
const STATUS_EMOJI = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  loading: '⏳',
  empty: '📭'
}
```

### 用户相关
```javascript
const USER_EMOJI = {
  user: '👤',
  guest: '👻',
  admin: '👑',
  avatar: '👤',
  anonymous: '👻'
}
```

---

## 🎨 图标设计规范

### 通用规范
- **格式**: PNG（支持透明背景）
- **风格**: 扁平化/线性设计
- **主色调**: #3B82F6（蓝色）
- **辅助色**: 
  - 成功: #10B981（绿色）
  - 警告: #F59E0B（橙色）
  - 错误: #EF4444（红色）
  - 信息: #6366F1（灰色）

### 尺寸规范
| 类型 | 标准尺寸 | 最小尺寸 | 最大尺寸 |
|------|----------|----------|----------|
| 组件图标 | 128×128px | 64×64px | 256×256px |
| UI图标 | 48×48px | 32×32px | 64×64px |
| TabBar图标 | 81×81px | 40×40px | 100×100px |
| 状态图标 | 64×64px | 32×32px | 128×128px |

### 设计原则
1. **简洁明了**: 图标应该一眼就能识别
2. **风格统一**: 所有图标保持相同的设计风格
3. **色彩统一**: 使用项目主色调
4. **适当留白**: 避免图标过于拥挤
5. **圆角统一**: 图标圆角保持一致（建议8-12px）

---

## 🛠️ 图标配置文件

### 创建 utils/icon-map.js

```javascript
// 图标映射配置
module.exports = {
  // 组件图标路径
  componentIcons: {
    cpu: '/images/icons/components/cpu.png',
    gpu: '/images/icons/components/gpu.png',
    motherboard: '/images/icons/components/motherboard.png',
    memory: '/images/icons/components/memory.png',
    storage: '/images/icons/components/storage.png',
    power: '/images/icons/components/power.png',
    case: '/images/icons/components/case.png',
    cooler: '/images/icons/components/cooler.png'
  },

  // UI图标路径
  uiIcons: {
    back: '/images/icons/ui/back.png',
    close: '/images/icons/ui/close.png',
    more: '/images/icons/ui/more.png',
    search: '/images/icons/ui/search.png',
    filter: '/images/icons/ui/filter.png',
    sort: '/images/icons/ui/sort.png',
    refresh: '/images/icons/ui/refresh.png',
    edit: '/images/icons/ui/edit.png',
    delete: '/images/icons/ui/delete.png',
    copy: '/images/icons/ui/copy.png',
    save: '/images/icons/ui/save.png',
    upload: '/images/icons/ui/upload.png',
    download: '/images/icons/ui/download.png'
  },

  // 社交图标路径
  socialIcons: {
    like: '/images/icons/social/like.png',
    likeActive: '/images/icons/social/like-active.png',
    save: '/images/icons/social/save.png',
    saveActive: '/images/icons/social/save-active.png',
    comment: '/images/icons/social/comment.png',
    share: '/images/icons/social/share.png',
    reply: '/images/icons/social/reply.png',
    follow: '/images/icons/social/follow.png',
    following: '/images/icons/social/following.png'
  },

  // 状态图标路径
  statusIcons: {
    success: '/images/icons/status/success.png',
    error: '/images/icons/status/error.png',
    warning: '/images/icons/status/warning.png',
    info: '/images/icons/status/info.png',
    loading: '/images/icons/status/loading.png',
    empty: '/images/icons/status/empty.png'
  },

  // 占位图路径
  placeholders: {
    component: '/images/placeholder/placeholder-component.png',
    build: '/images/placeholder/placeholder-build.png',
    user: '/images/placeholder/placeholder-user.png',
    post: '/images/placeholder/placeholder-post.png'
  },

  // Emoji图标（备用方案）
  emojiIcons: {
    // 硬件
    cpu: '💻',
    gpu: '🎮',
    motherboard: '🖥️',
    memory: '💾',
    storage: '💿',
    power: '⚡',
    case: '📦',
    cooler: '❄️',
    
    // 操作
    back: '←',
    close: '✕',
    more: '⋮',
    search: '🔍',
    
    // 社交
    like: '👍',
    liked: '❤️',
    save: '☆',
    saved: '⭐',
    comment: '💬',
    share: '📤',
    
    // 状态
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    
    // 用户
    user: '👤',
    guest: '👻'
  },

  // 获取图标路径的辅助函数
  getIconPath(type, name, useEmoji = false) {
    if (useEmoji) {
      return this.emojiIcons[type]?.[name] || '';
    }
    
    const iconMap = {
      component: this.componentIcons,
      ui: this.uiIcons,
      social: this.socialIcons,
      status: this.statusIcons,
      placeholder: this.placeholders
    };
    
    return iconMap[type]?.[name] || '';
  },

  // 检查图标是否存在
  iconExists(type, name) {
    const path = this.getIconPath(type, name);
    return !!path;
  }
};
```

---

## 📦 推荐图标资源网站

### 免费图标库

#### 1. IconFont（阿里图标库）
- 网址: https://www.iconfont.cn/
- 特点: 图标丰富，免费使用，支持SVG
- 推荐关键词: CPU, GPU, Memory, Motherboard

#### 2. IconPark（字节跳动）
- 网址: https://iconpark.oceanengine.com/
- 特点: 风格现代，完全开源
- 推荐关键词: Computer, Hardware, Components

#### 3. Remix Icon
- 网址: https://remixicon.com/
- 特点: 简洁美观，完全免费，支持SVG
- 推荐关键词: Hardware, Settings, Social

#### 4. Heroicons
- 网址: https://heroicons.com/
- 特点: 简洁优雅，完全免费
- 推荐关键词: UI, Interface, Actions

#### 5. Flaticon
- 网址: https://www.flaticon.com/
- 特点: 质量高，风格多样
- 注意: 需要注意版权，建议使用免费图标

### 设计工具

#### 1. Figma
- 网址: https://www.figma.com/
- 特点: 免费在线设计，团队协作

#### 2. Canva
- 网址: https://www.canva.com/
- 特点: 在线设计，有模板

#### 3. Adobe Illustrator
- 特点: 专业矢量设计工具

#### 4. Sketch
- 平台: Mac
- 特点: UI设计专用工具

---

## 🚀 快速配置步骤

### 方案一：使用在线图标库（推荐）

1. **访问图标库网站**
   - 推荐使用 IconFont 或 Remix Icon

2. **搜索关键词**
   - 硬件组件: `CPU`, `GPU`, `Motherboard`, `Memory`, `Storage`
   - 操作图标: `Search`, `Filter`, `Edit`, `Delete`, `Save`
   - 社交图标: `Like`, `Comment`, `Share`, `Star`

3. **下载图标**
   - 格式选择 PNG
   - 尺寸选择 128×128px（组件）或 48×48px（UI）
   - 下载 PNG 文件

4. **批量调整颜色**
   - 使用在线工具或设计软件
   - 统一颜色为 #3B82F6（主色调）
   - 确保背景透明

5. **保存到对应目录**
   - 硬件图标 → `images/icons/components/`
   - UI图标 → `images/icons/ui/`
   - 社交图标 → `images/icons/social/`
   - 状态图标 → `images/icons/status/`
   - TabBar图标 → `images/tabbar/`

### 方案二：使用 AI 生成图标

1. **使用 AI 工具**
   - Midjourney
   - DALL-E 3
   - Stable Diffusion

2. **提示词模板**
   ```
   "Minimal flat icon of CPU processor, 
   blue color #3B82F6, 
   white background, 
   vector style, 
   simple and clean design"
   ```

3. **调整和导出**
   - 使用设计工具调整尺寸
   - 导出为 PNG 格式
   - 确保背景透明

### 方案三：使用 Emoji 临时方案（当前使用）

优点：
- ✅ 立即可用，无需下载
- ✅ 系统原生，兼容性好
- ✅ 零存储空间

缺点：
- ❌ 风格不统一
- ❌ 不同系统显示不一致
- ❌ 专业度不够

---

## ✅ 图标检查清单

### 准备阶段
- [ ] 确认所有需要的图标类型
- [ ] 选择合适的图标资源网站
- [ ] 下载图标到本地
- [ ] 检查图标格式（PNG）
- [ ] 检查图标尺寸

### 处理阶段
- [ ] 调整图标颜色为项目主色
- [ ] 统一图标风格（扁平化/线性）
- [ ] 确保背景透明
- [ ] 调整图标尺寸符合规范
- [ ] 重命名文件符合规范

### 验证阶段
- [ ] 检查所有图标尺寸一致
- [ ] 检查图标风格统一
- [ ] 检查背景透明
- [ ] 检查格式正确（PNG）
- [ ] 检查文件名规范
- [ ] 检查清晰可见
- [ ] 检查颜色符合项目规范

### 测试阶段
- [ ] 在微信开发者工具中测试
- [ ] 检查 TabBar 图标显示
- [ ] 检查选中状态切换
- [ ] 检查图标在不同屏幕的显示
- [ ] 检查图标加载速度

---

## 📊 统计信息

### 需要的图标总数
- 硬件组件图标: 9 个
- UI交互图标: 15 个
- 社交互动图标: 8 个
- 状态图标: 6 个
- TabBar导航图标: 8 个（4个 × 2状态）
- 占位图: 4 个
- **总计**: 50 个图标

### 优先级排序

**高优先级**（必须立即配置）:
1. TabBar 图标（8个）- 影响导航体验
2. 基础硬件图标（8个）- 核心功能
3. 点赞收藏图标（4个）- 社交功能

**中优先级**（尽快配置）:
4. UI交互图标（15个）- 操作体验
5. 状态图标（6个）- 反馈体验

**低优先级**（后续完善）:
6. 详细硬件图标（额外规格）
7. 占位图（4个）- 已有在线占位服务

---

## 💡 使用示例

### 在 WXML 中使用图标

```xml
<!-- 使用图标映射 -->
<image 
  class="component-icon"
  src="{{iconMap.getIconPath('component', 'cpu')}}"
  mode="aspectFill"
/>

<!-- 使用 Emoji（备用方案）-->
<text class="emoji-icon">{{iconMap.getIconPath('emoji', 'cpu', true)}}</text>
```

### 在 JS 中使用图标

```javascript
const { iconMap } = require('../../utils/icon-map.js');

// 获取组件图标
const cpuIcon = iconMap.getIconPath('component', 'cpu');

// 检查图标是否存在
if (iconMap.iconExists('component', 'cpu')) {
  // 使用图标
}

// 使用 Emoji 作为备用
const fallbackIcon = iconMap.getIconPath('emoji', 'cpu', true);
```

---

## 📞 常见问题

### Q1: 图标显示模糊怎么办？
**A**: 
- 确保 PNG 图标尺寸正确（128×128px 或更大）
- 使用矢量图形而非位图
- 检查是否使用了正确的 `mode` 属性（aspectFit/aspectFill）

### Q2: 图标显示不完整？
**A**:
- 检查图标内容是否超出画布范围
- 确保有足够的留白
- 调整图标的 padding

### Q3: 图标背景有白边？
**A**:
- 使用支持透明背景的 PNG 格式
- 确保图标背景是透明的
- 检查导出设置

### Q4: 图标尺寸不一致？
**A**:
- 所有图标应该是相同的尺寸
- 确保视觉平衡
- 使用统一的画布尺寸

### Q5: TabBar 图标不显示？
**A**:
- 检查 `app.json` 中的路径是否正确
- 确保文件在正确的目录
- 检查文件名是否匹配（区分大小写）
- 重新编译项目

### Q6: 图标颜色不统一？
**A**:
- 使用统一的主色调 (#3B82F6)
- 批量调整图标颜色
- 使用设计工具统一处理

### Q7: 没有合适的图标怎么办？
**A**:
- 使用 Emoji 作为临时方案
- 使用在线占位服务（placehold.co）
- 自己设计简单图标
- 考虑使用 AI 生成图标

---

## 📚 参考资源

### 微信小程序文档
- [小程序图标设计规范](https://developers.weixin.qq.com/miniprogram/design/)
- [TabBar 组件文档](https://developers.weixin.qq.com/miniprogram/dev/component/tabbar.html)

### 设计规范
- [Material Design Icons](https://fonts.google.com/icons)
- [Ant Design Icons](https://ant.design/components/icon/)
- [Fluent UI Icons](https://developer.microsoft.com/fluentui#/)

### 图标工具
- [Icomoon](https://icomoon.io/) - 图标转换工具
- [Favicon.io](https://favicon.io/) - 图标生成工具

---

## 📝 更新日志

### 2026-01-07
- ✅ 创建完整的图标目录结构
- ✅ 整理所有需要的图标类型
- ✅ 添加 Emoji 映射配置
- ✅ 提供图标获取资源网站
- ✅ 编写使用示例代码

---

**最后更新**: 2026-01-07  
**文档版本**: 1.0.0  
**维护者**: PC Builder Studio Team
