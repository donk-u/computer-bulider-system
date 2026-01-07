# 评论发布功能使用指南

完整的评论发布系统，包括增强的评论编辑器、Supabase 集成和状态管理 Hook。

## 📦 功能特性

### 核心功能

- ✅ **自动调整高度** - 根据内容自动调整文本框高度
- ✅ **字符计数** - 实时显示字符计数，接近限制时警告
- ✅ **快捷键提交** - Enter 提交，Shift+Enter 换行
- ✅ **取消确认** - 有内容时取消会弹出确认对话框
- ✅ **Markdown 支持** - 支持粗体、斜体、代码、链接、列表
- ✅ **回复功能** - 支持 @username 提示和层级回复
- ✅ **错误处理** - 完善的错误提示和重试机制
- ✅ **成功提示** - 发布成功后显示提示并自动消失

### 高级功能

- ✅ **Supabase 集成** - 完整的数据库 CRUD 操作
- ✅ **状态管理** - 统一的评论提交状态管理
- ✅ **模拟数据** - 支持模拟模式，便于测试和演示
- ✅ **乐观更新** - 实时更新 UI，无需等待服务器响应
- ✅ **附件支持** - 支持图片和链接附件
- ✅ **表情支持** - 支持插入表情符号
- ✅ **工具栏** - 丰富的格式化工具栏

## 📁 文件结构

```
components/comment/
├── comment.tsx              # 主评论组件
├── comment-list.tsx         # 评论列表组件
├── comment-input.tsx        # 评论输入组件
├── comment-editor.tsx       # 评论编辑器组件（增强版）
└── index.ts                # 组件导出

hooks/
└── use-comment-submit.ts   # 评论提交 Hook

lib/supabase/
└── comments.ts             # Supabase 评论服务

app/examples/
└── comment-submit-demo.tsx # 示例页面
```

## 🚀 快速开始

### 1. 基础使用

```tsx
import { CommentEditor } from '@/components/comment';
import { useCommentSubmit } from '@/hooks/use-comment-submit';

function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);

  const commentSubmit = useCommentSubmit({
    postId: 'post-123',
    onSuccess: (comment) => {
      // 评论发布成功，添加到列表
      setComments(prev => [comment, ...prev]);
    },
    onError: (error) => {
      console.error('评论发布失败:', error);
    },
  });

  return (
    <div>
      <CommentEditor
        postId="post-123"
        user={{
          id: 'user-123',
          username: 'current-user',
          avatar: 'https://example.com/avatar.jpg',
        }}
        placeholder="写下你的评论..."
        submitting={commentSubmit.submitting}
        onSubmit={async (data) => {
          await commentSubmit.submitComment(data.content);
        }}
      />
    </div>
  );
}
```

### 2. 回复评论

```tsx
function ReplyComment() {
  const [replyToUser, setReplyToUser] = useState<string | null>(null);
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);

  const commentSubmit = useCommentSubmit({
    postId: 'post-123',
    onSuccess: (comment) => {
      // 添加回复到评论列表
      setComments(prev =>
        prev.map(c => {
          if (c.id === replyToCommentId) {
            return {
              ...c,
              replies: [...(c.replies || []), comment],
              reply_count: c.reply_count + 1,
            };
          }
          return c;
        })
      );

      // 清除回复状态
      setReplyToUser(null);
      setReplyToCommentId(null);
    },
  });

  return (
    <div>
      {replyToUser && (
        <CommentEditor
          postId="post-123"
          parentId={replyToCommentId || undefined}
          user={currentUser}
          placeholder={`回复 @${replyToUser}...`}
          replyToUser={replyToUser}
          onClearReply={() => {
            setReplyToUser(null);
            setReplyToCommentId(null);
          }}
          submitting={commentSubmit.submitting}
          onSubmit={async (data) => {
            await commentSubmit.submitComment(
              data.content,
              replyToCommentId || undefined
            );
          }}
        />
      )}
    </div>
  );
}
```

### 3. 配置选项

```tsx
<CommentEditor
  postId="post-123"
  user={currentUser}
  placeholder="写下你的评论..."
  config={{
    maxLength: 1000,              // 最大长度（默认：1000）
    allowMarkdown: true,          // 允许 Markdown（默认：true）
    allowAttachments: true,       // 允许附件（默认：true）
    allowEmoji: true,             // 允许表情（默认：true）
    allowMentions: true,          // 允许 @ 提及（默认：true）
    autoResize: true,             // 自动调整高度（默认：true）
    minHeight: 60,                // 最小高度（默认：60px）
    maxHeight: 200,               // 最大高度（默认：200px）
    submitOnEnter: true,          // Enter 提交（默认：true）
    allowShiftEnter: true,        // Shift+Enter 换行（默认：true）
  }}
  submitting={submitting}
  onSubmit={onSubmit}
/>
```

