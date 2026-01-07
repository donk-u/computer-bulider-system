# 富文本支持使用指南

完整的富文本编辑系统，支持 Markdown、@提及、#标签和图片上传功能。

## 📦 功能特性

### 核心功能

- ✅ **Markdown 支持** - 粗体、斜体、代码、链接、列表
- ✅ **@提及用户** - 智能搜索用户，快速提及
- ✅ **#标签功能** - 热门标签推荐，智能补全
- ✅ **图片上传** - 支持多图上传，实时预览
- ✅ **表情选择** - 常用表情快速插入
- ✅ **自动调整高度** - 根据内容自动调整文本框高度
- ✅ **字符计数** - 实时显示字符计数，接近限制时警告
- ✅ **快捷键支持** - Enter 提交，Shift+Enter 换行
- ✅ **键盘导航** - 上下箭头选择，Enter 确认
- ✅ **取消确认** - 有内容时弹出确认对话框

### 高级功能

- ✅ **Markdown 渲染器** - 完整的 Markdown 渲染支持
- ✅ **智能链接** - 自动识别和转换 URL
- ✅ **用户搜索** - 实时搜索用户，支持用户名和显示名
- ✅ **标签搜索** - 热门标签推荐，智能补全
- ✅ **图片预览** - 上传前预览，支持删除
- ✅ **上传进度** - 实时显示上传进度
- ✅ **乐观更新** - 实时更新 UI
- ✅ **错误处理** - 完善的错误提示和重试机制

## 📁 文件结构

```
components/rich-text/
├── rich-text-editor.tsx       # 富文本编辑器组件（22KB）
├── markdown-renderer.tsx      # Markdown 渲染器（12KB）
├── mention-popover.tsx         # 用户提及弹出窗口（6KB）
├── hashtag-popover.tsx         # 标签弹出窗口（5KB）
└── index.ts                    # 组件导出

app/examples/
└── rich-text-demo.tsx          # 示例页面（18KB）
```

## 🚀 快速开始

### 1. 基础使用

```tsx
import { RichTextEditor } from '@/components/rich-text';

function PostEditor() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: {
    content: string;
    mentions: string[];
    hashtags: string[];
    images: string[];
  }) => {
    setSubmitting(true);
    try {
      // 提交到服务器
      await createPost(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RichTextEditor
      placeholder="分享你的想法..."
      user={currentUser}
      submitting={submitting}
      onSubmit={handleSubmit}
    />
  );
}
```

### 2. 配置选项

```tsx
<RichTextEditor
  placeholder="分享你的想法..."
  user={currentUser}
  config={{
    maxLength: 2000,              // 最大长度
    allowMarkdown: true,          // 允许 Markdown
    allowMentions: true,          // 允许 @提及
    allowHashtags: true,          // 允许 #标签
    allowImages: true,            // 允许图片上传
    allowEmoji: true,              // 允许表情
    autoResize: true,             // 自动调整高度
    minHeight: 100,                // 最小高度
    maxHeight: 300,               // 最大高度
    maxImages: 9,                 // 最大图片数量
    maxImageSize: 10,             // 最大图片大小（MB）
  }}
  submitting={submitting}
  onSubmit={handleSubmit}
/>
```

### 3. 搜索功能

```tsx
// 搜索用户
const handleSearchUsers = async (query: string) => {
  const response = await fetch(`/api/users/search?q=${query}`);
  const users = await response.json();
  return users;
};

// 搜索标签
const handleSearchHashtags = async (query: string) => {
  const response = await fetch(`/api/hashtags/search?q=${query}`);
  const hashtags = await response.json();
  return hashtags;
};

<RichTextEditor
  onSearchUsers={handleSearchUsers}
  onSearchHashtags={handleSearchHashtags}
/>
```

### 4. 图片上传

```tsx
// 上传图片
const handleUploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const { url } = await response.json();
  return url;
};

<RichTextEditor
  onUploadImage={handleUploadImage}
/>
```

## 🎨 组件 API

### RichTextEditor

