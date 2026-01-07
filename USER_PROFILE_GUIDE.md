# 用户资料页面使用指南

完整的用户资料页面系统，支持封面/头像上传、基本资料编辑和统计数据展示。

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [数据库设置](#数据库设置)
- [组件API](#组件api)
- [服务API](#服务api)
- [使用场景](#使用场景)
- [最佳实践](#最佳实践)

---

## 功能特性

### 1. 用户资料页面

- ✅ **封面图片** - 可上传自定义封面（最大10MB）
- ✅ **头像** - 可上传自定义头像（最大5MB）
- ✅ **基本信息** - 用户名、显示名、简介、位置、网站
- ✅ **统计数据** - 配置数、获赞数、收藏数、粉丝、关注
- ✅ **编辑模式** - 当前用户可以编辑自己的资料
- ✅ **实时预览** - 上传图片时实时预览
- ✅ **删除功能** - 可以删除头像和封面

### 2. 图片上传

- ✅ **头像上传** - 支持JPG/PNG/GIF等格式
- ✅ **封面上传** - 支持大图上传
- ✅ **文件验证** - 自动验证文件类型和大小
- ✅ **实时预览** - 上传前实时预览
- ✅ **加载状态** - 上传中显示加载动画
- ✅ **错误处理** - 完整的错误提示

### 3. 统计数据

- ✅ **配置统计** - 发布的配置数量
- ✅ **点赞统计** - 获得的点赞数量
- ✅ **收藏统计** - 被收藏的配置数量
- ✅ **粉丝统计** - 关注者数量
- ✅ **关注统计** - 正在关注的用户数量

---

## 快速开始

### 1. 创建数据库表

**方案1：首次创建（推荐）**

如果 profiles 表不存在，运行安全创建脚本：

```sql
-- 安全创建用户资料表（不会删除现有数据）
supabase/migrations/safe-create-profiles-table.sql

-- 创建用户关注表
supabase/migrations/create-user-follows-table.sql
```

**方案2：更新现有表**

如果 profiles 表已存在，运行更新脚本：

```sql
-- 更新现有用户资料表（添加缺失字段）
supabase/migrations/update-profiles-table.sql
```

**方案3：检查表状态**

如果不确定表的状态，先运行检查脚本：

```sql
-- 检查 profiles 表的状态
supabase/migrations/check-profiles-table.sql
```

这会显示：
- 表是否存在
- 表结构
- 索引
- RLS 策略
- 触发器
- 依赖关系
- 数据数量

### 2. 配置存储桶

运行存储桶和策略脚本：

```sql
-- 创建存储桶
supabase/migrations/create-storage-buckets.sql

-- 创建存储策略
supabase/migrations/create-storage-policies.sql
```

### 3. 访问用户资料页面

```
http://localhost:3000/profile/[username]
```

例如：
```
http://localhost:3000/profile/john
```

---

## 数据库设置

### profiles 表（用户资料表）

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_image TEXT,
  location TEXT,
  website TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);
```

### 字段说明

- `id` - 用户ID（关联 auth.users）
- `username` - 用户名（唯一）
- `display_name` - 显示名称
- `bio` - 个人简介
- `avatar_url` - 头像URL
- `cover_image` - 封面图片URL
- `location` - 位置
- `website` - 网站链接
- `phone` - 电话号码
- `created_at` - 创建时间
- `updated_at` - 更新时间
- `last_login_at` - 最后登录时间

### user_follows 表（用户关注表）

```sql
CREATE TABLE user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);
```

### RLS 策略

**profiles 表**：
- ✅ 公开可读
- ✅ 用户可以更新自己的资料
- ✅ 用户可以插入自己的资料

**user_follows 表**：
- ✅ 公开可读
- ✅ 用户可以管理自己的关注

---

## 组件API

### ProfileAvatarUpload

头像上传组件。

#### Props

```typescript
interface ProfileAvatarUploadProps {
  avatar?: string;              // 当前头像URL
  username?: string;            // 用户名
  displayName?: string;         // 显示名称
  editable?: boolean;           // 是否可编辑
  onUpload?: (url: string) => void;      // 上传成功回调
  onUploadStart?: () => void;   // 上传开始回调
  onUploadEnd?: () => void;     // 上传结束回调
}
```

#### 使用示例

```tsx
import { ProfileAvatarUpload } from '@/components/profile';

<ProfileAvatarUpload
  avatar={user.avatar}
  username={user.username}
  displayName={user.displayName}
  editable={isCurrentUser}
  onUpload={(url) => {
    console.log('头像已上传:', url);
    updateUser({ avatar: url });
  }}
/>
```

### ProfileCoverUpload

封面上传组件。

#### Props

```typescript
interface ProfileCoverUploadProps {
  coverImage?: string;          // 当前封面URL
  editable?: boolean;           // 是否可编辑
  onUpload?: (url: string) => void;      // 上传成功回调
  onUploadStart?: () => void;   // 上传开始回调
  onUploadEnd?: () => void;     // 上传结束回调
}
```

#### 使用示例

```tsx
import { ProfileCoverUpload } from '@/components/profile';

<ProfileCoverUpload
  coverImage={user.coverImage}
  editable={isCurrentUser}
  onUpload={(url) => {
    console.log('封面已上传:', url);
    updateUser({ coverImage: url });
  }}
/>
```

### ProfileStats

统计数据组件。

#### Props

```typescript
interface ProfileStatsProps {
  stats?: UserStats;            // 用户统计数据
  showFollowers?: boolean;      // 是否显示粉丝数
  showFollowing?: boolean;     // 是否显示关注数
  className?: string;           // 自定义样式
}
```

#### 使用示例

```tsx
import { ProfileStats } from '@/components/profile';

<ProfileStats
  stats={user.stats}
  showFollowers={true}
  showFollowing={true}
  className="mt-4"
/>
```

---

## 服务API

### UserProfileService

用户资料服务类。

#### 获取用户资料

```typescript
const { data, error } = await UserProfileService.getProfile('username');

if (data) {
  console.log('用户名:', data.username);
  console.log('显示名:', data.displayName);
  console.log('统计:', data.stats);
}
```

#### 获取当前用户资料

```typescript
const { data, error } = await UserProfileService.getCurrentProfile();

if (data) {
  console.log('当前用户:', data.username);
}
```

#### 更新用户资料

```typescript
const { success, error } = await UserProfileService.updateProfile(
  userId,
  {
    displayName: '新显示名',
    bio: '新简介',
    location: '北京',
    website: 'https://example.com',
  }
);
```

#### 上传头像

```typescript
const file = event.target.files[0];
const { url, error } = await UserProfileService.uploadAvatar(userId, file);

if (url) {
  console.log('头像URL:', url);
}
```

#### 上传封面

```typescript
const file = event.target.files[0];
const { url, error } = await UserProfileService.uploadCoverImage(userId, file);

if (url) {
  console.log('封面URL:', url);
}
```

#### 删除头像

```typescript
const { success, error } = await UserProfileService.deleteAvatar(avatarUrl);
```

#### 删除封面

```typescript
const { success, error } = await UserProfileService.deleteCoverImage(coverImageUrl);
```

#### 获取用户统计

```typescript
const stats = await UserProfileService.getUserStats(userId);

console.log('配置数:', stats.configCount);
console.log('获赞数:', stats.likesCount);
console.log('收藏数:', stats.favoritesCount);
console.log('粉丝数:', stats.followersCount);
console.log('关注数:', stats.followingCount);
```

---

## 使用场景

### 1. 用户资料页面

```tsx
// app/profile/[username]/page.tsx
import { ProfileAvatarUpload, ProfileCoverUpload, ProfileStats } from '@/components/profile';
import { UserProfileService } from '@/lib/supabase/user-profile';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, [params.username]);

  const loadProfile = async () => {
    const { data } = await UserProfileService.getProfile(params.username);
    setProfile(data);
  };

  return (
    <div>
      <ProfileCoverUpload
        coverImage={profile?.coverImage}
        editable={isCurrentUser}
        onUpload={(url) => setProfile({ ...profile!, coverImage: url })}
      />

      <div className="flex gap-4 -mt-16">
        <ProfileAvatarUpload
          avatar={profile?.avatar}
          username={profile?.username}
          displayName={profile?.displayName}
          editable={isCurrentUser}
          onUpload={(url) => setProfile({ ...profile!, avatar: url })}
        />

        <div>
          <h1>{profile?.displayName}</h1>
          <p>@{profile?.username}</p>
          <p>{profile?.bio}</p>
        </div>
      </div>

      <ProfileStats stats={profile?.stats} />
    </div>
  );
}
```

### 2. 编辑用户资料

```tsx
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState<ProfileFormData>({
  displayName: '',
  bio: '',
  location: '',
  website: '',
});

const handleSave = async () => {
  const { success, error } = await UserProfileService.updateProfile(
    userId,
    formData
  );

  if (success) {
    await loadProfile();
    setIsEditing(false);
  }
};

return (
  <div>
    {isEditing ? (
      <div>
        <Input
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
        />
        <Textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
        <Button onClick={handleSave}>保存</Button>
      </div>
    ) : (
      <Button onClick={() => setIsEditing(true)}>编辑资料</Button>
    )}
  </div>
);
```

### 3. 上传头像

```tsx
const handleAvatarUpload = (url: string) => {
  setProfile({ ...profile, avatar: url });
  showToast('头像上传成功');
};

<ProfileAvatarUpload
  avatar={profile.avatar}
  username={profile.username}
  displayName={profile.displayName}
  editable={isCurrentUser}
  onUpload={handleAvatarUpload}
/>
```

---

## 最佳实践

### 1. 图片大小限制

- 头像：最大 5MB
- 封面：最大 10MB

### 2. 图片格式

支持：JPG、PNG、GIF

### 3. 实时预览

上传图片前先创建预览，提升用户体验：

```tsx
const reader = new FileReader();
reader.onload = (e) => {
  setPreview(e.target?.result as string);
};
reader.readAsDataURL(file);
```

### 4. 错误处理

完善的错误处理和用户提示：

```tsx
try {
  const result = await UserProfileService.uploadAvatar(userId, file);

  if (result.error) {
    throw new Error(result.error);
  }

  // 上传成功
} catch (error) {
  console.error('上传失败:', error);
  showToast('上传失败，请重试');
}
```

### 5. 权限控制

确保只有当前用户可以编辑自己的资料：

```tsx
const isCurrentUser = userId === currentUser.id;

<ProfileAvatarUpload
  editable={isCurrentUser}
  // ...
/>
```

---

## 总结

用户资料页面系统提供：

✅ **封面上传** - 可上传自定义封面（最大10MB）
✅ **头像上传** - 可上传自定义头像（最大5MB）
✅ **基本资料** - 用户名、显示名、简介、位置、网站
✅ **统计数据** - 配置数、获赞数、收藏数、粉丝、关注
✅ **编辑模式** - 当前用户可以编辑自己的资料
✅ **实时预览** - 上传图片时实时预览
✅ **删除功能** - 可以删除头像和封面
✅ **完整类型** - 完整的 TypeScript 类型定义
✅ **响应式设计** - 适配各种设备
✅ **错误处理** - 完整的错误提示
✅ **加载状态** - 上传中显示加载动画
✅ **权限控制** - 确保用户只能编辑自己的资料

完整的用户资料页面系统！