## 🎨 组件 API

### CommentEditor

评论编辑器组件，提供完整的评论编辑功能。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `postId` | `string` | *必需* | 帖子 ID |
| `parentId` | `string` | - | 父评论 ID（回复时使用） |
| `user` | `{ id, username, avatar }` | - | 当前用户信息 |
| `placeholder` | `string` | `"写下你的评论..."` | 占位符文本 |
| `config` | `CommentEditorConfig` | `{}` | 配置选项 |
| `submitting` | `boolean` | `false` | 是否提交中 |
| `replyToUser` | `string` | - | 被回复的用户名 |
| `onSubmit` | `(data) => Promise<any>` | - | 提交回调 |
| `onSuccess` | `(comment) => void` | - | 成功回调 |
| `onError` | `(error) => void` | - | 失败回调 |
| `onCancel` | `() => void` | - | 取消回调 |
| `onClearReply` | `() => void` | - | 清除回复回调 |

### CommentEditorConfig

评论编辑器配置选项。

```typescript
interface CommentEditorConfig {
  maxLength?: number;           // 最大长度（默认：1000）
  allowMarkdown?: boolean;       // 允许 Markdown（默认：true）
  allowAttachments?: boolean;    // 允许附件（默认：true）
  allowEmoji?: boolean;          // 允许表情（默认：true）
  allowMentions?: boolean;       // 允许 @ 提及（默认：true）
  autoResize?: boolean;          // 自动调整高度（默认：true）
  minHeight?: number;            // 最小高度（默认：60px）
  maxHeight?: number;            // 最大高度（默认：200px）
  submitOnEnter?: boolean;       // Enter 提交（默认：true）
  allowShiftEnter?: boolean;     // Shift+Enter 换行（默认：true）
}
```

## 🔧 Hook API

### useCommentSubmit

评论提交状态管理 Hook。

#### 参数

```typescript
{
  postId: string;                // 帖子 ID（必需）
  onSuccess?: (comment) => void; // 成功回调
  onError?: (error) => void;     // 失败回调
  onEditSuccess?: (comment) => void; // 编辑成功回调
  onDeleteSuccess?: (commentId) => void; // 删除成功回调
  successDelay?: number;         // 成功提示显示时长（默认：2000ms）
  useMock?: boolean;             // 是否使用模拟数据（默认：false）
}
```

#### 返回值

```typescript
{
  submitting: boolean;            // 是否提交中
  error: string | null;          // 错误信息
  success: boolean;              // 是否成功
  submitComment: (content, parentId?) => Promise<void>; // 提交评论
  editComment: (commentId, content) => Promise<void>;   // 编辑评论
  deleteComment: (commentId) => Promise<void>;          // 删除评论
  likeComment: (commentId, userId) => Promise<void>;     // 点赞评论
  unlikeComment: (commentId, userId) => Promise<void>;   // 取消点赞
  reset: () => void;             // 重置状态
}
```

## 💾 Supabase 服务

### CommentService

评论服务类，提供完整的 CRUD 操作。

```typescript
// 创建评论
const comment = await CommentService.createComment({
  post_id: 'post-123',
  parent_id: 'comment-456',      // 可选，回复时使用
  content: '评论内容',
  depth: 0,                      // 0: 顶层评论, 1: 回复
  attachments: [],                // 可选
});

// 获取评论列表
const { comments, total } = await CommentService.getComments({
  post_id: 'post-123',
  parent_id: undefined,          // 获取顶层评论
  limit: 20,
  offset: 0,
  sort_by: 'created_at',
  order: 'desc',
});

// 获取单个评论
const comment = await CommentService.getComment('comment-123');

// 更新评论
const updatedComment = await CommentService.updateComment(
  'comment-123',
  {
    content: '更新后的内容',
  }
);

// 删除评论（软删除）
await CommentService.deleteComment('comment-123');

// 点赞评论
await CommentService.likeComment('comment-123', 'user-123');

// 取消点赞评论
await CommentService.unlikeComment('comment-123', 'user-123');

// 检查是否点赞
const isLiked = await CommentService.isCommentLiked('comment-123', 'user-123');

// 置顶评论
const pinnedComment = await CommentService.pinComment('comment-123');

// 取消置顶评论
const unpinnedComment = await CommentService.unpinComment('comment-123');

// 举报评论
await CommentService.reportComment('comment-123', 'user-123', 'spam');
```

## 📝 Markdown 支持

评论编辑器支持以下 Markdown 语法：

### 粗体

```markdown
**粗体文本**
```

### 斜体

```markdown
*斜体文本*
```

### 代码

