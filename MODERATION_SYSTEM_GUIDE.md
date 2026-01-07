# 举报和审核系统使用指南

完整的举报、审核和敏感词过滤系统，帮助维护健康的社区环境。

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [组件 API](#组件-api)
- [服务 API](#服务-api)
- [敏感词过滤](#敏感词过滤)
- [数据库表结构](#数据库表结构)
- [使用场景](#使用场景)
- [最佳实践](#最佳实践)

---

## 功能特性

### 1. 举报功能

- ✅ **多种举报类型** - 10种举报类型（垃圾广告、不当内容、骚扰辱骂、暴力恐怖、仇恨言论、虚假信息、版权侵权、冒充他人、欺诈行为、隐私泄露、违法内容）
- ✅ **多种按钮样式** - 图标、文本、图标+文本
- ✅ **详细举报表单** - 选择理由、填写描述、提供证据
- ✅ **举报须知** - 防止恶意举报
- ✅ **已举报状态** - 显示举报状态
- ✅ **成功提示** - 提交成功反馈

### 2. 审核队列

- ✅ **智能排序** - 按优先级排序（暴力/违法优先）
- ✅ **状态管理** - 待审核、审核中、已通过、已拒绝、已忽略
- ✅ **筛选功能** - 按状态、类型筛选
- ✅ **搜索功能** - 搜索用户、内容
- ✅ **统计信息** - 实时统计数据
- ✅ **分页加载** - 支持大量举报
- ✅ **审核记录** - 完整的审核历史

### 3. 敏感词过滤

- ✅ **多类别敏感词** - 6大类别（政治、暴力、色情、违法、攻击、广告）
- ✅ **严重程度分级** - 低、中、高、严重
- ✅ **风险评分** - 0-100分评分系统
- ✅ **智能建议** - 自动生成修改建议
- ✅ **可扩展** - 支持自定义敏感词
- ✅ **实时检测** - 实时过滤内容

---

## 快速开始

### 1. 访问示例页面

```bash
npm run dev
# 访问 http://localhost:3000/examples/moderation-demo
```

### 2. 使用举报按钮

```tsx
import { ReportButton } from '@/components/moderation';

function PostItem({ post }) {
  return (
    <div>
      <div className="post-content">{post.content}</div>
      
      <ReportButton
        targetType="post"
        targetId={post.id}
        targetTitle={post.title}
        targetContent={post.content}
        reportedUserId={post.authorId}
        reportedUserName={post.authorName}
        userId={currentUser.id}
        variant="icon"
        onSubmit={async (data) => {
          await createReport(data);
        }}
      />
    </div>
  );
}
```

### 3. 使用审核队列

```tsx
import { ModerationQueue } from '@/components/moderation';

function AdminDashboard() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const moderator = useCurrentModerator();

  const handleModerate = async (reportId: string, formData: ModerationFormData) => {
    await moderateReport(reportId, formData, moderator.id, moderator.name);
    // 刷新列表
  };

  return (
    <ModerationQueue
      reports={reports}
      moderatorId={moderator.id}
      moderatorName={moderator.name}
      onModerate={handleModerate}
      onRefresh={loadReports}
    />
  );
}
```

### 4. 使用敏感词过滤

```tsx
import { moderateContent, canPublishContent } from '@/lib/utils/sensitive-words';

function PostEditor() {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const result = moderateContent(content);
    
    if (!result.isValid) {
      // 显示错误提示
      showError('内容包含敏感词，请修改');
      return;
    }
    
    // 发布内容
    await publishPost(content);
  };

  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  );
}
```

---

## 组件 API

### ReportButton

举报按钮组件。

#### Props

```typescript
interface ReportButtonProps {
  /** 目标类型 */
  targetType: ReportTargetType;
  /** 目标ID */
  targetId: string;
  /** 目标标题 */
  targetTitle?: string;
  /** 目标内容 */
  targetContent?: string;
  /** 被举报用户ID */
  reportedUserId: string;
  /** 被举报用户名 */
  reportedUserName: string;
  /** 当前用户ID */
  userId: string;
  /** 是否已举报 */
  isReported?: boolean;
  /** 按钮样式 */
  variant?: 'icon' | 'text' | 'both';
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 自定义样式 */
  className?: string;
  /** 提交成功回调 */
  onSuccess?: (reportId: string) => void;
  /** 提交失败回调 */
  onError?: (error: Error) => void;
  /** 自定义提交函数 */
  onSubmit?: (data: ReportFormData) => Promise<void>;
}
```

#### 使用示例

```tsx
// 基础使用
<ReportButton
  targetType="post"
  targetId={post.id}
  targetTitle={post.title}
  reportedUserId={post.authorId}
  reportedUserName={post.authorName}
  userId={currentUser.id}
/>

// 自定义提交
<ReportButton
  targetType="comment"
  targetId={comment.id}
  targetContent={comment.content}
  reportedUserId={comment.authorId}
  reportedUserName={comment.authorName}
  userId={currentUser.id}
  variant="both"
  onSubmit={async (data) => {
    await ModerationService.createReport({
      targetType: 'comment',
      targetId: comment.id,
      reportedUserId: comment.authorId,
      reason: {
        type: data.reasonType,
        description: data.description,
      },
      reporterId: currentUser.id,
    });
  }}
/>
```

### ModerationQueue

审核队列组件。

#### Props

```typescript
interface ModerationQueueProps {
  /** 举报列表 */
  reports: ReportData[];
  /** 当前管理员ID */
  moderatorId: string;
  /** 当前管理员名称 */
  moderatorName: string;
  /** 审核中 */
  reviewing?: boolean;
  /** 加载中 */
  loading?: boolean;
  /** 自定义样式 */
  className?: string;
  /** 审核回调 */
  onModerate?: (reportId: string, formData: ModerationFormData) => Promise<void>;
  /** 标记审核中回调 */
  onMarkReviewing?: (reportId: string) => Promise<void>;
  /** 刷新回调 */
  onRefresh?: () => Promise<void>;
  /** 分页参数 */
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}
```

#### 使用示例

```tsx
<ModerationQueue
  reports={reports}
  moderatorId={moderator.id}
  moderatorName={moderator.name}
  onModerate={handleModerate}
  onMarkReviewing={handleMarkReviewing}
  onRefresh={loadReports}
  pagination={{
    page: currentPage,
    pageSize: 10,
    total: totalReports,
    onPageChange: setCurrentPage,
  }}
/>
```

---

## 服务 API

### ModerationService

举报和审核服务。

#### 创建举报

```typescript
import { ModerationService } from '@/lib/supabase/moderation';

const report = await ModerationService.createReport({
  targetType: ReportTargetType.POST,
  targetId: 'post-123',
  targetTitle: '帖子标题',
  targetContent: '帖子内容',
  reportedUserId: 'user-456',
  reason: {
    type: ReportType.HARASSMENT,
    description: '用户发布不当内容',
  },
  reporterId: 'user-789',
});
```

#### 获取举报列表

```typescript
const { reports, total } = await ModerationService.getReports({
  status: ModerationStatus.PENDING,
  targetType: ReportTargetType.POST,
  limit: 20,
  offset: 0,
  sortBy: 'priority',
  order: 'desc',
});
```

#### 获取审核队列

```typescript
const { items, total } = await ModerationService.getModerationQueue({
  status: ModerationStatus.PENDING,
  limit: 20,
});

items.forEach(item => {
  console.log(item.report);
  console.log(item.priority);
  console.log(item.riskLevel);
});
```

#### 审核举报

```typescript
await ModerationService.moderateReport(
  'report-123',
  {
    action: ModerationAction.DELETE_CONTENT,
    note: '删除内容并警告用户',
    warningUser: true,
    notifyReporter: true,
  },
  moderatorId,
  moderatorName
);
```

#### 获取统计数据

```typescript
const stats = await ModerationService.getReportStats({
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 最近7天
  endDate: new Date(),
});

console.log(stats.totalReports);       // 总举报数
console.log(stats.pendingReports);     // 待审核数
console.log(stats.approvedReports);    // 已通过数
console.log(stats.avgResponseTime);    // 平均响应时间（小时）
```

#### 订阅实时更新

```typescript
useEffect(() => {
  const unsubscribe = ModerationService.subscribeToReports(
    (report) => {
      console.log('收到新举报:', report);
      // 更新UI
    },
    {
      status: ModerationStatus.PENDING,
    }
  );

  return () => unsubscribe();
}, []);
```

---

## 敏感词过滤

### 检查敏感词

```typescript
import { checkSensitiveWords } from '@/lib/utils/sensitive-words';

const matches = checkSensitiveWords('这是一条包含暴力恐怖的内容');

matches.forEach(match => {
  console.log(match.word);      // '暴力'
  console.log(match.position);  // 8
  console.log(match.category);  // '暴力恐怖'
  console.log(match.severity);  // 'critical'
});
```

### 内容审核

```typescript
import { moderateContent } from '@/lib/utils/sensitive-words';

const result = moderateContent('这是一条测试内容', {
  maxScore: 50,       // 最大允许分数
  requireAutoBan: 90, // 自动封禁分数
});

console.log(result.isValid);           // 是否通过
console.log(result.hasSensitiveWords); // 是否包含敏感词
console.log(result.score);             // 风险分数
console.log(result.suggestions);      // 修改建议
```

### 替换敏感词

```typescript
import { replaceSensitiveWords } from '@/lib/utils/sensitive-words';

const cleaned = replaceSensitiveWords(
  '这是一条包含暴力和恐怖的内容',
  '*'
);
// '这是一条包含**和****的内容'
```

### 风险等级

```typescript
import { getRiskLevel } from '@/lib/utils/sensitive-words';

const riskLevel = getRiskLevel('这是一条测试内容');
// 'none' | 'low' | 'medium' | 'high' | 'critical'
```

### 添加自定义敏感词

```typescript
import { addSensitiveWords } from '@/lib/utils/sensitive-words';

addSensitiveWords(
  '自定义类别',
  ['敏感词1', '敏感词2'],
  'high'
);
```

---

## 数据库表结构

### reports 表（举报表）

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type VARCHAR(50) NOT NULL,           -- 目标类型
  target_id VARCHAR(255) NOT NULL,             -- 目标ID
  target_title TEXT,                          -- 目标标题
  target_content TEXT,                        -- 目标内容
  reporter_id VARCHAR(255) NOT NULL,          -- 举报人ID
  reporter_name VARCHAR(255),                 -- 举报人名称
  reporter_avatar TEXT,                       -- 举报人头像
  reported_user_id VARCHAR(255) NOT NULL,      -- 被举报人ID
  reported_user_name VARCHAR(255),            -- 被举报人名称
  reported_user_avatar TEXT,                  -- 被举报人头像
  reason_type VARCHAR(50) NOT NULL,           -- 举报类型
  reason_description TEXT,                    -- 举报描述
  reason_evidence TEXT,                       -- 证据
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 状态
  moderation_action VARCHAR(50),             -- 处理结果
  moderator_id VARCHAR(255),                  -- 审核员ID
  moderator_name VARCHAR(255),                -- 审核员名称
  note TEXT,                                 -- 审核备注
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMP                       -- 审核时间
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_reported ON reports(reported_user_id);
```

### moderation_records 表（审核记录表）

```sql
CREATE TABLE moderation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id), -- 举报ID
  moderator_id VARCHAR(255) NOT NULL,              -- 审核员ID
  moderator_name VARCHAR(255),                     -- 审核员名称
  action VARCHAR(50) NOT NULL,                     -- 操作
  note TEXT,                                      -- 备注
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_moderation_records_report ON moderation_records(report_id);
```

---

## 使用场景

### 1. 帖子举报

```tsx
function PostItem({ post }) {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      
      <div className="flex gap-2">
        <ReportButton
          targetType="post"
          targetId={post.id}
          targetTitle={post.title}
          targetContent={post.content}
          reportedUserId={post.authorId}
          reportedUserName={post.authorName}
          userId={currentUser.id}
          variant="icon"
        />
      </div>
    </div>
  );
}
```

### 2. 评论举报

```tsx
function CommentItem({ comment }) {
  return (
    <div>
      <p>{comment.content}</p>
      
      <ReportButton
        targetType="comment"
        targetId={comment.id}
        targetContent={comment.content}
        reportedUserId={comment.authorId}
        reportedUserName={comment.authorName}
        userId={currentUser.id}
        variant="text"
      />
    </div>
  );
}
```

### 3. 管理员审核

```tsx
function AdminModeration() {
  const [reports, setReports] = useState<ReportData[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const handleModerate = async (reportId: string, formData: ModerationFormData) => {
    await ModerationService.moderateReport(
      reportId,
      formData,
      moderator.id,
      moderator.name
    );
    loadReports();
  };

  return (
    <ModerationQueue
      reports={reports}
      moderatorId={moderator.id}
      moderatorName={moderator.name}
      onModerate={handleModerate}
      onRefresh={loadReports}
    />
  );
}
```

### 4. 发布前内容审核

```tsx
function PostEditor() {
  const [content, setContent] = useState('');

  const handlePublish = async () => {
    const result = moderateContent(content);
    
    if (!result.isValid) {
      // 显示敏感词详情
      showSensitiveWordsAlert(result);
      return;
    }
    
    // 发布内容
    await publishPost(content);
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handlePublish}>发布</button>
    </div>
  );
}
```

---

## 最佳实践

### 1. 举报频率限制

```typescript
// 检查用户举报频率
async function canReport(userId: string): Promise<boolean> {
  const recentReports = await getRecentReports(userId, 24); // 24小时内
  return recentReports.length < 5; // 最多5次
}

// 在举报按钮中使用
<ReportButton
  onSubmit={async (data) => {
    if (!(await canReport(currentUser.id))) {
      showError('举报次数过多，请稍后再试');
      return;
    }
    await createReport(data);
  }}
/>
```

### 2. 智能优先级排序

```typescript
// 在审核队列中，高优先级举报会排在前面
const { items } = await ModerationQueue.getModerationQueue({
  status: ModerationStatus.PENDING,
});

// items 已按优先级排序，暴力、违法等高优先级举报排在前面
```

### 3. 审核响应时间

```typescript
// 设置审核响应时间目标
const TARGET_RESPONSE_TIME = 24; // 24小时

// 定期检查超时举报
useEffect(() => {
  const interval = setInterval(async () => {
    const stats = await ModerationService.getReportStats();
    if (stats.avgResponseTime > TARGET_RESPONSE_TIME) {
      // 发送告警
      sendAlert('审核响应时间超过目标');
    }
  }, 60000); // 每分钟检查

  return () => clearInterval(interval);
}, []);
```

### 4. 举报分析

```typescript
// 分析举报类型分布
async function analyzeReports() {
  const stats = await ModerationService.getReportStats();
  
  // 按类型排序
  const sortedByType = Object.entries(stats.reportsByType)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({ type, count }));
  
  // 找出最常见的举报类型
  const topType = sortedByType[0];
  console.log('最常见的举报类型:', topType);
  
  // 根据分析结果调整策略
  if (topType.type === ReportType.SPAM) {
    // 加强垃圾内容过滤
  }
}
```

### 5. 敏感词库管理

```typescript
// 定期更新敏感词库
async function updateSensitiveWords() {
  const response = await fetch('/api/sensitive-words');
  const words = await response.json();
  
  // 更新敏感词库
  words.categories.forEach(category => {
    addSensitiveWords(
      category.name,
      category.words,
      category.severity
    );
  });
}

// 定时更新（每天一次）
useEffect(() => {
  updateSensitiveWords();
  const interval = setInterval(updateSensitiveWords, 24 * 60 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

### 6. 用户体验优化

```typescript
// 举报成功后提供反馈
<ReportButton
  onSuccess={(reportId) => {
    showToast('举报提交成功，感谢你的反馈');
    // 可选：更新UI显示已举报状态
    setReported(reportId);
  }}
  onError={(error) => {
    showToast('举报提交失败: ' + error.message, 'error');
  }}
/>
```

---

## 总结

举报和审核系统提供：

✅ **举报功能** - 10种举报类型，多种按钮样式
✅ **审核队列** - 智能排序，筛选搜索，统计信息
✅ **敏感词过滤** - 6大类别，4级严重程度，风险评分
✅ **实时更新** - Supabase Realtime 支持
✅ **完整服务** - 创建、查询、审核、统计
✅ **类型安全** - 完整 TypeScript 支持
✅ **响应式设计** - 适配各种设备
✅ **动画效果** - Framer Motion 平滑动画

完善的举报和审核系统帮助维护健康的社区环境！
