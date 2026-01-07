# 无限滚动实现指南

## 📚 目录

- [概述](#概述)
- [快速开始](#快速开始)
- [核心概念](#核心概念)
- [基础用法](#基础用法)
- [帖子无限滚动](#帖子无限滚动)
- [高级功能](#高级功能)
- [组件使用](#组件使用)
- [性能优化](#性能优化)
- [最佳实践](#最佳实践)
- [API 参考](#api-参考)

## 概述

无限滚动模块提供了一套完整的无限滚动解决方案，包括：

- ✅ **Intersection Observer** - 自动检测滚动位置
- ✅ **智能缓存** - 减少重复请求
- ✅ **错误处理** - 完善的错误重试机制
- ✅ **性能优化** - 智能加载策略
- ✅ **TypeScript** - 完整的类型支持
- ✅ **灵活配置** - 支持多种自定义选项

## 快速开始

### 1. 基础使用

```tsx
import { useInfiniteScroll } from '@/lib/infinite';
import { LoadMoreTrigger } from '@/components/infinite';

function MyComponent() {
  const { data, loading, hasMore, loadMore } = useInfiniteScroll(
    async ({ page, limit }) => {
      const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
      return response.json();
    }
  );

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
      
      <LoadMoreTrigger
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}
```

### 2. 帖子无限滚动

```tsx
import { useInfinitePosts } from '@/lib/infinite';

function CommunityPage() {
  const {
    posts,
    loading,
    hasMore,
    sortBy,
    changeSort,
    loadMore,
  } = useInfinitePosts(
    async ({ page, limit, sortBy, filters }) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ page, limit, sortBy, filters })
      });
      return response.json();
    },
    {
      pageSize: 20,
      defaultSort: 'latest',
    }
  );

  return (
    <div>
      <button onClick={() => changeSort('hot')}>热门</button>
      <button onClick={() => changeSort('latest')}>最新</button>
      
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      <LoadMoreTrigger
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}
```

## 核心概念

### InfiniteScrollConfig

无限滚动配置选项：

```typescript
interface InfiniteScrollConfig {
  /** 每页加载数量 */
  pageSize?: number;              // 默认: 20
  /** 触发距离（像素） */
  triggerDistance?: number;        // 默认: 200
  /** 是否启用自动加载 */
  autoLoad?: boolean;             // 默认: true
  /** 防抖延迟（毫秒） */
  debounceDelay?: number;         // 默认: 300
  /** 最大加载页数 */
  maxPages?: number;              // 默认: Infinity
  /** 预加载下一页（提前多少像素） */
  preloadDistance?: number;       // 默认: 500
  /** 是否启用缓存 */
  enableCache?: boolean;          // 默认: true
  /** 缓存过期时间（毫秒） */
  cacheExpiry?: number;           // 默认: 300000 (5分钟)
}
```

### LoadFunction

加载函数类型：

```typescript
type LoadFunction<T = any> = (
  params: LoadParams<T>
) => Promise<LoadResult>;

interface LoadParams<T = any> {
  page: number;
  limit: number;
  sortBy?: string;
  filters?: T;
}

interface LoadResult {
  data: CommunityPost[];
  total?: number;
  hasMore: boolean;
  page: number;
}
```

## 基础用法

### useInfiniteScroll Hook

```tsx
import { useInfiniteScroll } from '@/lib/infinite';

function MyComponent() {
  const {
    data,           // 数据列表
    page,           // 当前页码
    hasMore,        // 是否有更多数据
    loading,        // 是否正在加载
    error,          // 错误信息
    total,          // 总数
    loadedCount,    // 已加载数量
    loadMore,       // 加载更多
    reload,         // 重新加载
    reset,          // 重置并加载
    goToPage,       // 跳转到指定页
    preloadNext,    // 预加载下一页
    clearCache,     // 清除缓存
    getCacheStats,  // 获取缓存统计
  } = useInfiniteScroll(loadFn, config);
}
```

### 示例：带缓存控制

```tsx
const {
  data,
  loading,
  hasMore,
  clearCache,
  getCacheStats,
} = useInfiniteScroll(loadFn, {
  pageSize: 20,
  enableCache: true,
  cacheExpiry: 300000, // 5分钟
});

// 手动清除缓存
const handleClearCache = () => {
  clearCache();
};

// 获取缓存统计
const cacheStats = getCacheStats();
console.log('缓存大小:', cacheStats.size);
console.log('缓存命中率:', cacheStats.hitRate);
```

### 示例：手动加载控制

```tsx
const {
  data,
  loading,
  hasMore,
  loadMore,
  goToPage,
} = useInfiniteScroll(loadFn, {
  autoLoad: false, // 关闭自动加载
});

return (
  <div>
    <button onClick={loadMore} disabled={loading || !hasMore}>
      加载更多
    </button>
    
    <button onClick={() => goToPage(0)}>
      第一页
    </button>
    
    <button onClick={() => goToPage(5)}>
      第六页
    </button>
    
    {data.map(item => (
      <div key={item.id}>{item.title}</div>
    ))}
  </div>
);
```

## 帖子无限滚动

### useInfinitePosts Hook

```tsx
import { useInfinitePosts } from '@/lib/infinite';

function CommunityFeed() {
  const {
    posts,          // 帖子列表
    page,           // 当前页码
    hasMore,        // 是否有更多帖子
    loading,        // 是否正在加载
    error,          // 错误信息
    total,          // 总数
    loadedCount,    // 已加载数量
    sortBy,         // 当前排序方式
    filters,        // 当前筛选条件
    loadMore,       // 加载更多
    reload,         // 重新加载
    reset,          // 重置并加载
    goToPage,       // 跳转到指定页
    changeSort,     // 改变排序方式
    changeFilters,  // 改变筛选条件
    updateQuery,    // 更新查询（智能重置）
    preloadNext,    // 预加载下一页
    clearCache,     // 清除缓存
    getCacheStats,  // 获取缓存统计
  } = useInfinitePosts(loadFn, config);
}
```

### 示例：带排序和筛选

```tsx
const {
  posts,
  loading,
  hasMore,
  sortBy,
  filters,
  changeSort,
  changeFilters,
  loadMore,
} = useInfinitePosts(loadFn, {
  pageSize: 20,
  defaultSort: 'latest',
  defaultFilters: { type: [], difficulty: [] },
  resetOnChange: true, // 排序/筛选变化时重置
});

return (
  <div>
    {/* 排序按钮 */}
    <button onClick={() => changeSort('latest')}>最新</button>
    <button onClick={() => changeSort('hot')}>热门</button>
    <button onClick={() => changeSort('trending')}>趋势</button>
    
    {/* 筛选按钮 */}
    <button onClick={() => changeFilters({ type: ['build'] })}>
      只看构建
    </button>
    <button onClick={() => changeFilters({ type: [] })}>
      全部
    </button>
    
    {/* 帖子列表 */}
    {posts.map(post => (
      <div key={post.id}>{post.title}</div>
    ))}
    
    <LoadMoreTrigger
      loading={loading}
      hasMore={hasMore}
      onLoadMore={loadMore}
    />
  </div>
);
```

### 示例：智能查询更新

```tsx
const { updateQuery, posts, loading, hasMore, loadMore } = useInfinitePosts(
  loadFn,
  { resetOnChange: true }
);

// 同时更新排序和筛选
const handleUpdate = async () => {
  await updateQuery({
    sortBy: 'hot',
    filters: { type: ['build'], difficulty: ['advanced'] }
  });
};

// 只更新排序
const handleSortChange = async () => {
  await updateQuery({ sortBy: 'latest' });
};
```

## 高级功能

### 1. 预加载

```tsx
const { preloadNext, data } = useInfiniteScroll(loadFn);

// 用户接近底部时预加载下一页
useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY + window.innerHeight > document.body.scrollHeight - 1000) {
      preloadNext();
    }
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [preloadNext]);
```

### 2. 分页跳转

```tsx
const { goToPage, page, data } = useInfiniteScroll(loadFn);

// 跳转到指定页
const handleGoToPage = (pageNumber: number) => {
  goToPage(pageNumber);
};

// 分页导航
<div>
  <button onClick={() => goToPage(page - 1)} disabled={page === 0}>
    上一页
  </button>
  <span>第 {page + 1} 页</span>
  <button onClick={() => goToPage(page + 1)} disabled={!hasMore}>
    下一页
  </button>
</div>
```

### 3. 错误处理和重试

```tsx
const { loading, error, reload, reset } = useInfiniteScroll(loadFn);

if (error) {
  return (
    <div>
      <p>加载失败: {error.message}</p>
      <button onClick={reload}>重试</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}
```

### 4. 进度显示

```tsx
import { ProgressBar } from '@/components/infinite';

const { loadedCount, total, data } = useInfiniteScroll(loadFn);

return (
  <div>
    <ProgressBar 
      progress={(loadedCount / total) * 100} 
      showText 
      color="blue" 
    />
    <p>已加载 {loadedCount} / {total}</p>
    
    {data.map(item => (
      <div key={item.id}>{item.title}</div>
    ))}
  </div>
);
```

## 组件使用

### LoadMoreTrigger

加载更多触发器组件：

```tsx
import { LoadMoreTrigger } from '@/components/infinite';

<LoadMoreTrigger
  loading={loading}
  hasMore={hasMore}
  error={error}
  onLoadMore={loadMore}
  onRetry={retry}
  loadingText="加载中..."
  errorText="加载失败"
  noMoreText="没有更多数据了"
  showProgress
  loadedCount={100}
  total={500}
/>
```

### CompactLoadMoreTrigger

紧凑型加载更多触发器：

```tsx
import { CompactLoadMoreTrigger } from '@/components/infinite';

<CompactLoadMoreTrigger
  loading={loading}
  hasMore={hasMore}
  size="sm"  // sm | md | lg
  onLoadMore={loadMore}
/>
```

### ProgressBar

进度条组件：

```tsx
import { ProgressBar } from '@/components/infinite';

// 基础用法
<ProgressBar progress={50} />

// 带文本
<ProgressBar progress={75} showText />

// 自定义颜色
<ProgressBar progress={85} color="green" showText />

// 动画效果
<ProgressBar progress={90} color="yellow" animated />
```

### SkeletonLoading

骨架屏加载组件：

```tsx
import { SkeletonLoading } from '@/components/infinite';

// 卡片骨架
<SkeletonLoading count={3} type="card" />

// 列表骨架
<SkeletonLoading count={5} type="list" />

// 紧凑骨架
<SkeletonLoading count={10} type="compact" />
```

## 性能优化

### 1. 智能加载

```tsx
import { smartLoadPosts } from '@/lib/infinite';

// 自动根据设备和网络调整加载策略
const posts = await smartLoadPosts(loadFn, {
  page: 0,
  sortBy: 'hot',
});
```

智能加载特性：
- ✅ 检测设备性能（CPU 核心数）
- ✅ 检测网络速度（Connection API）
- ✅ 低端设备自动减少每页数量
- ✅ 慢速网络只加载首屏
- ✅ 优先加载重要内容

### 2. 批量加载

```tsx
import { batchLoadPosts } from '@/lib/infinite';

// 分批加载，带进度回调
const posts = await batchLoadPosts(
  loadFn,
  {
    page: 0,
    limit: 20,
    totalBatches: 5,
  },
  (currentBatch, totalBatches, loadedCount) => {
    console.log(`加载进度: ${currentBatch}/${totalBatches}, 已加载: ${loadedCount}`);
  }
);
```

### 3. 快速加载

```tsx
import { quickLoadPosts } from '@/lib/infinite';

// 一次性加载所有数据
const posts = await quickLoadPosts(loadFn, {
  page: 0,
  limit: 50,
  sortBy: 'hot',
});
```

### 4. 缓存优化

```tsx
// 启用缓存
const { data, clearCache, getCacheStats } = useInfiniteScroll(loadFn, {
  enableCache: true,
  cacheExpiry: 300000, // 5分钟
});

// 手动清除缓存
clearCache();

// 查看缓存统计
const stats = getCacheStats();
console.log('缓存命中率:', stats.hitRate);
console.log('缓存大小:', stats.size);
```

## 最佳实践

### 1. 数据去重

```tsx
const { data } = useInfiniteScroll(loadFn, {
  // Hook 内部已实现基于 ID 的去重
});

// 自定义去重字段
const { data } = useInfiniteScroll(loadFn, {
  dedupeBy: 'id', // 或其他唯一字段
});
```

### 2. 错误恢复

```tsx
const { error, reload, reset } = useInfiniteScroll(loadFn);

useEffect(() => {
  if (error) {
    // 自动重试（最多 3 次）
    let retries = 0;
    const retry = setInterval(() => {
      if (retries < 3) {
        reload();
        retries++;
      } else {
        clearInterval(retry);
      }
    }, 5000);
    
    return () => clearInterval(retry);
  }
}, [error, reload]);
```

### 3. 滚动位置恢复

```tsx
const [scrollPosition, setScrollPosition] = useState(0);

// 保存滚动位置
useEffect(() => {
  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// 恢复滚动位置
useEffect(() => {
  window.scrollTo(0, scrollPosition);
}, [data]);
```

### 4. 虚拟化长列表

对于极长的列表（> 1000 项），建议使用虚拟化库：

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const parentRef = useRef<HTMLDivElement>(null);
const virtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 100,
});

return (
  <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
    <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
      {virtualizer.getVirtualItems().map(virtualRow => (
        <div
          key={virtualRow.key}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${virtualRow.start}px)`,
          }}
        >
          {data[virtualRow.index].title}
        </div>
      ))}
    </div>
  </div>
);
```

## API 参考

### useInfiniteScroll

```typescript
function useInfiniteScroll<T = any>(
  loadFn: LoadFunction<T>,
  config?: InfiniteScrollConfig
): InfiniteScrollResult<T>
```

**参数**：
- `loadFn`: 加载数据的函数
- `config`: 配置选项

**返回值**：
- `data`: 数据列表
- `page`: 当前页码
- `hasMore`: 是否有更多数据
- `loading`: 是否正在加载
- `error`: 错误信息
- `total`: 总数
- `loadedCount`: 已加载数量
- `loadMore`: 加载更多
- `reload`: 重新加载
- `reset`: 重置并加载
- `goToPage`: 跳转到指定页
- `preloadNext`: 预加载下一页
- `clearCache`: 清除缓存
- `getCacheStats`: 获取缓存统计

### useInfinitePosts

```typescript
function useInfinitePosts(
  loadFn: PostLoadFunction,
  config?: InfinitePostsConfig
): InfinitePostsResult
```

**参数**：
- `loadFn`: 加载帖子的函数
- `config`: 配置选项

**返回值**：
- `posts`: 帖子列表
- `page`: 当前页码
- `hasMore`: 是否有更多帖子
- `loading`: 是否正在加载
- `error`: 错误信息
- `total`: 总数
- `loadedCount`: 已加载数量
- `sortBy`: 当前排序方式
- `filters`: 当前筛选条件
- `loadMore`: 加载更多
- `reload`: 重新加载
- `reset`: 重置并加载
- `goToPage`: 跳转到指定页
- `changeSort`: 改变排序方式
- `changeFilters`: 改变筛选条件
- `updateQuery`: 更新查询（智能重置）
- `preloadNext`: 预加载下一页
- `clearCache`: 清除缓存
- `getCacheStats`: 获取缓存统计

### smartLoadPosts

```typescript
async function smartLoadPosts(
  loadFn: PostLoadFunction,
  params: Omit<PostLoadParams, 'page'> & { page?: number }
): Promise<CommunityPost[]>
```

### batchLoadPosts

```typescript
async function batchLoadPosts(
  loadFn: PostLoadFunction,
  params: Omit<PostLoadParams, 'page'> & {
    page?: number;
    totalBatches?: number;
  },
  onProgress?: (
    currentBatch: number,
    totalBatches: number,
    loadedCount: number
  ) => void
): Promise<CommunityPost[]>
```

### quickLoadPosts

```typescript
async function quickLoadPosts(
  loadFn: PostLoadFunction,
  params: Omit<PostLoadParams, 'page'> & { page?: number }
): Promise<CommunityPost[]>
```

## 示例页面

访问完整示例：

```bash
npm run dev
# 访问 http://localhost:3000/examples/infinite-scroll-demo
```

示例包含：
- ✅ 基础无限滚动
- ✅ 帖子无限滚动（带排序和筛选）
- ✅ 高级功能（手动控制、分页跳转、预加载）
- ✅ 组件展示（触发器、进度条、骨架屏）
- ✅ 性能优化（智能加载、缓存统计）

## 总结

无限滚动模块提供：

✅ **自动加载** - Intersection Observer 自动检测
✅ **智能缓存** - 减少重复请求
✅ **错误处理** - 完善的重试机制
✅ **性能优化** - 智能加载策略
✅ **类型安全** - 完整 TypeScript 支持
✅ **灵活配置** - 支持多种自定义选项
✅ **丰富组件** - 触发器、进度条、骨架屏
✅ **完整文档** - 详细 API 和最佳实践

适用于任何需要无限滚动的场景！
