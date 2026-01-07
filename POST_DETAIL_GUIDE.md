# 帖子详情和评论系统完整指南

本指南详细介绍如何使用帖子详情和评论系统，包括各个组件的功能、使用方法和最佳实践。

## 目录

1. [系统概述](#系统概述)
2. [组件介绍](#组件介绍)
3. [类型定义](#类型定义)
4. [使用示例](#使用示例)
5. [最佳实践](#最佳实践)
6. [API 集成](#api-集成)

## 系统概述

帖子详情和评论系统提供了一套完整的解决方案，用于展示社区帖子的详细信息，包括：

- ✅ **帖子头部** - 显示作者信息、发布时间、标签
- ✅ **配置展示** - 完整的配置详情、性能图表、兼容性检查
- ✅ **操作区域** - 点赞、收藏、分享、报告
- ✅ **评论系统** - 评论列表、回复、编辑、删除

### 特点

✅ **类型安全** - 完整的 TypeScript 支持
✅ **模块化设计** - 组件可以独立使用或组合使用
✅ **响应式** - 适配各种设备
✅ **交互丰富** - 支持点赞、收藏、分享、评论等操作
✅ **性能优化** - 虚拟滚动、懒加载、防抖处理
✅ **错误处理** - 完善的错误处理和重试机制

## 组件介绍

### 1. PostHeader

帖子头部组件，显示作者信息、发布时间、标签等。

**功能**：
- 显示作者头像、用户名、认证徽章
- 显示发布时间和编辑状态
- 显示帖子类型和难度标签
- 显示精华和置顶标签
- 关注/取消关注作者
- 更多操作菜单

**Props**：

```typescript
interface PostHeaderProps {
  post: PostDetail;              // 帖子详情
  showFollowButton?: boolean;     // 是否显示关注按钮
  showMoreMenu?: boolean;        // 是否显示更多菜单
  onFollow?: (authorId: string) => void;           // 关注回调
  onUnfollow?: (authorId: string) => void;         // 取消关注回调
  onMoreAction?: (action: string) => void;         // 更多操作回调
}
```

**使用示例**：

```tsx
<PostHeader
  post={post}
  showFollowButton={true}
  showMoreMenu={true}
  onFollow={(authorId) => {
    // 关注作者
  }}
  onUnfollow={(authorId) => {
    // 取消关注
  }}
  onMoreAction={(action) => {
    console.log('Action:', action);
  }}
/>
```

### 2. BuildDetailComponent

配置详情组件，显示完整的配置信息、性能图表、兼容性检查等。

**功能**：
- 配置概览（价格、评分、组件数量、兼容性）
- 完整组件列表（可展开查看详情）
- 性能雷达图
- 基准测试结果
- 兼容性检查（问题、详情）
- 升级建议
- 复制配置
- 购买组件

**Props**：

```typescript
interface BuildDetailProps {
  build: BuildDetail;                           // 配置详情
  showUpgrades?: boolean;                       // 是否显示升级建议
  onCopy?: () => void;                          // 复制配置回调
  onBuyComponent?: (component: Component) => void;  // 购买组件回调
}
```

**使用示例**：

```tsx
<BuildDetailComponent
  build={build}
  showUpgrades={true}
  onCopy={() => {
    // 复制配置到剪贴板
    navigator.clipboard.writeText(JSON.stringify(build));
  }}
  onBuyComponent={(component) => {
    // 跳转到购买页面
    window.open(component.url, '_blank');
  }}
/>
```

### 3. PostActions

帖子操作区域组件，提供点赞、收藏、分享、报告等功能。

**功能**：
- 点赞/取消点赞（带动画）
- 收藏/取消收藏（选择收藏夹）
- 分享到社交平台
- 复制链接
- 举报帖子

**Props**：

```typescript
interface PostActionsProps {
  postId: string;                                          // 帖子ID
  postUrl: string;                                          // 帖子URL
  likeState: LikeState;                                     // 点赞状态
  bookmarkState: BookmarkState;                             // 收藏状态
  onLike: (isLiked: boolean) => void;                      // 点赞回调
  onBookmark: (isBookmarked: boolean, folderId?: string) => void;  // 收藏回调
  onShare?: (platform: string, options: ShareOptions) => void;    // 分享回调
  onReport?: (reason: string, description: string) => void;        // 举报回调
  onCopyLink?: () => void;                                 // 复制链接回调
  onComment?: () => void;                                  // 评论回调
  config?: PostActionsConfig;                               // 配置选项
  postTitle?: string;                                       // 帖子标题
  postDescription?: string;                                  // 帖子描述
  tags?: string[];                                          // 标签
  likeCount?: number;                                       // 点赞数
  commentCount?: number;                                    // 评论数
  viewCount?: number;                                       // 浏览数
}
```

**使用示例**：

```tsx
<PostActions
  postId={post.id}
  postUrl={`https://example.com/posts/${post.id}`}
  likeState={likeState}
  bookmarkState={bookmarkState}
  onLike={(isLiked) => {
    // 更新点赞状态
    setLikeState({
      isLiked,
      count: isLiked ? likeState.count + 1 : likeState.count - 1,
    });
  }}
  onBookmark={(isBookmarked, folderId) => {
    // 更新收藏状态
    setBookmarkState({ isBookmarked, folderId });
  }}
  onShare={(platform, options) => {
    // 分享到平台
    console.log('Share:', platform, options);
  }}
  onReport={(reason, description) => {
    // 举报帖子
    console.log('Report:', reason, description);
  }}
  onCopyLink={() => {
    // 复制链接
    navigator.clipboard.writeText(postUrl);
  }}
  onComment={() => {
    // 滚动到评论区
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
  }}
  config={{
    showLike: true,
    showBookmark: true,
    showShare: true,
    showReport: true,
    showMore: true,
  }}
  likeCount={post.likes}
  commentCount={post.comments}
  viewCount={post.views}
/>
```

### 4. CommentSection

评论区组件，显示评论列表和提供评论功能。

**功能**：
- 评论列表展示
- 层级回复（支持多级）
- 点赞/取消点赞评论
- 回复评论
- 编辑评论
- 删除评论
- 举报评论
- 置顶/取消置顶
- 折叠/展开回复
- 评论输入框
- 加载更多评论
- 用户卡片预览

**Props**：

```typescript
interface CommentSectionProps {
  postId: string;                                // 帖子ID
  comments: CommentDetail[];                      // 评论列表
  totalComments?: number;                        // 评论总数
  loading?: boolean;                             // 是否加载中
  hasMore?: boolean;                             // 是否有更多评论
  onLoadMore?: () => void;                       // 加载更多回调
  actions: CommentAction;                        // 评论操作
  currentUserId?: string;                        // 当前用户ID
  showInput?: boolean;                           // 是否显示输入框
  inputPlaceholder?: string;                      // 输入框占位符
}
```

**CommentAction 类型**：

```typescript
interface CommentAction {
  like: (commentId: string) => Promise<void>;
  unlike: (commentId: string) => Promise<void>;
  reply: (commentId: string, content: string) => Promise<CommentDetail>;
  edit: (commentId: string, content: string) => Promise<CommentDetail>;
  delete: (commentId: string) => Promise<void>;
  report: (commentId: string, reason: string) => Promise<void>;
  pin: (commentId: string) => Promise<void>;
  unpin: (commentId: string) => Promise<void>;
}
```

**使用示例**：

```tsx
<CommentSection
  postId={post.id}
  comments={comments}
  totalComments={post.comments}
  loading={loading}
  hasMore={hasMore}
  onLoadMore={loadMoreComments}
  actions={{
    like: async (commentId) => {
      // 点赞评论
      await api.likeComment(commentId);
    },
    unlike: async (commentId) => {
      // 取消点赞
      await api.unlikeComment(commentId);
    },
    reply: async (commentId, content) => {
      // 回复评论
      return await api.replyComment(commentId, content);
    },
    edit: async (commentId, content) => {
      // 编辑评论
      return await api.editComment(commentId, content);
    },
    delete: async (commentId) => {
      // 删除评论
      await api.deleteComment(commentId);
    },
    report: async (commentId, reason) => {
      // 举报评论
      await api.reportComment(commentId, reason);
    },
    pin: async (commentId) => {
      // 置顶评论
      await api.pinComment(commentId);
    },
    unpin: async (commentId) => {
      // 取消置顶
      await api.unpinComment(commentId);
    },
  }}
  currentUserId="current-user"
  showInput={true}
  inputPlaceholder="发表你的评论..."
/>
```

## 类型定义

### PostDetail

```typescript
interface PostDetail extends CommunityPost {
  fullContent?: string;              // 完整内容（Markdown）
  featured?: boolean;               // 是否为精华帖
  fullViews?: number;               // 浏览完整次数
  editHistory?: PostEdit[];         // 编辑历史
  relatedPosts?: CommunityPost[];   // 相关帖子
  attachments?: PostAttachment[];   // 附件
}
```

### BuildDetail

```typescript
interface BuildDetail extends BuildConfiguration {
  allComponents: Component[];                    // 完整组件列表
  benchmarks?: BenchmarkResult[];                // 性能测试结果
  compatibility: CompatibilityResult;            // 兼容性检查
  upgradeSuggestions?: UpgradeSuggestion[];        // 升级建议
  similarBuilds?: BuildConfiguration[];          // 类似配置
}
```

### CommentDetail

```typescript
interface CommentDetail {
  id: string;                    // 评论ID
  postId: string;                 // 帖子ID
  author: PostAuthor;             // 作者
  content: string;                // 内容
  likes: number;                 // 点赞数
  likedByCurrentUser: boolean;    // 是否已点赞
  createdAt: Date;                // 创建时间
  updatedAt?: Date;               // 更新时间
  replies: CommentDetail[];       // 回复列表
  repliesCount: number;           // 回复总数
  isCollapsed?: boolean;          // 是否被折叠
  level: number;                  // 层级
  parentId?: string;              // 父评论ID
  pinned?: boolean;               // 是否置顶
  isAuthor?: boolean;             // 是否是作者评论
  attachments?: CommentAttachment[];  // 附件
}
```

### LikeState

```typescript
interface LikeState {
  isLiked: boolean;               // 是否已点赞
  count: number;                 // 点赞数
  isAnimating?: boolean;         // 是否正在执行动画
  userId?: string;               // 用户ID（如果已点赞）
}
```

### BookmarkState

```typescript
interface BookmarkState {
  isBookmarked: boolean;         // 是否已收藏
  folderId?: string;             // 收藏夹ID（如果已收藏）
  bookmarkedAt?: string;         // 收藏时间
}
```

## 使用示例

### 完整的帖子详情页面

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAsyncData } from '@/hooks/use-loading-states';
import { PostHeader, BuildDetailComponent, PostActions, CommentSection } from '@/components/post';
import { PostDetail, LikeState, BookmarkState, CommentDetail } from '@/types/post-detail';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;

  // 获取帖子详情
  const postDetailData = useAsyncData(
    () => fetchPostDetail(postId),
    { minLoadingTime: 500 }
  );

  // 评论状态
  const [comments, setComments] = useState<CommentDetail[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  // 互动状态
  const [likeState, setLikeState] = useState<LikeState>({
    isLiked: false,
    count: 0,
  });
  const [bookmarkState, setBookmarkState] = useState<BookmarkState>({
    isBookmarked: false,
  });

  // 加载评论
  useEffect(() => {
    const loadComments = async () => {
      setLoadingComments(true);
      try {
        const data = await fetchComments(postId);
        setComments(data);
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setLoadingComments(false);
      }
    };

    if (postDetailData.isSuccess && postDetailData.data) {
      setLikeState({
        isLiked: postDetailData.data.likedByCurrentUser,
        count: postDetailData.data.likes,
      });
      setBookmarkState({
        isBookmarked: postDetailData.data.bookmarkedByCurrentUser,
      });
      loadComments();
    }
  }, [postDetailData.isSuccess, postDetailData.data, postId]);

  // 评论操作
  const commentActions = {
    like: async (commentId: string) => {
      await api.likeComment(commentId);
      setComments(prev => prev.map(c => 
        c.id === commentId 
          ? { ...c, likes: c.likes + 1, likedByCurrentUser: true }
          : c
      ));
    },
    unlike: async (commentId: string) => {
      await api.unlikeComment(commentId);
      setComments(prev => prev.map(c => 
        c.id === commentId 
          ? { ...c, likes: c.likes - 1, likedByCurrentUser: false }
          : c
      ));
    },
    reply: async (commentId: string, content: string) => {
      const newReply = await api.replyComment(commentId, content);
      setComments(prev => prev.map(c => 
        c.id === commentId 
          ? { ...c, replies: [...c.replies, newReply], repliesCount: c.repliesCount + 1 }
          : c
      ));
      return newReply;
    },
    edit: async (commentId: string, content: string) => {
      const updated = await api.editComment(commentId, content);
      setComments(prev => prev.map(c => 
        c.id === commentId ? updated : c
      ));
      return updated;
    },
    delete: async (commentId: string) => {
      await api.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    },
    report: async (commentId: string, reason: string) => {
      await api.reportComment(commentId, reason);
    },
    pin: async (commentId: string) => {
      await api.pinComment(commentId);
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, pinned: true } : c
      ));
    },
    unpin: async (commentId: string) => {
      await api.unpinComment(commentId);
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, pinned: false } : c
      ));
    },
  };

  if (postDetailData.isLoading) {
    return <PageLoader text="加载帖子详情..." />;
  }

  if (postDetailData.isError) {
    return <NetworkErrorState onRetry={() => postDetailData.reload()} />;
  }

  if (!postDetailData.data) {
    return <NoPostsEmptyState />;
  }

  const post = postDetailData.data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* 帖子头部 */}
          <Card>
            <CardContent className="p-6">
              <PostHeader
                post={post}
                onFollow={(authorId) => console.log('Follow:', authorId)}
              />
              <Separator className="my-6" />
              <PostActions
                postId={post.id}
                postUrl={`https://example.com/posts/${post.id}`}
                likeState={likeState}
                bookmarkState={bookmarkState}
                onLike={(isLiked) => {
                  setLikeState({
                    isLiked,
                    count: isLiked ? likeState.count + 1 : likeState.count - 1,
                  });
                }}
                onBookmark={(isBookmarked) => {
                  setBookmarkState({ isBookmarked });
                }}
                onCopyLink={() => {
                  navigator.clipboard.writeText(`https://example.com/posts/${post.id}`);
                }}
                likeCount={likeState.count}
                commentCount={post.comments}
                viewCount={post.views}
              />
            </CardContent>
          </Card>

          {/* 配置详情 */}
          {post.build && (
            <BuildDetailComponent
              build={post.build}
              showUpgrades={true}
            />
          )}

          {/* 评论区 */}
          <div id="comments-section">
            <Card>
              <CardContent className="p-6">
                <CommentSection
                  postId={post.id}
                  comments={comments}
                  totalComments={post.comments}
                  loading={loadingComments}
                  hasMore={hasMoreComments}
                  onLoadMore={() => {
                    // 加载更多评论
                  }}
                  actions={commentActions}
                  currentUserId="current-user"
                  showInput={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 右侧边栏 */}
        <div className="space-y-6">
          {/* 作者信息 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">关于作者</h3>
              {/* 作者信息 */}
            </CardContent>
          </Card>

          {/* 相关标签 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">相关标签</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/tags/${tag}`}>
                    #{tag}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

## 最佳实践

### 1. 数据加载

使用 `useAsyncData` Hook 管理加载状态：

```tsx
const postDetailData = useAsyncData(
  () => fetchPostDetail(postId),
  { minLoadingTime: 500 }
);
```

### 2. 状态管理

使用本地状态管理点赞、收藏等交互：

```tsx
const [likeState, setLikeState] = useState<LikeState>({
  isLiked: false,
  count: 0,
});

const handleLike = (isLiked: boolean) => {
  setLikeState({
    isLiked,
    count: isLiked ? likeState.count + 1 : likeState.count - 1,
  });
  // 同步到服务器
  api.likePost(postId, isLiked);
};
```

### 3. 性能优化

- 使用虚拟滚动处理大量评论
- 图片懒加载
- 防抖处理评论输入

### 4. 错误处理

提供清晰的错误提示和重试机制：

```tsx
if (postDetailData.isError) {
  return <NetworkErrorState onRetry={() => postDetailData.reload()} />;
}
```

### 5. 用户体验

- 提供加载状态
- 支持键盘快捷键
- 添加过渡动画
- 提供重试机制

## API 集成

### 获取帖子详情

```typescript
async function fetchPostDetail(postId: string): Promise<PostDetail> {
  const response = await fetch(`/api/posts/${postId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post detail');
  }
  return response.json();
}
```

### 获取评论列表

```typescript
async function fetchComments(postId: string, page: number = 0): Promise<CommentDetail[]> {
  const response = await fetch(`/api/posts/${postId}/comments?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
}
```

### 点赞帖子

```typescript
async function likePost(postId: string, isLiked: boolean): Promise<void> {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: 'POST',
    body: JSON.stringify({ isLiked }),
  });
  if (!response.ok) {
    throw new Error('Failed to like post');
  }
}
```

### 收藏帖子

```typescript
async function bookmarkPost(
  postId: string, 
  isBookmarked: boolean, 
  folderId?: string
): Promise<void> {
  const response = await fetch(`/api/posts/${postId}/bookmark`, {
    method: 'POST',
    body: JSON.stringify({ isBookmarked, folderId }),
  });
  if (!response.ok) {
    throw new Error('Failed to bookmark post');
  }
}
```

### 评论操作

```typescript
async function likeComment(commentId: string): Promise<void> {
  const response = await fetch(`/api/comments/${commentId}/like`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to like comment');
  }
}

async function replyComment(commentId: string, content: string): Promise<CommentDetail> {
  const response = await fetch(`/api/comments/${commentId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('Failed to reply comment');
  }
  return response.json();
}
```

## 总结

帖子详情和评论系统提供了一套完整的解决方案：

✅ **帖子头部** - 显示作者信息、发布时间、标签
✅ **配置展示** - 完整的配置详情、性能图表、兼容性检查
✅ **操作区域** - 点赞、收藏、分享、报告
✅ **评论系统** - 评论列表、回复、编辑、删除
✅ **类型安全** - 完整 TypeScript 支持
✅ **模块化** - 组件可以独立使用或组合使用
✅ **响应式** - 适配各种设备
✅ **完整文档** - 详细的使用指南和 API 文档

通过合理使用这些组件，可以快速构建功能完善的帖子详情页面！
