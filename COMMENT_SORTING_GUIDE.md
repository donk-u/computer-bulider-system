# 评论排序和分页使用指南

完整的评论排序和分页系统，支持热门评论、最新评论、楼主置顶和分页加载功能。

## 📦 功能特性

### 核心功能

- ✅ **热门排序** - 使用 Wilson score interval 算法计算热门分数
- ✅ **最新排序** - 按发布时间倒序排列
- ✅ **最早排序** - 按发布时间正序排列
- ✅ **最多点赞** - 按点赞数降序排列
- ✅ **楼主置顶** - 自动置顶作者的高赞评论
- ✅ **只看楼主** - 筛选只显示作者评论
- ✅ **分页加载** - 支持三种分页模式
- ✅ **统计信息** - 完整的评论统计数据

### 分页模式

- ✅ **加载更多** - 点击按钮加载更多评论
- ✅ **传统分页** - 页码跳转分页
- ✅ **无限滚动** - 滚动到底部自动加载

## 📁 文件结构

```
types/
└── comment-sorting.ts        # 评论排序类型定义

components/comment/
├── comment-sort-bar.tsx      # 评论排序栏（8KB）
└── comment-pagination.tsx    # 评论分页组件（10KB）

lib/utils/
└── comment-sorting.ts       # 排序工具函数（12KB）

hooks/
└── use-comment-sorting.ts   # 评论排序 Hook（10KB）

app/examples/
└── comment-sorting-demo.tsx  # 示例页面（18KB）
```

## 🚀 快速开始

### 1. 基础使用

```tsx
import { CommentSortBar, CommentPagination } from '@/components/comment';
import { useCommentSorting } from '@/hooks/use-comment-sorting';

function CommentSection() {
  const {
    page,
    pageSize,
    total,
    comments,
    loading,
    hasMore,
    sortType,
    authorOnly,
    loadMore,
    changeSortType,
    toggleAuthorFilter,
  } = useCommentSorting(comments, 'author-id');

  return (
    <div>
      {/* 排序栏 */}
      <CommentSortBar
        sortType={sortType}
        onSortChange={changeSortType}
        authorOnly={authorOnly}
        onAuthorFilterChange={toggleAuthorFilter}
        totalComments={total}
      />

      {/* 评论列表 */}
      {loading && comments.length === 0 ? (
        <div>加载中...</div>
      ) : (
        <CommentList comments={comments} />
      )}

      {/* 分页 */}
      <CommentPagination
        page={page}
        pageSize={pageSize}
        total={total}
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
        type="load-more"
      />
    </div>
  );
}
```

### 2. 楼主评论置顶

```tsx
import { sortAndGroupComments } from '@/lib/utils/comment-sorting';

const { pinned, comments } = sortAndGroupComments(
  allComments,
  'hot',
  {
    pinAuthorComments: true,
    maxPinnedComments: 3,
  }
);

return (
  <div>
    {/* 置顶评论 */}
    {pinned.map(comment => (
      <Comment key={comment.id} comment={comment} />
    ))}

    {/* 普通评论 */}
    {comments.map(comment => (
      <Comment key={comment.id} comment={comment} />
    ))}
  </div>
);
```

### 3. 自定义热门算法

```tsx
const customHotScoreFormula = (comment: any) => {
  const likes = comment.likes || 0;
  const replies = comment.reply_count || 0;
  const hoursSinceCreated =
    (Date.now() - new Date(comment.created_at).getTime()) / 3600000;

  // 自定义算法：点赞 + 回复 - 时间衰减
  const timeDecay = Math.max(0, 1 - hoursSinceCreated / 168); // 168小时 = 7天
  return (likes * 2 + replies) * timeDecay;
};

const { comments } = useCommentSorting(allComments, undefined, {
  hotScoreFormula: customHotScoreFormula,
});
```

### 4. 搜索评论