```markdown
`代码`
```

### 链接

```markdown
[链接文本](https://example.com)
```

### 列表

```markdown
- 列表项 1
- 列表项 2
- 列表项 3
```

## 🎯 使用场景

### 1. 社区帖子评论

```tsx
function PostComments() {
  const { comments, loading, refresh } = useComments(postId);
  const commentSubmit = useCommentSubmit({ postId });

  return (
    <div>
      <CommentEditor
        postId={postId}
        user={currentUser}
        onSubmit={async (data) => {
          await commentSubmit.submitComment(data.content);
          refresh();
        }}
      />
      <CommentList comments={comments} loading={loading} />
    </div>
  );
}
```

### 2. 嵌套回复

```tsx
function NestedComments() {
  const [replyTo, setReplyTo] = useState<{
    userId: string;
    commentId: string;
    username: string;
  } | null>(null);

  const commentSubmit = useCommentSubmit({ postId });

  return (
    <div>
      <CommentEditor
        postId={postId}
        parentId={replyTo?.commentId}
        user={currentUser}
        replyToUser={replyTo?.username}
        onSubmit={async (data) => {
          await commentSubmit.submitComment(data.content, replyTo?.commentId);
          setReplyTo(null);
        }}
      />
      <CommentList
        comments={comments}
        onReply={(commentId) => {
          const comment = findComment(commentId);
          setReplyTo({
            userId: comment.user.id,
            commentId: comment.id,
            username: comment.user.username,
          });
        }}
      />
    </div>
  );
}
```

### 3. 实时评论

```tsx
function RealtimeComments() {
  const { comments, loading, refresh } = useComments(postId);

  // 监听评论变化
  useEffect(() => {
    const subscription = supabase
      .channel('comments-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        () => refresh()
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [postId, refresh]);

  return (
    <div>
      <CommentEditor postId={postId} user={currentUser} />
      <CommentList comments={comments} loading={loading} />
    </div>
  );
}
```

## 🔐 权限控制

确保 Supabase RLS（Row Level Security）策略正确配置：

```sql
-- 允许认证用户创建评论
CREATE POLICY "Users can create comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 允许所有人查看评论
CREATE POLICY "Anyone can view comments"
ON comments FOR SELECT
USING (true);

-- 只允许作者更新自己的评论
CREATE POLICY "Users can update their own comments"
ON comments FOR UPDATE
USING (auth.uid() = user_id);

-- 只允许作者删除自己的评论
CREATE POLICY "Users can delete their own comments"
ON comments FOR DELETE
USING (auth.uid() = user_id);

-- 允许认证用户点赞评论
CREATE POLICY "Users can like comments"
ON comment_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 允许认证用户取消点赞
CREATE POLICY "Users can unlike comments"
ON comment_likes FOR DELETE
USING (auth.uid() = user_id);
```

## 📊 数据库表结构

### comments 表

```sql
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  content text not null,
  depth integer default 0,
  likes integer default 0,
  reply_count integer default 0,
  is_pinned boolean default false,
  is_deleted boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);
```

### comment_likes 表

```sql
create table comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references comments(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  created_at timestamp with time zone default now(),
  unique(comment_id, user_id)
);
```

### comment_reports 表

```sql
create table comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references comments(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  reason text not null,
  description text,
  created_at timestamp with time zone default now()
);
```

### comment_attachments 表

```sql
create table comment_attachments (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references comments(id) on delete cascade,
  name text not null,
  url text not null,
  type text not null,
  thumbnail text,
  mime_type text
);
```

## 🎨 样式自定义

评论编辑器使用 Tailwind CSS，可以通过修改类名来自定义样式：

```tsx
<CommentEditor
  className="border-primary-500"           // 自定义边框颜色
  style={{ borderRadius: '12px' }}         // 自定义圆角
/>
```

## 📱 响应式设计

评论编辑器支持响应式设计，自动适配不同屏幕尺寸：

```tsx
// 移动端
@media (max-width: 640px) {
  .comment-editor {
    min-height: 50px;
    max-height: 150px;
  }
}

// 桌面端
@media (min-width: 1024px) {
  .comment-editor {
    min-height: 60px;
    max-height: 200px;
  }
}
```

## 🚀 性能优化

### 1. 防抖提交

```tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedSubmit = useDebouncedCallback(
  async (content) => {
    await commentSubmit.submitComment(content);
  },
  1000
);
```

### 2. 乐观更新

