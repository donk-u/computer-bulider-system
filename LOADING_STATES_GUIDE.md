# 加载状态系统完整指南

本指南详细介绍如何使用加载状态系统，包括骨架屏、空状态、加载动画和错误状态。

## 目录

1. [概述](#概述)
2. [骨架屏](#骨架屏)
3. [空状态](#空状态)
4. [加载动画](#加载动画)
5. [错误状态](#错误状态)
6. [Hooks 使用](#hooks-使用)
7. [最佳实践](#最佳实践)
8. [示例代码](#示例代码)

## 概述

加载状态系统提供了一套完整的解决方案，用于管理应用中的各种加载状态：

- **骨架屏** - 在数据加载时显示占位符
- **空状态** - 当没有数据时显示友好提示
- **加载动画** - 显示加载进度
- **错误状态** - 处理和显示错误信息
- **状态管理 Hooks** - 统一管理加载状态

### 特点

✅ **类型安全** - 完整的 TypeScript 支持
✅ **灵活配置** - 支持多种自定义选项
✅ **动画效果** - 使用 Framer Motion 实现流畅动画
✅ **响应式设计** - 适配各种设备
✅ **易于使用** - 简单的 API 设计
✅ **可组合性** - 组件和 Hooks 可以灵活组合

## 骨架屏

骨架屏在数据加载时显示占位符，提升用户体验。

### 基础骨架屏

```tsx
import { Skeleton } from '@/components/loading';

<Skeleton 
  type="text" 
  animation="wave"
  width="100%"
  height={16}
/>
```

### 骨架屏类型

#### 1. 文本骨架屏

```tsx
<Skeleton type="text" />
<Skeleton type="text" width="60%" height={14} />
<Skeleton type="text" width="40%" height={12} />
```

#### 2. 圆形骨架屏

```tsx
<Skeleton type="circle" width={40} height={40} />
```

#### 3. 卡片骨架屏

```tsx
<CardSkeleton 
  count={3}
  showAvatar={true}
  showImage={true}
  showActions={true}
  animation="wave"
/>
```

#### 4. 列表骨架屏

```tsx
<ListSkeleton 
  count={5}
  showAvatar={true}
  animation="wave"
/>
```

#### 5. 网格骨架屏

```tsx
<GridSkeleton 
  count={6}
  columns={3}
  showImage={true}
  animation="wave"
/>
```

#### 6. 帖子列表骨架屏

```tsx
<PostListSkeleton 
  count={3}
  animation="wave"
/>
```

#### 7. 评论列表骨架屏

```tsx
<CommentListSkeleton 
  count={3}
  animation="wave"
/>
```

### 动画类型

```tsx
<Skeleton animation="wave" />      {/* 波浪动画（默认） */}
<Skeleton animation="pulse" />     {/* 脉冲动画 */}
<Skeleton animation="shimmer" />   {/* 闪烁动画 */}
<Skeleton animation="none" />      {/* 无动画 */}
```

### 自定义样式

```tsx
<Skeleton
  type="custom"
  width="100%"
  height={200}
  baseColor="#f0f0f0"
  highlightColor="#e0e0e0"
  borderRadius="8px"
  style={{ marginBottom: '16px' }}
  className="custom-skeleton"
/>
```

## 空状态

空状态在数据为空时显示友好提示，引导用户操作。

### 基础空状态

```tsx
import { EmptyState } from '@/components/loading';

<EmptyState 
  type="no-data"
  title="暂无数据"
  description="这里还没有任何内容"
  actions={[
    {
      label: '创建',
      variant: 'primary',
      onClick: () => console.log('创建'),
    }
  ]}
/>
```

### 预定义空状态

#### 1. 无数据

```tsx
<NoDataEmptyState 
  onCreate={() => console.log('创建')}
/>
```

#### 2. 无搜索结果

```tsx
<NoResultsEmptyState 
  onClear={() => console.log('清除筛选')}
/>
```

#### 3. 无帖子

```tsx
<NoPostsEmptyState 
  onCreatePost={() => console.log('创建帖子')}
/>
```

#### 4. 无评论

```tsx
<NoCommentsEmptyState 
  onAddComment={() => console.log('添加评论')}
/>
```

#### 5. 无点赞

```tsx
<NoLikesEmptyState />
```

#### 6. 无收藏

```tsx
<NoBookmarksEmptyState 
  onExplore={() => console.log('探索')}
/>
```

#### 7. 无关注者

```tsx
<NoFollowersEmptyState />
```

#### 8. 无通知

```tsx
<NoNotificationsEmptyState />
```

#### 9. 无消息

```tsx
<NoMessagesEmptyState 
  onNewMessage={() => console.log('新建消息')}
/>
```

#### 10. 网络错误

```tsx
<NetworkErrorEmptyState 
  onRetry={() => console.log('重试')}
/>
```

#### 11. 服务器错误

```tsx
<ServerErrorEmptyState 
  onRetry={() => console.log('重试')}
/>
```

### 自定义空状态

```tsx
<EmptyState
  type="no-data"
  title="自定义标题"
  description="自定义描述"
  illustration={{
    url: '/custom-illustration.svg',
    size: 200,
    show: true,
  }}
  actions={[
    {
      label: '主要操作',
      variant: 'primary',
      onClick: () => {},
      icon: <PlusIcon />,
    },
    {
      label: '次要操作',
      variant: 'secondary',
      onClick: () => {},
    },
  ]}
  style={{ padding: '48px' }}
  className="custom-empty-state"
/>
```

### 操作按钮配置

```typescript
{
  label: string;              // 按钮文本
  variant?: 'primary' | 'secondary' | 'ghost';  // 按钮类型
  onClick: () => void;        // 点击回调
  disabled?: boolean;         // 是否禁用
  icon?: React.ReactNode;     // 图标
}
```

## 加载动画

加载动画显示加载进度，提供视觉反馈。

### 基础加载动画

```tsx
import { LoadingAnimation } from '@/components/loading';

<LoadingAnimation
  type="spinner"
  size="lg"
  text="加载中..."
/>
```

### 加载动画类型

#### 1. 旋转加载器

```tsx
<SpinnerLoader size={40} color="#3b82f6" />
```

#### 2. 点加载器

```tsx
<DotsLoader size={12} color="#3b82f6" />
```

#### 3. 脉冲加载器

```tsx
<PulseLoader size={60} color="#3b82f6" />
```

#### 4. 条形加载器

```tsx
<BarsLoader 
  size={{ width: 4, height: 24 }} 
  color="#3b82f6" 
/>
```

#### 5. 环形加载器

```tsx
<RingLoader size={40} color="#3b82f6" />
```

#### 6. 弹跳加载器

```tsx
<BounceLoader size={16} color="#3b82f6" />
```

#### 7. 圆形加载器

```tsx
<CircularLoader size={40} color="#3b82f6" />
```

### 加载更多

```tsx
<LoadMoreLoader text="加载更多内容..." />
```

### 页面加载

```tsx
<PageLoader text="页面加载中..." />
```

### 内联加载

```tsx
<InlineLoader size="sm" color="#3b82f6" />
```

### 进度条

```tsx
<ProgressLoader 
  progress={75} 
  color="#3b82f6"
  showPercentage={true}
  height={4}
/>
```

### 自定义加载动画

```tsx
<LoadingAnimation
  type="spinner"
  size="lg"
  customSize={64}
  color="#3b82f6"
  text="加载中..."
  showBackground={true}
  fullscreen={false}
  style={{ padding: '24px' }}
  className="custom-loading"
/>
```

### 尺寸选项

```tsx
<LoadingAnimation size="xs" />  {/* 16px */}
<LoadingAnimation size="sm" />  {/* 24px */}
<LoadingAnimation size="md" />  {/* 32px */}
<LoadingAnimation size="lg" />  {/* 48px */}
<LoadingAnimation size="xl" />  {/* 64px */}
```

## 错误状态

错误状态处理和显示错误信息，帮助用户解决问题。

### 基础错误状态

```tsx
import { ErrorState } from '@/components/loading';

<ErrorState
  code="500"
  title="服务器错误"
  message="服务器暂时无法访问，请稍后再试"
  actions={[
    {
      label: '重试',
      variant: 'primary',
      onClick: () => console.log('重试'),
      icon: <ArrowPathIcon />,
    },
  ]}
/>
```

### 预定义错误状态

#### 1. 网络错误

```tsx
<NetworkErrorState
  onRetry={() => console.log('重试')}
  onBack={() => console.log('返回')}
/>
```

#### 2. 服务器错误

```tsx
<ServerErrorState
  code={500}
  onRetry={() => console.log('重试')}
  onBack={() => console.log('返回')}
/>
```

#### 3. 404 错误

```tsx
<NotFoundErrorState
  onBack={() => console.log('返回')}
  onHome={() => console.log('首页')}
/>
```

#### 4. 403 错误

```tsx
<ForbiddenErrorState
  onBack={() => console.log('返回')}
  onLogin={() => console.log('登录')}
/>
```

#### 5. 401 错误

```tsx
<UnauthorizedErrorState
  onBack={() => console.log('返回')}
  onLogin={() => console.log('登录')}
/>
```

### 内联错误

```tsx
<InlineErrorState
  message="加载失败，请重试"
  onRetry={() => console.log('重试')}
/>
```

### Toast 错误

```tsx
<ToastErrorState
  message="操作失败，请稍后重试"
  onClose={() => console.log('关闭')}
/>
```

### 自定义错误状态

```tsx
<ErrorState
  code="CUSTOM_ERROR"
  title="自定义错误"
  message="自定义错误描述"
  details="详细错误信息"
  stack="错误堆栈（仅开发环境）"
  showDetails={false}
  actions={[
    {
      label: '重试',
      variant: 'primary',
      onClick: () => {},
      icon: <ArrowPathIcon />,
    },
    {
      label: '取消',
      variant: 'secondary',
      onClick: () => {},
    },
  ]}
  style={{ padding: '48px' }}
  className="custom-error"
/>
```

## Hooks 使用

### useLoadingStates

统一管理加载状态的 Hook。

```tsx
import { useLoadingStates } from '@/hooks/use-loading-states';

function MyComponent() {
  const states = useLoadingStates();

  const fetchData = async () => {
    try {
      states.startLoading();
      const data = await fetch('/api/data');
      
      if (data.length === 0) {
        states.setEmpty();
      } else {
        states.setSuccess();
      }
    } catch (err) {
      states.setError(err);
    }
  };

  return (
    <div>
      {states.isLoading && <LoadingAnimation />}
      {states.isSuccess && <div>数据加载成功</div>}
      {states.isError && <NetworkErrorState onRetry={fetchData} />}
      {states.isEmpty && <NoDataEmptyState />}
    </div>
  );
}
```

### useAsyncData

自动管理异步数据加载。

```tsx
import { useAsyncData } from '@/hooks/use-loading-states';

function UserProfile() {
  const asyncData = useAsyncData(
    async () => {
      const response = await fetch('/api/user');
      return response.json();
    },
    { minLoadingTime: 500 }
  );

  if (asyncData.isLoading) {
    return <PageLoader />;
  }

  if (asyncData.isError) {
    return <NetworkErrorState onRetry={asyncData.reload} />;
  }

  return <div>{asyncData.data?.name}</div>;
}
```

### useListData

专为列表数据设计。

```tsx
import { useListData } from '@/hooks/use-loading-states';

function PostList() {
  const listData = useListData(
    async () => {
      const response = await fetch('/api/posts');
      return response.json();
    }
  );

  if (listData.isLoading) {
    return <PostListSkeleton />;
  }

  if (listData.isEmpty) {
    return <NoPostsEmptyState />;
  }

  return (
    <div>
      {listData.data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### useFormSubmit

专为表单提交设计。

```tsx
import { useFormSubmit } from '@/hooks/use-loading-states';

function PostForm() {
  const formSubmit = useFormSubmit(
    async (data) => {
      await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const success = await formSubmit.submit(formData);
    
    if (success) {
      console.log('提交成功');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单内容 */}
      <button type="submit" disabled={formSubmit.isLoading}>
        {formSubmit.isLoading ? '提交中...' : '提交'}
      </button>
    </form>
  );
}
```

### usePagedData

支持分页加载。

```tsx
import { usePagedData } from '@/hooks/use-loading-states';

function Feed() {
  const pagedData = usePagedData(
    async (page, limit) => {
      const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
      return response.json();
    },
    { pageSize: 20 }
  );

  return (
    <div>
      {pagedData.data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      {pagedData.hasMore && (
        <button onClick={pagedData.loadMore}>
          {pagedData.isLoading ? '加载中...' : '加载更多'}
        </button>
      )}
    </div>
  );
}
```

## 最佳实践

### 1. 使用合适的骨架屏

根据内容类型选择骨架屏：

```tsx
// 帖子列表使用帖子骨架屏
<PostListSkeleton />

// 评论列表使用评论骨架屏
<CommentListSkeleton />

// 卡片内容使用卡片骨架屏
<CardSkeleton />
```

### 2. 提供清晰的操作

空状态和错误状态应该提供明确的操作：

```tsx
<EmptyState
  type="no-posts"
  actions={[
    {
      label: '发布帖子',
      variant: 'primary',
      onClick: handleCreatePost,
    }
  ]}
/>

<NetworkErrorState
  onRetry={retry}
  onBack={goBack}
/>
```

### 3. 统一动画风格

使用一致的动画类型和颜色：

```tsx
// 统一使用 wave 动画
<Skeleton animation="wave" />
<PostListSkeleton animation="wave" />

// 统一使用主题色
<LoadingAnimation color="#3b82f6" />
<ProgressLoader color="#3b82f6" />
```

### 4. 添加重试功能

错误状态应该提供重试选项：

```tsx
<ErrorState
  actions={[
    {
      label: '重试',
      variant: 'primary',
      onClick: () => fetchData(),
    }
  ]}
/>
```

### 5. 显示加载文本

加载动画应该有清晰的文本提示：

```tsx
<LoadingAnimation
  text="加载中..."
/>

<LoadMoreLoader text="加载更多内容..." />
```

### 6. 使用 Hooks 管理状态

使用 Hooks 简化状态管理：

```tsx
const states = useLoadingStates();
const asyncData = useAsyncData(fetchFn);
const listData = useListData(fetchFn);
```

### 7. 最小加载时间

防止闪烁，设置最小加载时间：

```tsx
const asyncData = useAsyncData(fetchFn, {
  minLoadingTime: 500,
});
```

### 8. 错误处理

提供详细的错误信息：

```tsx
<ErrorState
  code={error.code}
  title={error.message}
  details={error.details}
  showDetails={true}
/>
```

## 示例代码

### 完整的列表组件

```tsx
import { useState } from 'react';
import { useListData } from '@/hooks/use-loading-states';
import { 
  PostListSkeleton, 
  NoPostsEmptyState, 
  NetworkErrorState,
  LoadMoreLoader 
} from '@/components/loading';

function PostList() {
  const listData = useListData(
    async () => {
      const response = await fetch('/api/posts');
      return response.json();
    }
  );

  if (listData.isLoading && listData.data.length === 0) {
    return <PostListSkeleton count={3} />;
  }

  if (listData.isError) {
    return <NetworkErrorState onRetry={listData.refresh} />;
  }

  if (listData.isEmpty) {
    return <NoPostsEmptyState onCreatePost={() => {}} />;
  }

  return (
    <div>
      {listData.data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      {listData.isLoading && listData.data.length > 0 && (
        <LoadMoreLoader />
      )}
    </div>
  );
}
```

### 完整的表单组件

```tsx
import { useFormSubmit } from '@/hooks/use-loading-states';
import { InlineErrorState } from '@/components/loading';

function PostForm() {
  const formSubmit = useFormSubmit(
    async (data) => {
      await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  );

  if (formSubmit.isError) {
    return (
      <InlineErrorState
        message={formSubmit.error?.message}
        onRetry={() => formSubmit.reset()}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" />
      <textarea name="content" />
      
      <button type="submit" disabled={formSubmit.isLoading}>
        {formSubmit.isLoading ? '提交中...' : '提交'}
      </button>
    </form>
  );
}
```

## 总结

加载状态系统提供了一套完整的解决方案：

✅ **骨架屏** - 多种类型，动画效果
✅ **空状态** - 预定义类型，自定义选项
✅ **加载动画** - 多种样式，灵活配置
✅ **错误状态** - 详细信息，重试机制
✅ **Hooks** - 统一管理，简化代码
✅ **类型安全** - 完整 TypeScript 支持
✅ **动画效果** - Framer Motion
✅ **响应式** - 适配各种设备

通过合理使用这些组件和 Hooks，可以显著提升用户体验！
