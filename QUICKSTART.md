# PC Builder Studio 快速部署指南

本指南将帮助你在 5 分钟内完成 PC Builder Studio 的部署。

## 前置要求

- Node.js 18.x
- Docker（可选）
- Supabase 账户

## 快速开始

### 1. 获取代码

```bash
git clone <repository-url>
cd pc-builder-studio
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.production

# 编辑配置文件
vim .env.production
```

**必需配置：**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 4. Docker 部署

#### 使用 Docker Compose（推荐）

```bash
# 开发环境
docker-compose up -d

# 生产环境（需要配置 SSL）
docker-compose --profile production up -d
```

#### 使用部署脚本

```bash
# 赋予执行权限
chmod +x scripts/deploy.sh

# 完整部署
./scripts/deploy.sh full
```

### 5. 验证部署

```bash
# 检查健康状态
curl http://localhost:3000/health

# 查看日志
docker logs -f pc-builder-studio
```

## 生产环境部署

### 1. 准备工作

- 购买域名
- 配置 DNS 解析
- 准备 SSL 证书（Let's Encrypt 免费证书）

### 2. 配置文件

编辑 `.env.production`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

编辑 `nginx.conf`，替换 `your-domain.com` 为实际域名。

### 3. 部署

```bash
# 配置 SSL 证书
mkdir -p ssl
# 将 fullchain.pem 和 privkey.pem 放在 ssl/ 目录

# 启动生产环境
docker-compose --profile production up -d
```

### 4. 配置 CI/CD

在 GitHub 仓库设置中添加 Secrets：

- `DEPLOY_HOST`: 服务器地址
- `DEPLOY_USER`: 服务器用户名
- `DEPLOY_KEY`: SSH 私钥

推送代码到 `production` 分支触发自动部署。

## 监控

访问性能监控页面：

```
https://your-domain.com/performance
```

查看实时性能指标和系统状态。

## 常见问题

### Q: 如何获取 Supabase 密钥？

1. 访问 https://supabase.com/dashboard
2. 创建项目
3. 进入 Settings > API
4. 复制 URL 和 anon key

### Q: 如何配置 SSL 证书？

```bash
# 使用 Let's Encrypt
certbot certonly --webroot -w /var/www/certbot -d your-domain.com

# 复制证书
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/
```

### Q: 如何查看日志？

```bash
# Docker 日志
docker logs -f pc-builder-studio

# Nginx 日志
docker logs -f pc-builder-nginx

# 应用日志目录
ls -la logs/
```

### Q: 如何更新应用？

```bash
# 拉取最新代码
git pull origin main

# 重新部署
./scripts/deploy.sh full
```

## 需要帮助？

- 查看完整文档：[DEPLOYMENT.md](./DEPLOYMENT.md)
- GitHub Issues: [问题反馈](https://github.com/your-org/pc-builder-studio/issues)
- 技术支持：support@your-domain.com

## 下一步

- 配置 Google Analytics
- 设置 Sentry 错误监控
- 启用 Redis 缓存
- 配置自动备份

---

祝部署顺利！🚀