```tsx
import { searchComments, highlightSearchKeywords } from '@/lib/utils/comment-sorting';

function CommentSearch() {
  const [query, setQuery] = useState('');
  const [comments] = useState(allComments);

  const searchResults = searchComments(comments, query);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索评论..."
      />

      {searchResults.map(comment => (
        <div
          key={comment.id}
          dangerouslySetInnerHTML={{
            __html: highlightSearchKeywords(
              comment.content,
              query,
              'bg-yellow-200'
            ),
          }}
        />
      ))}
    </div>
  );
}
```

## 🎨 组件 API

### CommentSortBar

评论排序栏组件。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `sortType` | `CommentSortType` | *必需* | 当前排序类型 |
| `onSortChange` | `(sortType) => void` | *必需* | 排序类型改变回调 |
| `authorOnly` | `boolean` | `false` | 是否只看楼主 |
| `onAuthorFilterChange` | `(authorOnly) => void` | - | 只看楼主改变回调 |
| `totalComments` | `number` | `0` | 评论总数 |
| `customSortOptions` | `CommentSortOption[]` | - | 自定义排序选项 |
| `showTotal` | `boolean` | `true` | 是否显示总数 |
| `position` | `'top' \| 'sticky'` | `'sticky'` | 排序栏位置 |

### CommentPagination

评论分页组件。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `page` | `number` | *必需* | 当前页码 |
| `pageSize` | `number` | *必需* | 每页数量 |
| `total` | `number` | *必需* | 总数 |
| `hasMore` | `boolean` | *必需* | 是否有更多 |
| `loading` | `boolean` | *必需* | 是否加载中 |
| `onLoadMore` | `() => void` | *必需* | 加载更多回调 |
| `onPageChange` | `(page) => void` | - | 跳转到指定页 |
| `type` | `'load-more' \| 'pagination' \| 'infinite'` | `'load-more'` | 分页类型 |
| `pageRange` | `number` | `3` | 显示的页码范围 |
| `loadMoreText` | `string` | `'加载更多评论'` | 加载更多文本 |
| `loadingText` | `string` | `'加载中...'` | 加载中文本 |
| `noMoreText` | `string` | `'没有更多评论了'` | 没有更多文本 |

### CommentStats

评论统计组件。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `total` | `number` | *必需* | 评论总数 |
| `pinnedCount` | `number` | `0` | 置顶评论数 |
| `currentPageCount` | `number` | `0` | 当前页评论数 |
| `currentPage` | `number` | `1` | 当前页码 |
| `totalPages` | `number` | `1` | 总页数 |

## 🔧 Hook API

### useCommentSorting

评论排序和分页 Hook。

#### 参数

```typescript
(
  allComments: any[],           // 原始评论列表
  authorId?: string,            // 帖子作者ID
  config?: Partial<CommentSortConfig>  // 配置选项
)
```

#### 返回值

```typescript
{
  // 状态
  page: number;                 // 当前页码
  pageSize: number;             // 每页数量
  total: number;                // 总数
  comments: any[];             // 当前页评论
  loading: boolean;             // 是否加载中
  hasMore: boolean;            // 是否有更多
  error: string | null;        // 错误信息
  sortType: CommentSortType;    // 排序类型
  authorOnly: boolean;          // 是否只看楼主

  // 计算属性
  totalPages: number;           // 总页数
  stats: {                     // 统计信息
    total: number;
    pinned: number;
    authorComments: number;
    totalLikes: number;
    totalReplies: number;
    averageLikes: number;
    averageReplies: number;
  };

  // 操作方法
  loadMore: () => void;        // 加载更多
  changeSortType: (sortType) => void;  // 改变排序
  toggleAuthorFilter: () => void;  // 切换作者筛选
  goToPage: (page) => void;     // 跳转到指定页
  reset: () => void;            // 重置状态
  reload: () => void;           // 重新加载
}
```

### useClientSideCommentSorting

简化版评论排序 Hook（用于客户端排序）。

#### 参数

```typescript
(
  initialComments: any[],   // 初始评论列表
  authorId?: string        // 帖子作者ID
)
```

#### 返回值

