# PC Builder Studio - 功能配置完成说明

## 已配置功能

### 1. 装机功能

#### 数据库表
- `builds` - 存储配置方案
- `posts` - 存储对应的帖子内容
- `profiles` - 用户资料表（关联）

#### API工具
创建了完整的API工具函数（`pcbuilder/utils/api.js`）：
- `buildsAPI` - 配置相关操作
  - `createBuild()` - 创建新配置
  - `getBuilds()` - 获取配置列表
  - `getBuildDetail()` - 获取配置详情
  - `updateBuild()` - 更新配置
  - `deleteBuild()` - 删除配置

#### 页面更新
**builder页面**（`pcbuilder/pages/builder/`）：
- 添加了保存配置功能
- 集成了 `buildsAPI.createBuild()` 方法
- 支持配置名称、描述、标签设置
- 自动计算总价和性能分数
- 保存成功后跳转到配置详情页

#### 使用方式
1. 在builder页面选择硬件组件
2. 点击"保存配置"按钮
3. 填写配置名称和描述
4. 选择用途标签（游戏、办公、设计等）
5. 确认保存，自动创建build和post记录

---

### 2. 卡片上传功能

#### 数据库配置
- `storage` bucket - Supabase存储桶（名为 'builds'）

#### API工具
- `storageAPI` - 文件上传操作
  - `uploadImage(filePath, fileName)` - 上传指定图片
  - `chooseAndUploadImage()` - 选择并上传图片（从相册或拍照）

#### 上传流程
1. 用户选择图片（相册/拍照）
2. 图片自动压缩
3. 上传到Supabase Storage
4. 返回公共URL
5. URL可用于配置的封面图

#### 使用示例
```javascript
// 方式1：选择并上传
const result = await storageAPI.chooseAndUploadImage();
if (result.success) {
  console.log('图片URL:', result.url);
}

// 方式2：上传指定图片
const result = await storageAPI.uploadImage(tempFilePath, 'image.jpg');
```

---

### 3. 卡片点赞评论功能

#### 数据库表
- `likes` - 点赞记录
- `comments` - 评论记录
- `saves` - 收藏记录

#### API工具
- `likesAPI` - 点赞相关
  - `likePost(postId)` - 点赞/取消点赞
  - `checkLikeStatus(postId)` - 检查点赞状态
  - `getUserLikes()` - 获取用户点赞列表

- `commentsAPI` - 评论相关
  - `addComment(postId, content, parentId)` - 发表评论
  - `getComments(postId, parentId)` - 获取评论列表
  - `deleteComment(commentId)` - 删除评论

- `savesAPI` - 收藏相关
  - `toggleSaveBuild(buildId)` - 收藏/取消收藏
  - `checkSaveStatus(buildId)` - 检查收藏状态
  - `getUserSaves()` - 获取用户收藏列表

#### 页面更新
**post-detail页面**（`pcbuilder/pages/post-detail/`）：
- ✅ 点赞功能：可点赞/取消点赞，实时更新点赞数
- ✅ 收藏功能：可收藏/取消收藏配置
- ✅ 评论功能：
  - 发表评论
  - 查看评论列表
  - 回复评论
  - 删除自己的评论
- ✅ 评论输入框：支持多行输入，自动高度
- ✅ 评论状态管理：加载时自动检查点赞和收藏状态

#### UI特性
- 点赞状态高亮显示（❤️ vs 🤍）
- 收藏状态高亮显示（⭐ vs ☆）
- 评论列表支持无限滚动
- 评论时间格式化显示（刚刚、X分钟前、X小时前等）
- 支持回复评论（@用户名）
- 支持删除自己的评论

---

## 数据库触发器

数据库已配置自动更新触发器：
1. 点赞时自动更新 `posts.likes_count`
2. 评论时自动更新 `posts.comments_count`
3. 收藏时自动更新 `builds.favorites_count`
4. 所有表自动更新 `updated_at` 时间戳

---

## 权限策略

### Row Level Security (RLS)
所有表都启用了RLS策略：
- 公开内容：所有人可读
- 用户内容：仅用户本人可读写
- 点赞/评论：用户只能操作自己的记录

---

## 使用示例

### 创建配置并分享
```javascript
// 1. 在builder页面配置硬件
// 2. 保存配置
await buildsAPI.createBuild({
  title: '我的游戏主机',
  description: '适合主流3A游戏',
  components: {...},
  total_price: 8999,
  performance_score: 85,
  purpose: '游戏',
  tags: ['游戏', '高性能']
});

// 3. 自动创建对应的post记录
// 4. 其他用户可以在post-detail页面查看、点赞、评论
```

### 点赞帖子
```javascript
// post-detail页面自动处理
await likesAPI.likePost(postId);
// 自动更新UI和点赞数
```

### 发表评论
```javascript
await commentsAPI.addComment(postId, '这个配置很棒！');
// 自动刷新评论列表
```

---

## 技术栈

- **前端框架**：微信小程序
- **数据库**：Supabase (PostgreSQL)
- **存储**：Supabase Storage
- **认证**：Supabase Auth

---

## 后续优化建议

1. **图片上传**
   - 添加图片压缩和裁剪功能
   - 支持多图上传
   - 添加图片预览功能

2. **评论功能**
   - 支持评论的点赞
   - 支持评论的表情
   - 添加评论通知功能

3. **配置功能**
   - 支持配置模板
   - 配置导出/导入
   - 配置对比功能

4. **性能优化**
   - 添加数据缓存
   - 实现虚拟列表
   - 图片懒加载

---

## 注意事项

1. **登录要求**：创建配置、点赞、评论、收藏都需要用户登录
2. **数据验证**：所有数据都经过前端和后端双重验证
3. **错误处理**：所有API调用都有完善的错误处理和用户提示
4. **网络优化**：使用 wx.showLoading 提供良好的加载体验

---

## 配置完成时间
2026年1月7日