富文本编辑器组件。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `placeholder` | `string` | `"写下你的想法..."` | 占位符文本 |
| `config` | `RichTextEditorConfig` | `{}` | 配置选项 |
| `user` | `object` | - | 当前用户信息 |
| `submitting` | `boolean` | `false` | 是否提交中 |
| `onSubmit` | `(data) => Promise<void>` | - | 提交回调 |
| `onSearchUsers` | `(query) => Promise<User[]>` | - | 搜索用户 |
| `onSearchHashtags` | `(query) => Promise<string[]>` | - | 搜索标签 |
| `onUploadImage` | `(file) => Promise<string>` | - | 上传图片 |
| `onSuccess` | `() => void` | - | 成功回调 |
| `onError` | `(error) => void` | - | 失败回调 |
| `onCancel` | `() => void` | - | 取消回调 |

### RichTextEditorConfig

编辑器配置选项。

```typescript
interface RichTextEditorConfig {
  maxLength?: number;           // 最大长度（默认：2000）
  allowMarkdown?: boolean;       // 允许 Markdown（默认：true）
  allowMentions?: boolean;       // 允许 @提及（默认：true）
  allowHashtags?: boolean;       // 允许 #标签（默认：true）
  allowImages?: boolean;         // 允许图片上传（默认：true）
  allowEmoji?: boolean;          // 允许表情（默认：true）
  autoResize?: boolean;          // 自动调整高度（默认：true）
  minHeight?: number;            // 最小高度（默认：100px）
  maxHeight?: number;            // 最大高度（默认：300px）
  submitOnEnter?: boolean;       // Enter 提交（默认：true）
  allowShiftEnter?: boolean;     // Shift+Enter 换行（默认：true）
  maxImages?: number;            // 最大图片数量（默认：9）
  maxImageSize?: number;         // 最大图片大小，MB（默认：10）
}
```

### MarkdownRenderer

Markdown 渲染器组件。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `content` | `string` | *必需* | Markdown 内容 |
| `enableLinks` | `boolean` | `true` | 是否启用链接 |
| `enableImages` | `boolean` | `true` | 是否启用图片 |
| `enableCodeHighlight` | `boolean` | `true` | 是否启用代码高亮 |
| `autoLinkUrls` | `boolean` | `true` | 是否自动链接 URL |
| `renderLink` | `(url, text) => ReactNode` | - | 自定义链接渲染 |
| `renderMention` | `(username) => ReactNode` | - | 自定义提及渲染 |
| `renderHashtag` | `(hashtag) => ReactNode` | - | 自定义标签渲染 |

## 📝 Markdown 语法

### 支持的语法

| 语法 | 示例 | 渲染 |
|-----|------|------|
| 粗体 | `**粗体**` | **粗体** |
| 斜体 | `*斜体*` | *斜体* |
| 代码 | `` `代码` `` | `代码` |
| 链接 | `[文本](url)` | [文本](url) |
| 列表 | `- 项目` | • 项目 |
| 提及 | `@username` | @username |
| 标签 | `#hashtag` | #hashtag |
| 自动链接 | `https://example.com` | https://example.com |

### 完整示例

```markdown
**重要提示：**请查看[文档](https://docs.example.com)了解更多信息。

- 支持**Markdown**
- 支持@提及
- 支持#标签
- 支持[链接](https://example.com)
- 支持`行内代码`

这是技术术语：`CPU`、`GPU`、`RAM`。
```

## 🎯 使用场景

### 1. 社区帖子创建

```tsx
function CreatePost() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await createPost(data);
      toast.success('发布成功！');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RichTextEditor
      placeholder="分享你的想法..."
      user={currentUser}
      config={{
        maxLength: 2000,
        allowImages: true,
        maxImages: 9,
      }}
      submitting={submitting}
      onSubmit={handleSubmit}
    />
  );
}
```

### 2. 评论编辑

```tsx
function CommentEditor() {
  return (
    <RichTextEditor
      placeholder="写下你的评论..."
      user={currentUser}
      config={{
        maxLength: 1000,
        allowImages: false,
        allowMentions: true,
        allowHashtags: false,
      }}
      onSubmit={handleSubmit}
    />
  );
}
```