```typescript
{
  comments: any[];             // 过滤和排序后的评论
  pinnedComments: any[];       // 置顶评论
  total: number;              // 总数
  sortType: CommentSortType;   // 排序类型
  authorOnly: boolean;         // 是否只看楼主
  setSortType: (sortType) => void;   // 设置排序类型
  setAuthorOnly: (authorOnly) => void; // 设置作者筛选
  setComments: (comments) => void;      // 设置评论列表
}
```

## 📊 排序算法

### 热门排序（Wilson Score Interval）

使用 Wilson score interval 算法计算热门分数，避免新评论被埋没：

```typescript
const calculateHotScore = (comment) => {
  const likes = comment.likes || 0;
  const n = likes + 1; // 避免除零
  const z = 1.96; // 95% 置信度
  const p = likes / n;

  return (
    (p + z * z / (2 * n) - z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n)) /
    (1 + z * z / n)
  );
};
```

### 最新排序

按发布时间倒序排列：

```typescript
const sortByNewest = (comments) => {
  return [...comments].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });
};
```

### 最早排序

按发布时间正序排列：

```typescript
const sortByOldest = (comments) => {
  return [...comments].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateA - dateB;
  });
};
```

### 最多点赞

按点赞数降序排列：

```typescript
const sortByTop = (comments) => {
  return [...comments].sort((a, b) => (b.likes || 0) - (a.likes || 0));
};
```

## 🎯 使用场景

### 1. 社区帖子评论

```tsx
function PostComments({ postId, authorId }) {
  const { data: comments } = useComments(postId);

  const {
    page,
    comments: currentComments,
    loadMore,
    changeSortType,
    sortType,
  } = useCommentSorting(comments || [], authorId);

  return (
    <div>
      <CommentSortBar
        sortType={sortType}
        onSortChange={changeSortType}
        totalComments={comments?.length || 0}
      />

      <CommentList comments={currentComments} />

      <CommentPagination
        page={page}
        pageSize={20}
        total={comments?.length || 0}
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
      />
    </div>
  );
}
```

### 2. 只看楼主

```tsx
function AuthorOnlyComments() {
  const { authorOnly, toggleAuthorFilter, comments } = useCommentSorting(
    allComments,
    authorId
  );

  return (
    <div>
      <CommentSortBar
        authorOnly={authorOnly}
        onAuthorFilterChange={toggleAuthorFilter}
        totalComments={allComments.length}
      />

      {authorOnly && (
        <Badge variant="secondary">
          只显示楼主的 {comments.length} 条评论
        </Badge>
      )}

      <CommentList comments={comments} />
    </div>
  );
}
```

### 3. 楼主评论置顶

```tsx
function PinnedComments() {
  const { comments, pinnedComments } = useCommentSorting(
    allComments,
    authorId,
    {
      pinAuthorComments: true,
      maxPinnedComments: 3,
    }
  );

  return (
    <div>
      {/* 置顶评论 */}
      {pinnedComments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            楼主精彩回复
          </h3>
          {pinnedComments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              showPinnedBadge={true}
            />
          ))}
        </div>
      )}

      {/* 普通评论 */}
      <CommentList comments={comments} />
    </div>
  );
}
```

### 4. 传统分页

```tsx
function PaginationComments() {
  const { page, totalPages, goToPage, comments } = useCommentSorting(
    allComments
  );

  return (
    <div>
      <CommentList comments={comments} />

      <CommentPagination
        page={page}
        pageSize={20}
        total={allComments.length}
        hasMore={page < totalPages}
        onPageChange={goToPage}
        type="pagination"
      />
    </div>
  );
}
```

### 5. 无限滚动

```tsx
function InfiniteScrollComments() {
  const { comments, hasMore, loading, loadMore } = useCommentSorting(
    allComments
  );

  return (
    <div>
      <CommentList comments={comments} />

      <CommentPagination
        page={1}
        pageSize={20}
        total={allComments.length}
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
        type="infinite"
      />
    </div>
  );
}
```

## 📈 性能优化

### 1. 虚拟滚动

