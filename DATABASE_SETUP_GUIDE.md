# 数据库设置指南

遇到 `relation "profiles" already exists` 错误的解决方案。

## 问题分析

错误信息：
```
ERROR: 42P07: relation "profiles" already exists
```

这个错误表示 `profiles` 表已经存在于数据库中，不能重复创建。

---

## 解决方案

### 方案 1：使用安全的迁移脚本（推荐）

运行 `create-profiles-table.sql`，这个脚本使用了 `IF NOT EXISTS`，可以安全地重复执行：

```bash
# 在 Supabase SQL Editor 中执行
supabase/migrations/create-profiles-table.sql
```

**优点**：
- ✅ 安全，不会删除现有数据
- ✅ 可以重复执行
- ✅ 自动处理已存在的表和索引

**步骤**：
1. 打开 Supabase Dashboard
2. 进入 SQL Editor
3. 粘贴 `create-profiles-table.sql` 的内容
4. 点击 Run 执行

---

### 方案 2：检查现有表结构

运行 `check-tables.sql` 来检查数据库的当前状态：

```sql
-- 复制并执行 supabase/migrations/check-tables.sql
```

这会显示：
- profiles 表是否存在
- 表中有多少条记录
- 表的结构（列名、数据类型）
- 现有的索引
- RLS 策略
- 触发器
- 存储桶状态

---

### 方案 3：重置表（谨慎使用！）

**⚠️ 警告：此操作会删除所有用户资料数据！**

如果你确定需要重新开始，可以运行 `reset-profiles-table.sql`：

```sql
-- 复制并执行 supabase/migrations/reset-profiles-table.sql
```

然后重新运行 `create-profiles-table.sql`。

**使用场景**：
- 开发环境，需要清空测试数据
- 表结构错误，需要重建
- 迁移脚本执行失败，需要重来

---

## 手动检查和修复

### 1. 检查表是否存在

```sql
-- 方法 1：检查信息模式
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) as table_exists;

-- 方法 2：尝试查询表
SELECT COUNT(*) FROM profiles;
```

### 2. 查看表结构

```sql
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;
```

### 3. 添加缺失的列

如果表已存在但缺少某些列：

```sql
-- 示例：添加 role 列
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' 
CHECK (role IN ('admin', 'moderator', 'user', 'guest'));

-- 示例：添加 status 列
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
CHECK (status IN ('active', 'inactive', 'suspended', 'banned'));

-- 示例：添加 provider 列
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email' 
CHECK (provider IN ('email', 'github', 'google', 'facebook', 'twitter'));
```

### 4. 添加缺失的索引

```sql
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
```

### 5. 创建或替换策略

```sql
-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 创建或替换策略
CREATE OR REPLACE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE OR REPLACE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE OR REPLACE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

## 验证设置

运行以下 SQL 验证设置是否正确：

```sql
-- 1. 验证表存在
SELECT 'profiles table exists' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- 2. 验证列结构
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. 验证索引
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles' 
AND schemaname = 'public';

-- 4. 验证策略
SELECT policyname, permissive, cmd
FROM pg_policies
WHERE tablename = 'profiles' 
AND schemaname = 'public';

-- 5. 验证触发器
SELECT trigger_name, event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'public' 
AND event_object_table = 'users';
```

---

## 常见问题

### Q1: 如何删除整个表并重新创建？

**A**: 运行 `reset-profiles-table.sql` 然后运行 `create-profiles-table.sql`。

**⚠️ 警告：这会删除所有数据！**

### Q2: 如何只添加缺失的列而不删除现有数据？

**A**: 使用 `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` 语句。

```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS new_column_name TEXT;
```

### Q3: 如何更新现有列的约束？

**A**: 需要先删除约束再添加新的。

```sql
-- 删除现有约束
ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;

-- 添加新约束
ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'moderator', 'user', 'guest'));
```

### Q4: 如何备份现有数据？

**A**: 使用 pg_dump 或 Supabase 的导出功能。

```sql
-- 导出 profiles 表数据
COPY profiles TO 'profiles_backup.csv' WITH CSV HEADER;
```

或在 Supabase Dashboard 中：
1. 进入 Database > Tables
2. 选择 profiles 表
3. 点击 Export 导出数据

### Q5: 如何恢复备份的数据？

**A**: 使用 COPY 命令或导入功能。

```sql
-- 导入数据
COPY profiles FROM 'profiles_backup.csv' WITH CSV HEADER;
```

---

## 推荐的工作流程

### 开发环境

1. **首次设置**：
   ```sql
   -- 运行创建脚本
   create-profiles-table.sql
   ```

2. **遇到错误**：
   ```sql
   -- 先检查状态
   check-tables.sql
   
   -- 根据情况选择：
   -- - 使用安全脚本（推荐）
   create-profiles-table.sql
   
   -- - 或重置表（会删除数据）
   reset-profiles-table.sql
   create-profiles-table.sql
   ```

3. **验证设置**：
   ```sql
   -- 运行验证查询
   -- 见"验证设置"部分
   ```

### 生产环境

1. **使用迁移**：
   - 使用 Supabase Migrations
   - 版本控制所有数据库更改
   - 在测试环境先验证

2. **备份**：
   - 定期备份数据库
   - 重大更改前备份
   - 使用时间点恢复

3. **监控**：
   - 监控数据库性能
   - 检查错误日志
   - 设置告警

---

## 相关文件

- `supabase/migrations/create-profiles-table.sql` - 安全的创建脚本（推荐）
- `supabase/migrations/reset-profiles-table.sql` - 重置脚本（谨慎使用）
- `supabase/migrations/check-tables.sql` - 检查脚本（诊断用）
- `AUTH_SYSTEM_GUIDE.md` - 完整的认证系统指南

---

## 需要帮助？

如果问题仍然存在：

1. 运行 `check-tables.sql` 并分享结果
2. 检查 Supabase Dashboard 的日志
3. 联系 Supabase 支持

---

## 总结

**推荐方案**：使用 `create-profiles-table.sql`

这个脚本：
- ✅ 使用 `IF NOT EXISTS` 避免重复创建
- ✅ 使用 `CREATE OR REPLACE` 更新策略
- ✅ 使用 `DROP TRIGGER IF EXISTS` 处理触发器
- ✅ 可以安全地重复执行
- ✅ 不会删除现有数据