### 3. 私信发送

```tsx
function MessageEditor() {
  return (
    <RichTextEditor
      placeholder="输入消息..."
      config={{
        maxLength: 500,
        allowMarkdown: false,
        allowImages: true,
        allowMentions: true,
        allowHashtags: false,
      }}
      onSubmit={handleSubmit}
    />
  );
}
```

### 4. 内容渲染

```tsx
import { MarkdownRenderer } from '@/components/rich-text';

function PostContent({ post }) {
  return (
    <div className="prose">
      <MarkdownRenderer
        content={post.content}
        renderMention={(username) => (
          <Link href={`/u/${username}`} className="text-primary">
            @{username}
          </Link>
        )}
        renderHashtag={(hashtag) => (
          <Link href={`/tags/${hashtag}`} className="text-primary">
            #{hashtag}
          </Link>
        )}
      />
    </div>
  );
}
```

## 🔧 高级功能

### 自定义链接渲染

```tsx
<MarkdownRenderer
  content={content}
  renderLink={(url, text) => {
    if (url.startsWith('http')) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {text} ↗
        </a>
      );
    }
    return <Link href={url}>{text}</Link>;
  }}
/>
```

### 自定义提及渲染

```tsx
<MarkdownRenderer
  content={content}
  renderMention={(username) => (
    <UserLink username={username}>
      @{username}
    </UserLink>
  )}
/>
```

### 自定义标签渲染

```tsx
<MarkdownRenderer
  content={content}
  renderHashtag={(hashtag) => (
    <HashtagBadge tag={hashtag}>
      #{hashtag}
    </HashtagBadge>
  )}
/>
```

### 图片上传处理

```tsx
const handleUploadImage = async (file: File) => {
  // 1. 验证文件
  if (!file.type.startsWith('image/')) {
    throw new Error('只能上传图片文件');
  }

  // 2. 验证大小
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('图片大小不能超过 10MB');
  }

  // 3. 压缩图片（可选）
  const compressed = await compressImage(file);

  // 4. 上传到服务器
  const formData = new FormData();
  formData.append('file', compressed);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('上传失败');
  }

  const { url } = await response.json();
  return url;
};
```

## 📊 数据处理

### 提取 @提及

```typescript
const extractMentions = (content: string): string[] => {
  const mentions = content.match(/@(\w+)/g);
  return mentions ? mentions.map(m => m.substring(1)) : [];
};
```

### 提取 #标签

```typescript
const extractHashtags = (content: string): string[] => {
  const hashtags = content.match(/#(\w+)/g);
  return hashtags ? hashtags.map(h => h.substring(1)) : [];
};
```

### 验证内容

```typescript
const validateContent = (content: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!content.trim()) {
    errors.push('内容不能为空');
  }

  if (content.length > 2000) {
    errors.push('内容不能超过 2000 字');
  }

  // 检查敏感词
  if (containsSensitiveWords(content)) {
    errors.push('内容包含敏感词');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
```

## 🎨 样式自定义

### 自定义样式

```tsx
<RichTextEditor
  className="border-primary-500"
  style={{ borderRadius: '12px' }}
/>

<MarkdownRenderer
  content={content}
  className="prose prose-sm max-w-none"
/>
```

### 自定义弹出窗口样式

编辑器中的弹出窗口使用 shadcn/ui 的 Popover 组件，可以通过 CSS 自定义：

```css
/* 自定义弹出窗口样式 */
[data-radix-popper-content-wrapper] {
  z-index: 9999;
}
```

## 🚀 性能优化

### 1. 防抖搜索

```tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearchUsers = useDebouncedCallback(
  async (query: string) => {
    const users = await searchUsers(query);
    setSuggestedUsers(users);
  },
  300
);
```

### 2. 图片懒加载

```tsx
<RichTextEditor
  onUploadImage={async (file) => {
    // 压缩图片
    const compressed = await compressImage(file, { maxWidth: 1920 });
    return uploadImage(compressed);
  }}
/>
```