```tsx
import { VirtualList } from 'react-virtual';

<VirtualList
  height={600}
  itemCount={comments.length}
  itemSize={150}
  renderItem={({ index, style }) => (
    <div style={style}>
      <Comment comment={comments[index]} />
    </div>
  )}
/>
```

### 2. 防抖搜索

```tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (query) => {
    const results = searchComments(comments, query);
    setSearchResults(results);
  },
  300
);
```

### 3. 记忆化排序

```tsx
import { useMemo } from 'react';

const sortedComments = useMemo(() => {
  return sortAndGroupComments(comments, sortType, config);
}, [comments, sortType, config]);
```

## 🧪 测试

### 单元测试

```tsx
import { sortComments, sortByHot } from '@/lib/utils/comment-sorting';

describe('Comment Sorting', () => {
  it('should sort comments by hot score', () => {
    const comments = [
      { id: 1, likes: 10, created_at: new Date('2024-01-01') },
      { id: 2, likes: 5, created_at: new Date('2024-01-02') },
      { id: 3, likes: 20, created_at: new Date('2024-01-03') },
    ];

    const sorted = sortByHot(comments);
    expect(sorted[0].id).toBe(3); // 最多点赞
  });

  it('should sort comments by newest', () => {
    const comments = [
      { id: 1, created_at: new Date('2024-01-01') },
      { id: 2, created_at: new Date('2024-01-02') },
      { id: 3, created_at: new Date('2024-01-03') },
    ];

    const sorted = sortComments(comments, 'newest');
    expect(sorted[0].id).toBe(3); // 最新
  });
});
```

## 💡 最佳实践

### 1. 选择合适的排序方式

- **热门排序** - 适用于希望看到最有价值的评论的场景
- **最新排序** - 适用于希望及时看到新评论的场景
- **最早排序** - 适用于希望按时间顺序阅读的场景
- **最多点赞** - 适用于希望看到最受欢迎的评论的场景

### 2. 合理设置分页大小

- **移动端** - 10-15 条/页
- **桌面端** - 20-30 条/页
- **考虑性能** - 避免一次性加载过多评论

### 3. 优化置顶逻辑

```tsx
const config = {
  pinAuthorComments: true,      // 启用楼主置顶
  maxPinnedComments: 3,        // 最多置顶3条
  enableHot: true,             // 启用热门排序
  enableNewest: true,          // 启用最新排序
};
```

### 4. 提供反馈

```tsx
<div>
  {loading && <div className="text-center py-4">加载中...</div>}
  {error && <div className="text-red-500">{error}</div>}
  {comments.length === 0 && !loading && (
    <div className="text-muted-foreground">暂无评论</div>
  )}
</div>
```

### 5. 保存用户偏好

```tsx
const [sortType, setSortType] = useState<CommentSortType>(
  localStorage.getItem('commentSortType') as CommentSortType || 'newest'
);

const handleSortChange = (type: CommentSortType) => {
  setSortType(type);
  localStorage.setItem('commentSortType', type);
};
```

## 📚 相关文档

- [评论组件指南](./COMMENT_SUBMIT_GUIDE.md)
- [富文本支持指南](./RICH_TEXT_GUIDE.md)
- [加载状态指南](./LOADING_STATES_GUIDE.md)

## 🎉 总结

评论排序和分页系统提供：

✅ **热门排序** - Wilson score interval 算法
✅ **最新排序** - 按发布时间倒序
✅ **最早排序** - 按发布时间正序
✅ **最多点赞** - 按点赞数降序
✅ **楼主置顶** - 自动置顶作者评论
✅ **只看楼主** - 筛选作者评论
✅ **三种分页** - 加载更多、传统分页、无限滚动
✅ **统计信息** - 完整的评论统计
✅ **搜索功能** - 搜索和高亮关键词
✅ **自定义算法** - 支持自定义热门算法
✅ **完整文档** - 详细的使用指南和示例
✅ **类型安全** - 完整 TypeScript 支持
✅ **性能优化** - 虚拟滚动、防抖、记忆化

现在你可以在项目中使用完整的评论排序和分页功能了！🎉
