# 微信小程序认证系统使用指南

完整的微信小程序认证系统，基于微信开放平台和 Supabase 实现。

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [配置微信小程序](#配置微信小程序)
- [Hook API](#hook-api)
- [服务 API](#服务-api)
- [数据库表结构](#数据库表结构)
- [使用场景](#使用场景)
- [最佳实践](#最佳实践)

---

## 功能特性

### 1. 微信登录

- ✅ **一键登录** - 使用微信账号快速登录
- ✅ **用户信息** - 获取昵称、头像、地区等
- ✅ **手机号** - 支持获取手机号（需授权）
- ✅ **自动登录** - 支持自动登录
- ✅ **Session 管理** - 自动管理 session 过期

### 2. 用户管理

- ✅ **用户资料** - 完整的用户信息
- ✅ **OpenID/UnionID** - 支持 OpenID 和 UnionID
- ✅ **角色权限** - 管理员、版主、普通用户
- ✅ **用户状态** - 活跃、未激活、暂停、封禁
- ✅ **最后登录** - 记录最后登录时间

### 3. 数据存储

- ✅ **Supabase 集成** - 使用 Supabase 存储用户数据
- ✅ **本地存储** - 微信小程序本地存储
- ✅ **自动同步** - 自动同步用户数据

---

## 快速开始

### 1. 配置微信小程序

在微信小程序后台：

1. 登录 [微信小程序后台](https://mp.weixin.qq.com)
2. 开通登录功能
3. 获取 AppID 和 AppSecret

### 2. 环境变量

```env
# .env.local
NEXT_PUBLIC_WEIXIN_APPID=your-weixin-appid
```

### 3. 创建数据库表

选择以下脚本之一执行：

**方案1：全新安装（推荐）**
```sql
-- 文件：supabase/migrations/setup-weixin-users-table.sql
-- 这会删除旧表并重新创建
-- 适用于首次安装或需要完全重置
```

**方案2：修复现有表**
```sql
-- 文件：supabase/migrations/fix-weixin-users-table.sql
-- 这会保留现有数据，只修复策略
-- 适用于表已存在但有策略错误
```

**方案3：快速测试**
```sql
-- 文件：supabase/migrations/minimal-weixin-users.sql
-- 最小化表结构，用于快速测试
-- 不推荐用于生产环境
```

**执行步骤**：
1. 打开 Supabase Dashboard
2. 进入 **SQL Editor**
3. 选择对应的脚本
4. 点击 **Run** 执行

### 4. 配置认证服务

```typescript
// lib/weixin/weixin-auth.ts
import { WeixinAuthService } from '@/lib/weixin/weixin-auth';

WeixinAuthService.initialize({
  appId: 'your-weixin-appid',
  appSecret: 'your-weixin-secret', // 仅后端使用
  sessionDuration: 7,  // 7天
  autoLogin: true,
});
```

### 5. 使用登录按钮

```tsx
import { WeixinLoginButton } from '@/components/weixin';

function LoginPage() {
  return (
    <div className="login-container">
      <WeixinLoginButton
        text="微信登录"
        requestUserInfo={true}
        onSuccess={(user, isNewUser) => {
          console.log('登录成功:', user);
          console.log('是否新用户:', isNewUser);
          
          // 跳转到首页
          wx.navigateTo({ url: '/pages/index/index' });
        }}
        onError={(error) => {
          console.error('登录失败:', error);
          wx.showToast({
            title: error,
            icon: 'none',
          });
        }}
      />
    </div>
  );
}
```

---

## Hook API

### useWeixinAuth

主要的微信认证 Hook，提供完整的认证功能。

#### 返回值

```typescript
{
  user: WeixinUser | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (options?) => Promise<Result>;
  logout: () => Promise<Result>;
  getUserInfo: () => Promise<WeixinUserInfo | null>;
  getPhoneNumber: (code) => Promise<WeixinPhoneNumberInfo | null>;
  refreshSession: () => Promise<string | null>;
  refreshUser: () => Promise<void>;
}
```

#### 使用示例

```tsx
import { useWeixinAuth } from '@/hooks/use-weixin-auth';

function LoginPage() {
  const { login, loading } = useWeixinAuth();

  const handleLogin = async () => {
    const result = await login({ requestUserInfo: true });
    
    if (result.success) {
      wx.showToast({
        title: '登录成功',
        icon: 'success',
      });
      
      // 跳转到首页
      wx.switchTab({ url: '/pages/index/index' });
    } else {
      wx.showToast({
        title: result.error || '登录失败',
        icon: 'none',
      });
    }
  };

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? '登录中...' : '微信登录'}
    </button>
  );
}
```

### useWeixinAuthState

简化版认证 Hook，只返回状态。

```tsx
const { user, loading, isAuthenticated } = useWeixinAuthState();
```

### useWeixinUser

获取当前微信用户。

```tsx
const user = useWeixinUser();
if (user) {
  console.log('当前用户:', user.nickName);
}
```

### useIsWeixinAuthenticated

检查是否已登录。

```tsx
const isAuthenticated = useIsWeixinAuthenticated();

if (!isAuthenticated) {
  wx.navigateTo({ url: '/pages/login/login' });
}
```

### useWeixinUserRole

获取用户角色。

```tsx
const role = useWeixinUserRole();
console.log('用户角色:', role);
```

### useIsWeixinAdmin

检查是否是管理员。

```tsx
const isAdmin = useIsWeixinAdmin();

if (isAdmin) {
  // 显示管理员功能
}
```

---

## 服务 API

### WeixinAuthService

微信认证服务类，提供底层的认证功能。

#### 初始化配置

```typescript
import { WeixinAuthService } from '@/lib/weixin/weixin-auth';

WeixinAuthService.initialize({
  appId: 'your-weixin-appid',
  appSecret: 'your-weixin-secret',
  sessionDuration: 7,
  autoLogin: true,
});
```

#### 微信登录

```typescript
// 获取微信登录 code
const { code } = await wx.login();

// 获取用户信息（可选）
const userInfo = await WeixinAuthService.getUserInfo();

// 执行登录
const result = await WeixinAuthService.login({
  code,
  userInfo,
});

if (result.success) {
  console.log('登录成功:', result.user);
  console.log('是否新用户:', result.isNewUser);
}
```

#### 登出

```typescript
await WeixinAuthService.logout();
```

#### 检查登录状态

```typescript
const status = await WeixinAuthService.checkLoginStatus();

if (status.isLoggedIn) {
  console.log('当前用户:', status.user);
}
```

#### 获取用户信息

```typescript
const userInfo = await WeixinAuthService.getUserInfo();

if (userInfo) {
  console.log('昵称:', userInfo.nickName);
  console.log('头像:', userInfo.avatarUrl);
}
```

#### 获取手机号

```typescript
// 1. 用户授权获取手机号
<button
  open-type="getPhoneNumber"
  onGetPhoneNumber={async (e) => {
    if (e.detail.code) {
      // 2. 解密手机号
      const phoneInfo = await WeixinAuthService.getPhoneNumber(e.detail.code);
      
      if (phoneInfo) {
        console.log('手机号:', phoneInfo.phoneNumber);
      }
    }
  }}
>
  获取手机号
</button>
```

#### 刷新 Session

```typescript
const session = await WeixinAuthService.refreshSession();

if (session) {
  console.log('Session 已刷新');
}
```

---

## 数据库表结构

### weixin_users 表（微信用户表）

```sql
CREATE TABLE IF NOT EXISTS weixin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  openid TEXT UNIQUE NOT NULL,           -- 微信 openid
  unionid TEXT UNIQUE,                   -- 微信 unionid（需要开放平台）
  nick_name TEXT,                        -- 昵称
  avatar_url TEXT,                       -- 头像URL
  gender INTEGER CHECK (gender IN (0, 1, 2)), -- 性别：0-未知，1-男，2-女
  province TEXT,                         -- 省份
  city TEXT,                            -- 城市
  country TEXT,                          -- 国家
  language TEXT,                         -- 语言
  phone TEXT,                            -- 手机号
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user', 'guest')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'banned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);
```

### 字段说明

- `id` - 用户ID（UUID）
- `openid` - 微信 OpenID（唯一）
- `unionid` - 微信 UnionID（需要开放平台，唯一）
- `nick_name` - 昵称
- `avatar_url` - 头像URL
- `gender` - 性别（0-未知，1-男，2-女）
- `province` - 省份
- `city` - 城市
- `country` - 国家
- `language` - 语言
- `phone` - 手机号
- `role` - 角色（admin/moderator/user/guest）
- `status` - 状态（active/inactive/suspended/banned）
- `created_at` - 创建时间
- `updated_at` - 更新时间
- `last_login_at` - 最后登录时间

---

## 使用场景

### 1. 登录页面

```tsx
import { WeixinLoginButton } from '@/components/weixin';

Page({
  handleLoginSuccess(user, isNewUser) {
    if (isNewUser) {
      // 新用户，跳转到引导页
      wx.redirectTo({ url: '/pages/guide/guide' });
    } else {
      // 老用户，跳转到首页
      wx.switchTab({ url: '/pages/index/index' });
    }
  },
  
  handleLoginError(error) {
    wx.showToast({
      title: error,
      icon: 'none',
    });
  },
  
  render() {
    return (
      <view className="login-page">
        <image
          src="/assets/logo.png"
          className="logo"
        />
        
        <WeixinLoginButton
          text="微信一键登录"
          requestUserInfo={true}
          onSuccess={this.handleLoginSuccess}
          onError={this.handleLoginError}
        />
      </view>
    );
  },
});
```

### 2. 用户中心

```tsx
import { WeixinUserCard, WeixinAvatar } from '@/components/weixin';
import { useWeixinAuth } from '@/hooks/use-weixin-auth';

Page({
  data: {
    user: null,
  },
  
  onLoad() {
    const { user } = useWeixinAuth();
    this.setData({ user: user() });
  },
  
  render() {
    const { user } = this.data;
    
    return (
      <view className="user-center">
        {user ? (
          <WeixinUserCard user={user} />
        ) : (
          <view>请先登录</view>
        )}
      </view>
    );
  },
});
```

### 3. 获取手机号

```tsx
import { useWeixinAuth } from '@/hooks/use-weixin-auth';

Page({
  data: {
    phoneNumber: '',
  },
  
  onLoad() {
    const { getPhoneNumber } = useWeixinAuth();
    this.getPhoneNumber = getPhoneNumber;
  },
  
  async handleGetPhoneNumber(e) {
    if (e.detail.code) {
      const phoneInfo = await this.getPhoneNumber(e.detail.code);
      
      if (phoneInfo) {
        this.setData({ phoneNumber: phoneInfo.phoneNumber });
        
        wx.showToast({
          title: '获取成功',
          icon: 'success',
        });
      } else {
        wx.showToast({
          title: '获取失败',
          icon: 'none',
        });
      }
    }
  },
  
  render() {
    const { phoneNumber } = this.data;
    
    return (
      <view className="phone-page">
        <button
          open-type="getPhoneNumber"
          onGetPhoneNumber={this.handleGetPhoneNumber}
        >
          {phoneNumber ? phoneNumber : '获取手机号'}
        </button>
      </view>
    );
  },
});
```

### 4. 受保护的页面

```tsx
import { useIsWeixinAuthenticated } from '@/hooks/use-weixin-auth';

Page({
  onLoad() {
    const isAuthenticated = useIsWeixinAuthenticated();
    
    if (!isAuthenticated()) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    
    // 继续加载页面数据
  },
});
```

---

## 最佳实践

### 1. 自动登录

```typescript
// app.ts
import { WeixinAuthService } from '@/lib/weixin/weixin-auth';

App({
  onLaunch() {
    // 检查是否已登录
    WeixinAuthService.checkLoginStatus().then((status) => {
      if (!status.isLoggedIn && WeixinAuthService.config.autoLogin) {
        // 自动登录
        const { code } = wx.login();
        WeixinAuthService.login({ code });
      }
    });
  },
});
```

### 2. Session 过期处理

```typescript
// 检查 session 是否过期
const session = wx.getStorageSync('session');
const expires = wx.getStorageSync('session_expires');

if (!session || expires < Date.now()) {
  // Session 过期，重新登录
  const { code } = wx.login();
  WeixinAuthService.login({ code });
}
```

### 3. 错误处理

```typescript
const { login } = useWeixinAuth();

try {
  const result = await login({ requestUserInfo: true });
  
  if (result.success) {
    // 登录成功
  } else {
    // 登录失败
    wx.showToast({
      title: result.error || '登录失败',
      icon: 'none',
    });
  }
} catch (error) {
  console.error('登录错误:', error);
  wx.showToast({
    title: '发生未知错误',
    icon: 'none',
  });
}
```

### 4. 用户信息更新

```typescript
// 当用户信息更新时，同步到数据库
const userInfo = await WeixinAuthService.getUserInfo();

if (userInfo) {
  await supabase
    .from('weixin_users')
    .update({
      nick_name: userInfo.nickName,
      avatar_url: userInfo.avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('openid', currentUser.openid);
}
```

---

## 总结

微信小程序认证系统提供：

✅ **一键登录** - 使用微信账号快速登录
✅ **用户信息** - 获取昵称、头像、地区等
✅ **手机号** - 支持获取手机号（需授权）
✅ **OpenID/UnionID** - 支持 OpenID 和 UnionID
✅ **自动登录** - 支持自动登录
✅ **Session 管理** - 自动管理 session 过期
✅ **用户管理** - 完整的用户信息管理
✅ **角色权限** - 管理员、版主、普通用户
✅ **Supabase 集成** - 使用 Supabase 存储用户数据
✅ **本地存储** - 微信小程序本地存储
✅ **完整 Hook** - useWeixinAuth + 多个简化 Hook
✅ **组件支持** - 登录按钮、头像、用户卡片
✅ **类型安全** - 完整 TypeScript 支持

专为微信小程序设计的认证系统，简洁高效！