### 3. 虚拟滚动

对于大量内容，使用虚拟滚动优化性能：

```tsx
import { VirtualList } from 'react-virtual';

<VirtualList
  height={600}
  itemCount={posts.length}
  itemSize={100}
  renderItem={({ index, style }) => (
    <div style={style}>
      <PostCard post={posts[index]} />
    </div>
  )}
/>
```

## 🧪 测试

### 单元测试

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RichTextEditor } from '@/components/rich-text';

describe('RichTextEditor', () => {
  it('should submit content with mentions and hashtags', async () => {
    const onSubmit = jest.fn().mockResolvedValue({});
    render(
      <RichTextEditor
        user={mockUser}
        onSubmit={onSubmit}
      />
    );

    const textarea = screen.getByPlaceholderText('分享你的想法...');
    const submitButton = screen.getByText('发布');

    fireEvent.change(textarea, {
      target: { value: 'Hello @alice #test' }
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        content: 'Hello @alice #test',
        mentions: ['alice'],
        hashtags: ['test'],
        images: [],
      });
    });
  });
});
```

## 💡 最佳实践

### 1. 验证输入

```tsx
const handleSubmit = async (data) => {
  // 验证内容
  const { valid, errors } = validateContent(data.content);
  if (!valid) {
    errors.forEach(error => toast.error(error));
    return;
  }

  // 提交
  await createPost(data);
};
```

### 2. 提供友好提示

```tsx
<RichTextEditor
  placeholder="分享你的想法..."
  config={{
    maxLength: 2000,
  }}
  onSubmit={async (data) => {
    try {
      await createPost(data);
      toast.success('发布成功！');
    } catch (error) {
      toast.error('发布失败，请重试');
    }
  }}
/>
```

### 3. 乐观更新

```tsx
const handleSubmit = async (data) => {
  const tempId = `temp-${Date.now()}`;
  const tempPost = {
    id: tempId,
    ...data,
    author: currentUser,
    createdAt: new Date(),
  };

  // 乐观更新
  setPosts(prev => [tempPost, ...prev]);

  try {
    const realPost = await createPost(data);
    // 更新为真实数据
    setPosts(prev =>
      prev.map(p => p.id === tempId ? realPost : p)
    );
  } catch (error) {
    // 回滚
    setPosts(prev => prev.filter(p => p.id !== tempId));
    throw error;
  }
};
```

### 4. 防刷机制

```tsx
const [lastSubmitTime, setLastSubmitTime] = useState(0);

const handleSubmit = async (data) => {
  const now = Date.now();
  const cooldown = 5000; // 5 秒冷却

  if (now - lastSubmitTime < cooldown) {
    toast.error('请稍后再试');
    return;
  }

  setLastSubmitTime(now);
  await createPost(data);
};
```

## 📚 相关文档

- [评论组件指南](./COMMENT_SUBMIT_GUIDE.md)
- [加载状态指南](./LOADING_STATES_GUIDE.md)
- [Markdown 语法](https://www.markdownguide.org/basic-syntax/)
- [Framer Motion 文档](https://www.framer.com/motion/)

## 🎉 总结

富文本编辑系统提供：

✅ **Markdown 支持** - 完整的 Markdown 语法
✅ **@提及用户** - 智能搜索和快速提及
✅ **#标签功能** - 热门标签推荐
✅ **图片上传** - 多图上传和实时预览
✅ **表情选择** - 常用表情快速插入
✅ **自动调整高度** - 根据内容自适应
✅ **字符计数** - 实时计数和警告
✅ **快捷键支持** - Enter 提交，Shift+Enter 换行
✅ **键盘导航** - 上下箭头选择
✅ **Markdown 渲染** - 完整的渲染器
✅ **智能链接** - 自动识别 URL
✅ **自定义渲染** - 支持自定义组件
✅ **完整文档** - 详细的使用指南和示例

现在你可以在项目中使用完整的富文本编辑功能了！🎉
