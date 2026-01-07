# 🚨 紧急修复指南 - gin_trgm_ops 错误

## 问题

```
ERROR: 42601: syntax error at or near "gin_trgm_ops"
LINE 302: create index idx_components_full_name on components(full_name gin gin_trgm_ops);
```

## 根本原因

使用 `gin_trgm_ops` 需要先启用 `pg_trgm` 扩展，但原 schema.sql 中缺少这个扩展声明。

## ✅ 解决方案（按顺序执行）

### 方案 1：使用完整修复版 schema（最简单）

**推荐**：我已创建了完全修复的文件。

1. 打开文件：`supabase/complete-schema-fixed.sql`
2. 复制**全部**内容（共约 750 行）
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run** 按钮

这个版本：
- ✅ 已添加 `pg_trgm` 扩展
- ✅ 使用 `DROP IF EXISTS` 避免重复
- ✅ 完整执行顺序：扩展 → 表 → 触发器 → 索引 → RLS → 视图 → 函数 → 数据
- ✅ 在最后包含验证查询

### 方案 2：分两步执行（如果方案1失败）

#### 第一步：快速修复
1. 打开 `supabase/fix-extension.sql`
2. 复制内容（只有 17 行）
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run**

这会安装 `pg_trgm` 扩展。

#### 第二步：执行完整 schema
1. 刷新 Supabase SQL Editor
2. 打开 `supabase/schema.sql`（原文件）
3. 复制全部内容
4. 粘贴并运行

### 方案 3：手动修复（最后手段）

在 Supabase SQL Editor 中，在**最顶部**添加这行：

```sql
-- Enable Trigram extension for full-text search
create extension if not exists "pg_trgm";
```

然后复制原 `schema.sql` 的其余部分粘贴在后面，一起运行。

## 🔍 验证修复

执行成功后，在 SQL Editor 中运行验证查询：

```sql
-- 检查扩展是否安装
SELECT extname, extversion
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pg_trgm');

-- 应该看到两行：
-- extname    | extversion
-- ------------+------------
-- uuid-ossp  | 1.1
-- pg_trgm     | 1.6

-- 检查表是否创建
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 应该看到9个表：
-- builds, comments, component_categories, components, likes, notifications, posts, profiles, saves

-- 检查索引
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

## 📁 文件说明

现在你有以下文件可用：

1. **supabase/schema.sql** - 原始文件（有缺失扩展的问题）
2. **supabase/complete-schema-fixed.sql** - ✅ 完整修复版（推荐使用）
3. **supabase/fix-extension.sql** - 快速修复脚本（只需安装扩展）

## 💡 推荐操作

**使用方案 1**（最简单）：

```bash
# 1. 打开文件
notepad supabase/complete-schema-fixed.sql

# 2. Ctrl+A 全选，Ctrl+C 复制

# 3. 在 Supabase SQL Editor 中 Ctrl+V 粘贴

# 4. 点击 Run 按钮
```

整个过程只需要 1 分钟！

## ⚠️ 常见错误

### "extension already exists"
✅ 这是正常的，脚本使用了 `IF NOT EXISTS`
→ 继续执行，没有问题

### "schema already exists"
✅ 正常，使用 `IF NOT EXISTS` 避免
→ 继续执行，脚本会跳过已存在的对象

### "relation does not exist"
❌ 说明表创建失败
→ 检查之前的错误消息，可能需要分步执行

### "function already exists"
✅ 正常，使用 `CREATE OR REPLACE`
→ 继续执行

## ✅ 成功标志

看到以下输出说明安装成功：

```
Extensions installed successfully!
["uuid-ossp", "pg_trgm"]
```

并且所有验证查询都返回预期结果。

## 🆘 还是有问题？

如果仍然遇到错误：

1. **先执行 `fix-extension.sql`** 单独安装扩展
2. 然后执行剩余的 schema（去掉扩展部分）
3. 或者逐段执行 SQL，定位具体问题

需要帮助？查看：
- `SETUP_GUIDE.md` - 完整配置指南
- `SQL_FIX.md` - 修复说明
- `supabase/README.md` - 数据库文档

---

**快速链接**：使用 `complete-schema-fixed.sql`（已完全修复，无需修改）⚡
