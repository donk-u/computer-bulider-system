# 用户认证系统使用指南

完整的用户认证系统，基于 Supabase Auth 实现，支持邮箱登录、第三方登录、邮箱验证、密码重置等功能。

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [配置 Supabase](#配置-supabase)
- [组件 API](#组件-api)
- [Hook API](#hook-api)
- [服务 API](#服务-api)
- [数据库表结构](#数据库表结构)
- [使用场景](#使用场景)
- [最佳实践](#最佳实践)

---

## 功能特性

### 1. 认证功能

- ✅ **邮箱密码登录** - 支持邮箱和密码登录
- ✅ **用户注册** - 邮箱注册，可选用户名和显示名
- ✅ **密码强度验证** - 至少8位，包含大小写字母和数字
- ✅ **记住登录状态** - 支持7天/30天
- ✅ **第三方登录** - GitHub、Google 一键登录
- ✅ **邮箱验证** - 可选启用邮箱验证
- ✅ **密码重置** - 发送重置邮件
- ✅ **安全退出** - 安全登出

### 2. 用户管理

- ✅ **用户资料** - 完整的用户信息管理
- ✅ **头像上传** - 支持头像上传
- ✅ **个人信息** - 用户名、显示名、简介、位置、网站
- ✅ **角色权限** - 管理员、版主、普通用户
- ✅ **用户状态** - 活跃、未激活、暂停、封禁

### 3. 认证状态

- ✅ **实时状态** - 实时监听认证状态变化
- ✅ **会话管理** - 自动刷新会话
- ✅ **持久化登录** - 支持记住登录
- ✅ **自动登出** - 会话过期自动登出

---

## 快速开始

### 1. 配置 Supabase

首先需要在 Supabase 创建项目并配置认证。

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 2. 环境变量

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. 访问示例页面

```bash
npm run dev
# 访问 http://localhost:3000/examples/auth-demo
```

### 4. 基础使用

```tsx
import { AuthForm } from '@/components/auth';

function LoginPage() {
  return (
    <div className="auth-container">
      <AuthForm
        type="login"
        onSuccess={(user) => {
          console.log('登录成功:', user);
          // 跳转到首页
          router.push('/dashboard');
        }}
        onError={(error) => {
          console.error('登录失败:', error);
        }}
      />
    </div>
  );
}
```

---

## 配置 Supabase

### 1. 创建项目

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 记录项目的 URL 和 Anon Key

### 2. 配置认证

在 Supabase Dashboard 中：

1. 进入 **Authentication** > **Providers**
2. 配置 **Email** 提供商：
   - 启用 **Confirm email**（邮箱验证）
   - 设置 **Email templates**（邮件模板）
3. 配置 **GitHub** 提供商：
   - 在 GitHub 创建 OAuth App
   - 将 Client ID 和 Secret 添加到 Supabase
4. 配置 **Google** 提供商：
   - 在 Google Cloud Console 创建 OAuth 2.0 凭据
   - 将 Client ID 和 Secret 添加到 Supabase

### 3. 创建数据库表

```sql
-- 用户资料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  provider TEXT DEFAULT 'email',
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 允许用户查看所有资料
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- 允许用户更新自己的资料
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 允许用户插入自己的资料
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 4. 创建存储桶

```sql
-- 创建头像存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- 启用 RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 允许用户上传头像
CREATE POLICY "Users can upload avatar"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 允许用户查看头像
CREATE POLICY "Anyone can view avatar"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');
```

---

## 组件 API

### AuthForm

认证表单组件，支持登录、注册、密码重置。

#### Props

```typescript
interface AuthFormProps {
  /** 表单类型 */
  type?: 'login' | 'register' | 'reset-password';
  /** 成功回调 */
  onSuccess?: (user: any) => void;
  /** 错误回调 */
  onError?: (error: string) => void;
  /** 自定义样式 */
  className?: string;
  /** 是否显示切换按钮 */
  showToggle?: boolean;
}
```

#### 使用示例

```tsx
// 登录表单
<AuthForm
  type="login"
  onSuccess={(user) => {
    console.log('登录成功:', user);
    router.push('/dashboard');
  }}
  onError={(error) => {
    toast.error(error);
  }}
/>

// 注册表单
<AuthForm
  type="register"
  onSuccess={(user) => {
    console.log('注册成功:', user);
    router.push('/verify-email');
  }}
  onError={(error) => {
    toast.error(error);
  }}
/>

// 密码重置表单
<AuthForm
  type="reset-password"
  onSuccess={() => {
    toast.success('重置邮件已发送');
  }}
  onError={(error) => {
    toast.error(error);
  }}
/>
```

### SocialLogin

第三方登录组件。

#### Props

```typescript
interface SocialLoginProps {
  /** 成功回调 */
  onSuccess?: (user: any) => void;
  /** 错误回调 */
  onError?: (error: string) => void;
  /** 显示的登录方式 */
  providers?: AuthProvider[];
  /** 自定义样式 */
  className?: string;
  /** 按钮布局 */
  layout?: 'vertical' | 'horizontal';
  /** 是否显示分割线 */
  showDivider?: boolean;
  /** 分割线文字 */
  dividerText?: string;
  /** 加载中 */
  loading?: boolean;
}
```

#### 使用示例

```tsx
<SocialLogin
  providers={[AuthProvider.GITHUB, AuthProvider.GOOGLE]}
  layout="vertical"
  onSuccess={(user) => {
    console.log('第三方登录成功:', user);
    router.push('/dashboard');
  }}
  onError={(error) => {
    toast.error(error);
  }}
/>
```

---

## Hook API

### useAuth

主要的认证 Hook，提供完整的认证功能。

#### 返回值

```typescript
{
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (email, password, rememberMe?) => Promise<Result>;
  register: (data) => Promise<Result>;
  socialLogin: (provider) => Promise<Result>;
  logout: () => Promise<Result>;
  sendEmailVerification: () => Promise<Result>;
  sendPasswordResetEmail: (email) => Promise<Result>;
  updatePassword: (currentPassword, newPassword) => Promise<Result>;
  updateProfile: (data) => Promise<Result>;
  refreshUser: () => Promise<void>;
}
```

#### 使用示例

```tsx
function LoginPage() {
  const { login, loading } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    const result = await login(email, password);
    
    if (result.success) {
      toast.success('登录成功');
      router.push('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(email, password);
    }}>
      {/* 登录表单 */}
    </form>
  );
}
```

### useAuthState

简化版认证 Hook，只返回状态。

```tsx
const { user, loading, isAuthenticated } = useAuthState();
```

### useCurrentUser

获取当前用户。

```tsx
const user = useCurrentUser();
if (user) {
  console.log('当前用户:', user.profile.username);
}
```

### useIsAuthenticated

检查是否已登录。

```tsx
const isAuthenticated = useIsAuthenticated();

if (!isAuthenticated) {
  router.push('/login');
}
```

### useUserRole

获取用户角色。

```tsx
const role = useUserRole();
console.log('用户角色:', role);
```

### useIsAdmin

检查是否是管理员。

```tsx
const isAdmin = useIsAdmin();

if (isAdmin) {
  // 显示管理员功能
}
```

---

## 服务 API

### AuthService

认证服务类，提供底层的认证功能。

#### 初始化配置

```typescript
import { AuthService } from '@/lib/supabase/auth';

AuthService.initialize({
  requireEmailVerification: true,
  enableSocialLogin: true,
  socialProviders: [AuthProvider.GITHUB, AuthProvider.GOOGLE],
  sessionDuration: 7,
  rememberMeDuration: 30,
});
```

#### 用户注册

```typescript
const result = await AuthService.register({
  email: 'user@example.com',
  password: 'Password123',
  confirmPassword: 'Password123',
  username: 'testuser',
  displayName: 'Test User',
  agreeTerms: true,
});

if (result.success) {
  console.log('注册成功:', result.user);
  console.log('消息:', result.message);
} else {
  console.error('注册失败:', result.error);
}
```

#### 用户登录

```typescript
const result = await AuthService.login({
  email: 'user@example.com',
  password: 'Password123',
  rememberMe: true,
});

if (result.success) {
  console.log('登录成功:', result.user);
} else {
  console.error('登录失败:', result.error);
}
```

#### 第三方登录

```typescript
const result = await AuthService.socialLogin(AuthProvider.GITHUB);

if (result.success) {
  console.log('正在跳转到 GitHub...');
} else {
  console.error('登录失败:', result.error);
}
```

#### 用户登出

```typescript
await AuthService.logout();
```

#### 获取当前用户

```typescript
const user = await AuthService.getCurrentUser();
if (user) {
  console.log('当前用户:', user.profile.username);
}
```

#### 发送邮箱验证

```typescript
const result = await AuthService.sendEmailVerification();

if (result.success) {
  console.log('验证邮件已发送');
} else {
  console.error('发送失败:', result.message);
}
```

#### 发送密码重置邮件

```typescript
const result = await AuthService.sendPasswordResetEmail('user@example.com');

if (result.success) {
  console.log('重置邮件已发送');
} else {
  console.error('发送失败:', result.message);
}
```

#### 更新密码

```typescript
const result = await AuthService.updatePassword({
  currentPassword: 'OldPassword123',
  newPassword: 'NewPassword123',
  confirmPassword: 'NewPassword123',
});

if (result.success) {
  console.log('密码更新成功');
} else {
  console.error('更新失败:', result.error);
}
```

#### 更新用户资料

```typescript
const result = await AuthService.updateProfile({
  username: 'newusername',
  displayName: 'New Display Name',
  bio: '我的简介',
  location: '北京',
  website: 'https://example.com',
  avatar: avatarFile,
});

if (result.success) {
  console.log('资料更新成功:', result.user);
} else {
  console.error('更新失败:', result.error);
}
```

#### 订阅认证状态变化

```typescript
const unsubscribe = AuthService.onAuthStateChange((event, session) => {
  console.log('认证事件:', event);
  console.log('会话:', session);
});

// 取消订阅
unsubscribe();
```

---

## 数据库表结构

### profiles 表（用户资料表）

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  provider TEXT DEFAULT 'email',
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 字段说明

- `id` - 用户ID（关联 auth.users）
- `email` - 邮箱
- `username` - 用户名（唯一）
- `display_name` - 显示名称
- `avatar` - 头像URL
- `bio` - 个人简介
- `location` - 所在地区
- `website` - 个人网站
- `role` - 角色（admin/moderator/user/guest）
- `status` - 状态（active/inactive/suspended/banned）
- `provider` - 登录方式（email/github/google）
- `last_login_at` - 最后登录时间
- `created_at` - 创建时间
- `updated_at` - 更新时间

---

## 使用场景

### 1. 登录页面

```tsx
import { AuthForm, SocialLogin } from '@/components/auth';

function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="login-container">
      <AuthForm
        type="login"
        onSuccess={(user) => {
          router.push('/dashboard');
        }}
      />
      
      <SocialLogin
        layout="vertical"
        onSuccess={(user) => {
          router.push('/dashboard');
        }}
      />
    </div>
  );
}
```

### 2. 注册页面

```tsx
function RegisterPage() {
  return (
    <div className="register-container">
      <AuthForm
        type="register"
        onSuccess={(user) => {
          router.push('/verify-email');
        }}
      />
      
      <SocialLogin
        layout="vertical"
        dividerText="或使用以下方式快速注册"
        onSuccess={(user) => {
          router.push('/dashboard');
        }}
      />
    </div>
  );
}
```

### 3. 密码重置页面

```tsx
function ResetPasswordPage() {
  return (
    <div className="reset-password-container">
      <AuthForm
        type="reset-password"
        onSuccess={() => {
          toast.success('重置邮件已发送');
          router.push('/login');
        }}
      />
    </div>
  );
}
```

### 4. 受保护的路由

```tsx
import { useIsAuthenticated } from '@/hooks/use-auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

### 5. 用户资料页面

```tsx
function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const handleUpdateProfile = async (data: any) => {
    const result = await updateProfile(data);
    
    if (result.success) {
      toast.success('资料更新成功');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div>
      <h1>用户资料</h1>
      {/* 显示和编辑用户资料 */}
    </div>
  );
}
```

---

## 最佳实践

### 1. 错误处理

```tsx
const { login } = useAuth();

const handleSubmit = async (email: string, password: string) => {
  try {
    const result = await login(email, password);
    
    if (result.success) {
      toast.success('登录成功');
      router.push('/dashboard');
    } else {
      toast.error(result.error || '登录失败');
    }
  } catch (error) {
    console.error('登录错误:', error);
    toast.error('发生未知错误，请稍后重试');
  }
};
```

### 2. 加载状态

```tsx
function Page() {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <Dashboard />;
}
```

### 3. 记住登录状态

```tsx
<AuthForm
  type="login"
  onSuccess={(user) => {
    // 用户已勾选"记住我"，会话将持续30天
    router.push('/dashboard');
  }}
/>
```

### 4. 邮箱验证提醒

```tsx
function Dashboard() {
  const { user, sendEmailVerification } = useAuth();

  useEffect(() => {
    if (user && !user.profile.emailVerified) {
      toast.info('请验证您的邮箱');
    }
  }, [user]);

  const handleResendVerification = async () => {
    const result = await sendEmailVerification();
    if (result.success) {
      toast.success('验证邮件已发送');
    }
  };

  return (
    <div>
      {!user?.profile.emailVerified && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p>您的邮箱尚未验证</p>
          <button onClick={handleResendVerification}>
            重新发送验证邮件
          </button>
        </div>
      )}
    </div>
  );
}
```

### 5. 密码强度提示

```tsx
function RegisterForm() {
  const [password, setPassword] = useState('');

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="password-strength">
        <div
          className={`strength-bar level-${strength}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">
        {password.length === 0 && '请输入密码'}
        {strength === 1 && '密码强度：弱'}
        {strength === 2 && '密码强度：中'}
        {strength === 3 && '密码强度：较强'}
        {strength >= 4 && '密码强度：强'}
      </p>
    </div>
  );
}
```

---

## 总结

用户认证系统提供：

✅ **邮箱登录** - 支持邮箱和密码登录
✅ **用户注册** - 邮箱注册，可选用户名
✅ **第三方登录** - GitHub、Google 一键登录
✅ **邮箱验证** - 可选启用邮箱验证
✅ **密码重置** - 发送重置邮件
✅ **记住登录** - 支持7天/30天
✅ **用户管理** - 完整的用户资料管理
✅ **头像上传** - 支持头像上传
✅ **角色权限** - 管理员、版主、普通用户
✅ **实时状态** - 实时监听认证状态变化
✅ **会话管理** - 自动刷新会话
✅ **类型安全** - 完整 TypeScript 支持
✅ **响应式设计** - 适配各种设备
✅ **表单验证** - 完整的表单验证

完善的用户认证系统，安全可靠！
