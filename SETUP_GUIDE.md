# PC Builder Studio - 本地配置指南

## 📋 配置步骤

### 第一步：获取 Supabase 凭证

1. 登录到你的 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目（如果没有项目，先创建一个）
3. 点击左侧菜单的 **Settings**（设置）→ **API**
4. 复制以下两个值：
   - **Project URL**（项目URL）- 类似：`https://xxxxxxxx.supabase.co`
   - **anon public**（公开密钥）- 以 `eyJ` 开头的长字符串

### 第二步：配置环境变量

有三种方式配置环境变量：

#### 方法 1：使用 .env.local 文件（推荐）

1. 打开项目根目录的 `.env.local` 文件
2. 用你从 Supabase 获取的实际值替换以下内容：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**示例**：
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3BxcnMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMDB9.xxx
```

#### 方法 2：直接编辑 .env.local 文件

在编辑器中打开 `d:/computer/pc-builder-studio/.env.local` 文件，填入你的凭证：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

保存文件后，Next.js 会自动重新加载。

#### 方法 3：使用命令行设置（临时）

如果你想临时测试，可以在命令行中设置：

**Windows PowerShell**:
```powershell
$env:NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
npm run dev
```

**Windows CMD**:
```cmd
set NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
set NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
npm run dev
```

**Linux/Mac**:
```bash
export NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
npm run dev
```

⚠️ **注意**：这种方法只对当前终端会话有效，关闭后需要重新设置。

### 第三步：安装数据库 Schema

由于发现了 pg_trgm 扩展的问题，请按以下步骤修复：

#### 修复后的 Schema

我已经修复了 `supabase/schema.sql` 文件，添加了缺失的扩展。现在请：

1. 打开 Supabase Dashboard
2. 进入 **SQL Editor** (SQL编辑器)
3. 打开修复后的 `supabase/schema.sql` 文件（已更新）
4. 复制**全部**内容
5. 粘贴到 SQL Editor
6. 点击 **Run** 按钮（或按 Ctrl/Cmd + Enter）

#### 或者手动修复（如果需要）

如果 SQL Editor 还在使用旧版本，请在 SQL Editor 最开始添加：

```sql
-- Enable Trigram extension for full-text search
create extension if not exists "pg_trgm";
```

### 第四步：添加示例数据（可选）

如果你想测试一些示例组件：

1. 打开 `supabase/sample-data.sql`
2. 复制全部内容
3. 在 Supabase SQL Editor 中粘贴并运行

### 第五步：验证配置

创建一个测试文件来验证连接：

```typescript
// test-supabase.ts
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

async function testConnection() {
  console.log('Testing Supabase connection...')

  try {
    // 测试读取分类
    const { data: categories, error: catError } = await supabase
      .from('component_categories')
      .select('*')

    if (catError) {
      console.error('Error fetching categories:', catError)
      return
    }

    console.log('✅ Categories found:', categories?.length)

    // 测试读取组件（如果有示例数据）
    const { data: components, error: compError } = await supabase
      .from('components')
      .select('*')
      .limit(5)

    if (compError) {
      console.error('Error fetching components:', compError)
    } else {
      console.log('✅ Components found:', components?.length)
    }

    console.log('✅ Database connection successful!')
  } catch (error) {
    console.error('❌ Connection failed:', error)
  }
}

testConnection()
```

运行测试：
```bash
npx tsx test-supabase.ts
```

或者在浏览器中测试（在组件中使用）：
```typescript
'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestConnection() {
  useEffect(() => {
    async function test() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('component_categories')
        .select('*')

      console.log('Categories:', data)
      console.log('Error:', error)
    }
    test()
  }, [])

  return <div>Check console for results</div>
}
```

## 🔍 常见问题

### Q: .env.local 文件不存在怎么办？
**A:** 已经为你创建了。位置：`d:/computer/pc-builder-studio/.env.local`

### Q: 修改 .env.local 后需要重启吗？
**A:** 是的，需要重启开发服务器：
- 在终端按 `Ctrl + C` 停止
- 重新运行 `npm run dev`

### Q: SQL 执行失败，提示其他错误？
**A:** 检查：
1. 是否复制了完整的 schema.sql（所有部分）
2. 确保扩展创建在表创建之前
3. 逐个运行 SQL 语句，定位具体错误

### Q: 如何确认环境变量已加载？
**A:**
```typescript
// 在开发服务器日志中检查
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

### Q: .env.local 会提交到 Git 吗？
**A:** 不会。`.gitignore` 已经排除了 `.env.local` 文件，确保你的密钥不会被意外提交。

## ✅ 配置检查清单

- [ ] 已创建 Supabase 项目
- [ ] 已复制 Project URL 和 Anon Key
- [ ] 已创建/编辑 `.env.local` 文件
- [ ] 已在 `.env.local` 中填入实际值
- [ ] 已在 Supabase SQL Editor 中运行 schema.sql
- [ ] 已验证表和索引创建成功
- [ ] 已运行测试连接（可选）
- [ ] 已添加示例数据（可选）
- [ ] 开发服务器正在运行且无错误

## 🚀 启动项目

完成所有配置后：

```bash
cd d:/computer/pc-builder-studio
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看你的应用！

## 📚 下一步

1. **查看数据库文档** - 阅读 `supabase/README.md`
2. **使用查询函数** - 参考 `lib/supabase/queries.ts`
3. **测试类型** - 检查 `types/index.ts`
4. **添加认证** - 实现 Supabase Auth

## 💡 提示

- 将 `.env.local.example` 添加到版本控制，作为模板
- 不要将 `.env.local` 添加到版本控制（包含敏感信息）
- 定期更新 Supabase 密钥以提高安全性
- 为不同环境使用不同的项目（开发、生产）

---

**需要帮助？** 查看 `supabase/INSTALLATION.md` 获取更详细的说明。