```tsx
const submitComment = async (content: string) => {
  // 乐观更新：先更新 UI
  const tempComment = {
    id: 'temp',
    content,
    user: currentUser,
    created_at: new Date(),
    likes: 0,
    isLiked: false,
    reply_count: 0,
  };
  setComments(prev => [tempComment, ...prev]);

  try {
    // 实际提交
    const comment = await CommentService.createComment({
      post_id: postId,
      content,
    });
    // 更新为真实数据
    setComments(prev =>
      prev.map(c => (c.id === 'temp' ? comment : c))
    );
  } catch (error) {
    // 失败时回滚
    setComments(prev => prev.filter(c => c.id !== 'temp'));
    throw error;
  }
};
```

### 3. 分页加载

```tsx
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const { comments, total } = await CommentService.getComments({
    post_id: postId,
    limit: 20,
    offset: page * 20,
  });

  setComments(prev => [...prev, ...comments]);
  setPage(prev => prev + 1);
  setHasMore(total > page * 20);
};
```

## 🧪 测试

### 单元测试

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CommentEditor } from '@/components/comment';

describe('CommentEditor', () => {
  it('should submit comment on button click', async () => {
    const onSubmit = jest.fn().mockResolvedValue({});
    render(
      <CommentEditor
        postId="test-post"
        user={mockUser}
        onSubmit={onSubmit}
      />
    );

    const textarea = screen.getByPlaceholderText('写下你的评论...');
    const submitButton = screen.getByText('发布');

    fireEvent.change(textarea, { target: { value: '测试评论' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        content: '测试评论',
        postId: 'test-post',
      });
    });
  });
});
```

### 集成测试

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCommentSubmit } from '@/hooks/use-comment-submit';

describe('useCommentSubmit', () => {
  it('should submit comment successfully', async () => {
    const { result } = renderHook(() =>
      useCommentSubmit({
        postId: 'test-post',
        useMock: true,
      })
    );

    await act(async () => {
      await result.current.submitComment('测试评论');
    });

    expect(result.current.success).toBe(true);
    expect(result.current.submitting).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
```

## 📚 相关文档

- [评论组件文档](./components/comment/README.md)
- [Supabase 文档](https://supabase.com/docs)
- [Markdown 语法](https://www.markdownguide.org/basic-syntax/)
- [评论列表组件](./components/comment/comment-list.tsx)

## 💡 最佳实践

### 1. 始终验证用户输入

```tsx
const handleSubmit = async (content: string) => {
  if (!content.trim()) {
    setError('评论内容不能为空');
    return;
  }

  if (content.length > 1000) {
    setError('评论内容不能超过 1000 字');
    return;
  }

  // 检查敏感词
  if (containsSensitiveWords(content)) {
    setError('评论包含敏感内容');
    return;
  }

  await submitComment(content);
};
```

### 2. 提供友好的错误提示

```tsx
const getErrorMessage = (error: any) => {
  if (error.message.includes('network')) {
    return '网络连接失败，请检查网络后重试';
  }
  if (error.message.includes('unauthorized')) {
    return '请先登录后再发表评论';
  }
  return '发布评论失败，请重试';
};
```

### 3. 使用乐观更新提升体验

```tsx
const submitComment = async (content: string) => {
  const tempId = `temp-${Date.now()}`;
  const tempComment = createTempComment(tempId, content);

  // 乐观更新
  setComments(prev => [tempComment, ...prev]);

  try {
    const realComment = await CommentService.createComment({
      post_id: postId,
      content,
    });

    // 更新为真实数据
    setComments(prev =>
      prev.map(c => (c.id === tempId ? realComment : c))
    );
  } catch (error) {
    // 回滚
    setComments(prev => prev.filter(c => c.id !== tempId));
    throw error;
  }
};
```

### 4. 实现防刷机制

```tsx
const [lastSubmitTime, setLastSubmitTime] = useState(0);

const submitComment = async (content: string) => {
  const now = Date.now();
  const cooldown = 5000; // 5 秒冷却

  if (now - lastSubmitTime < cooldown) {
    setError(`请等待 ${Math.ceil((cooldown - (now - lastSubmitTime)) / 1000)} 秒后再试`);
    return;
  }

  setLastSubmitTime(now);
  await doSubmitComment(content);
};
```

## 🎉 总结

评论发布功能提供：

✅ **增强的编辑器** - 自动调整高度、字符计数、快捷键
✅ **Markdown 支持** - 粗体、斜体、代码、链接、列表
✅ **回复功能** - @username 提示、层级回复
✅ **Supabase 集成** - 完整的 CRUD 操作
✅ **状态管理** - 统一的提交状态管理
✅ **错误处理** - 完善的错误提示和重试
✅ **成功提示** - 自动消失的成功提示
✅ **模拟数据** - 支持模拟模式便于测试
✅ **乐观更新** - 实时更新 UI
✅ **完整文档** - 详细的使用指南和示例

现在你可以在项目中使用完整的评论发布功能了！🎉
