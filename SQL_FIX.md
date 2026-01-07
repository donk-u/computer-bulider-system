# SQL Schema 修复说明

## 问题描述

在执行 schema.sql 时遇到错误：
```
ERROR: 42601: syntax error at or near "gin_trgm_ops"
LINE 299: create index idx_components_full_name on components(full_name gin gin_trgm_ops);
```

## 问题原因

使用了 `gin_trgm_ops` 操作符类，但没有先启用 `pg_trgm` (PostgreSQL Trigram) 扩展。

## 解决方案

### 方案 1：使用已修复的 schema.sql（推荐）

✅ **已完成修复**：`supabase/schema.sql` 文件已更新，在第 3 行添加了：

```sql
-- Enable Trigram extension for full-text search
create extension if not exists "pg_trgm";
```

**操作步骤**：
1. 打开 `supabase/schema.sql` 文件（已修复版本）
2. 复制**全部**内容
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run**

### 方案 2：在现有 SQL 中手动添加

如果 Supabase SQL Editor 中还保留着旧版本，请在 SQL Editor 的最顶部添加：

```sql
-- Enable Trigram extension for full-text search
create extension if not exists "pg_trgm";
```

确保这行代码在表创建和索引创建之前。

## 验证修复

执行 SQL 后，运行以下查询验证扩展已启用：

```sql
SELECT * FROM pg_extension WHERE extname = 'pg_trgm';
```

应该看到返回一行结果。

## 扩展说明

**pg_trgm** 是 PostgreSQL 的 Trigram 扩展，用于：
- 全文搜索
- 相似度匹配
- 使用 GIN 索引加速 LIKE/ILIKE 查询

在我们的项目中，它被用于：
- 组件名称搜索（`components.full_name`）
- 支持模糊匹配（如搜索 "RTX" 匹配 "GeForce RTX 4080"）

## 需要的扩展列表

完整的扩展需求（schema.sql 已包含）：

```sql
-- UUID 生成
create extension if not exists "uuid-ossp";

-- 文本搜索和相似度匹配
create extension if not exists "pg_trgm";
```

## 其他可能的 SQL 错误

### "relation does not exist"
- 确保 schema.sql 完整执行（不要跳过部分）
- 表创建顺序很重要（先创建表，后创建外键）

### "function does not exist"
- 确保函数在使用前已创建
- 检查 `search_components` 和 `get_build_details` 函数

### "permission denied"
- 检查 RLS 策略是否正确应用
- 确保使用的是项目所有者账户执行

## 测试 SQL

修复后，运行以下测试 SQL 验证所有功能：

```sql
-- 测试 1: 读取分类
SELECT * FROM component_categories ORDER BY sort_order;

-- 测试 2: 搜索组件
SELECT * FROM search_components('RTX', 'gpu', 300, 800, 'NVIDIA');

-- 测试 3: 查看热门配置
SELECT * FROM popular_builds LIMIT 5;

-- 测试 4: 检查扩展
SELECT extname, extversion FROM pg_extension;
```

## 完成！

如果所有测试通过，说明数据库已成功配置 ✅

需要帮助？查看 `SETUP_GUIDE.md` 获取完整的配置步骤。
