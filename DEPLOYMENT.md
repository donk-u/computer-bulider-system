# PC Builder Studio 部署文档

## 目录

1. [环境准备](#环境准备)
2. [环境变量配置](#环境变量配置)
3. [本地部署](#本地部署)
4. [Docker 部署](#docker-部署)
5. [生产环境部署](#生产环境部署)
6. [CI/CD 配置](#cicd-配置)
7. [监控和维护](#监控和维护)
8. [故障排查](#故障排查)

---

## 环境准备

### 系统要求

- Node.js 18.x 或更高版本
- Docker 20.x 或更高版本
- Docker Compose 2.x 或更高版本
- Nginx（生产环境）
- 域名和 SSL 证书（生产环境）

### 安装依赖

```bash
# 克隆仓库
git clone <repository-url>
cd pc-builder-studio

# 安装 Node 依赖
npm install
```

---

## 环境变量配置

### 1. 复制环境变量模板

```bash
cp .env.example .env.production
```

### 2. 配置必需的环境变量

编辑 `.env.production` 文件，填写以下必需变量：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 站点 URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 3. 获取 Supabase 凭据

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建或选择项目
3. 进入 Settings > API
4. 复制 Project URL 和 anon public key

### 4. 可选配置

根据需要配置以下可选变量：

- Google Analytics: `NEXT_PUBLIC_GA_ID`
- Sentry: `NEXT_PUBLIC_SENTRY_DSN`
- Redis: `REDIS_URL`
- OAuth: GitHub/Google OAuth 配置
- 支付: Stripe 配置

---

## 本地部署

### 1. 开发环境运行

```bash
# 创建环境变量
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 2. 运行数据库迁移

```bash
# 使用 Supabase CLI
supabase db push

# 或手动执行 SQL 文件
supabase db execute --file supabase/migrations/create-performance-indexes.sql
```

---

## Docker 部署

### 1. 使用 Docker Compose

#### 开发环境（包含数据库）

```bash
# 启动所有服务
docker-compose --profile dev up -d

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down
```

#### 生产环境（包含 Nginx）

```bash
# 配置 SSL 证书
mkdir -p ssl
# 将 SSL 证书放在 ssl/ 目录

# 启动生产环境
docker-compose --profile production up -d
```

### 2. 使用 Docker 命令

#### 构建镜像

```bash
docker build -t pc-builder-studio:latest .
```

#### 运行容器

```bash
docker run -d \
  --name pc-builder-studio \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.production \
  pc-builder-studio:latest
```

#### 查看日志

```bash
docker logs -f pc-builder-studio
```

#### 停止容器

```bash
docker stop pc-builder-studio
docker rm pc-builder-studio
```

---

## 生产环境部署

### 方案一：使用部署脚本

```bash
# 赋予脚本执行权限
chmod +x scripts/deploy.sh

# 完整部署
./scripts/deploy.sh full

# 仅构建
./scripts/deploy.sh build

# 仅 Docker 部署
./scripts/deploy.sh docker
```

### 方案二：使用 Docker Compose

```bash
# 1. 配置环境变量
cp .env.example .env.production
vim .env.production

# 2. 配置 Nginx
vim nginx.conf
# 替换 your-domain.com 为实际域名

# 3. 配置 SSL 证书
mkdir -p ssl
# 放置 fullchain.pem 和 privkey.pem

# 4. 启动服务
docker-compose --profile production up -d

# 5. 检查状态
docker-compose ps
docker-compose logs -f
```

### 方案三：使用 CI/CD

参考 [CI/CD 配置](#cicd-配置) 章节。

---

## CI/CD 配置

### GitHub Actions 配置

项目已配置 GitHub Actions 工作流，位于 `.github/workflows/deploy.yml`。

#### 配置 Secrets

在 GitHub 仓库中添加以下 Secrets：

1. **部署相关**
   - `DEPLOY_HOST`: 服务器地址
   - `DEPLOY_USER`: 服务器用户名
   - `DEPLOY_KEY`: SSH 私钥

2. **环境变量**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`

3. **通知（可选）**
   - `SLACK_WEBHOOK`: Slack Webhook URL

4. **性能测试**
   - `PRODUCTION_URL`: 生产环境 URL

#### 工作流说明

- **test**: 代码检查和测试
- **build**: 构建 Docker 镜像
- **deploy**: 部署到生产环境（仅 production 分支）
- **preview**: 部署到预览环境（仅 Pull Request）
- **lighthouse**: 性能测试
- **security**: 安全扫描

---

## 监控和维护

### 1. 健康检查

```bash
# 应用健康检查
curl http://localhost:3000/health

# Docker 容器状态
docker ps
docker stats
```

### 2. 日志管理

```bash
# 应用日志
docker logs -f pc-builder-studio

# Nginx 日志
docker logs -f pc-builder-nginx

# 查看特定时间的日志
docker logs --since 2024-01-01T00:00:00 pc-builder-studio
```

### 3. 性能监控

访问性能监控页面：

```
https://your-domain.com/performance
```

查看实时性能指标和 Web Vitals。

### 4. 数据库维护

```bash
# 定期刷新物化视图
# 连接到 Supabase 数据库并执行：
SELECT refresh_hot_builds();
SELECT refresh_hot_posts();
SELECT refresh_popular_users();

# 更新统计信息
ANALYZE builds;
ANALYZE posts;
ANALYZE comments;
```

### 5. 备份

- **数据库备份**: Supabase 自动提供备份
- **配置文件备份**: 定期备份 `.env.production`
- **SSL 证书备份**: 备份 `ssl/` 目录

---

## 故障排查

### 常见问题

#### 1. 容器启动失败

```bash
# 查看日志
docker logs pc-builder-studio

# 检查环境变量
docker inspect pc-builder-studio | grep Env

# 重新构建
docker-compose build --no-cache app
```

#### 2. 数据库连接失败

- 检查 Supabase URL 和密钥是否正确
- 验证网络连接
- 检查 Supabase 项目状态

#### 3. 性能问题

- 检查性能监控页面
- 运行数据库索引优化
- 清理 Docker 缓存：`docker system prune -a`

#### 4. SSL 证书问题

```bash
# 使用 Let's Encrypt 获取证书
certbot certonly --webroot -w /var/www/certbot -d your-domain.com

# 复制证书到 ssl 目录
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/
```

#### 5. 内存不足

```bash
# 限制容器内存
docker update --memory="2g" --memory-swap="2g" pc-builder-studio

# 或在 docker-compose.yml 中配置
services:
  app:
    mem_limit: 2g
    memswap_limit: 2g
```

### 日志级别

根据需要调整日志级别：

```env
# .env.production
LOG_LEVEL=debug  # debug, info, warn, error
```

---

## 更新部署

### 1. 更新应用

```bash
# 拉取最新代码
git pull origin main

# 更新依赖
npm install

# 重新部署
./scripts/deploy.sh full
```

### 2. 零停机部署（使用 Docker）

```bash
# 构建新镜像
docker build -t pc-builder-studio:new .

# 启动新容器
docker run -d --name pc-builder-new \
  -p 3001:3000 --env-file .env.production \
  pc-builder-studio:new

# 健康检查后切换端口
# 更新 Nginx 配置指向新端口
docker restart pc-builder-nginx

# 停止旧容器
docker stop pc-builder-studio
docker rm pc-builder-studio
docker rename pc-builder-new pc-builder-studio
```

### 3. 回滚

```bash
# 使用部署脚本
./scripts/deploy.sh

# 或 Docker 回滚
docker stop pc-builder-studio
docker start pc-builder-studio-backup
```

---

## 最佳实践

1. **定期更新**: 保持依赖包更新，定期运行 `npm audit fix`
2. **监控告警**: 设置 Sentry 或其他错误监控
3. **性能优化**: 定期运行 Lighthouse CI 检查性能
4. **安全扫描**: 定期运行安全扫描工具
5. **备份**: 定期备份重要数据和配置
6. **文档**: 保持部署文档和配置文件同步

---

## 支持

如有问题，请：

1. 查看日志文件
2. 访问性能监控页面
3. 检查 GitHub Issues
4. 联系技术支持团队

---

## 许可证

MIT License
