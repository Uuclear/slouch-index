# 部署指南

## 服务器环境准备

```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
sudo npm install -g pm2

# 安装 PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# 安装 Nginx
sudo apt-get install nginx
```

## 数据库设置

```bash
# 创建数据库
sudo -u postgres createdb slouch

# 创建用户
sudo -u postgres createuser slouch_user -P

# 授权
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE slouch TO slouch_user;"
```

## 项目部署

```bash
# 克隆代码
git clone <your-repo-url> /var/www/slouch
cd /var/www/slouch

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入实际值（DATABASE_URL, NEXTAUTH_SECRET 等）

# 数据库迁移
npx prisma migrate deploy

# 初始化种子数据
npm run prisma:seed

# 构建项目
npm run build

# 启动 PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 配置 Nginx
sudo cp nginx/slouch.conf /etc/nginx/sites-available/slouch
sudo ln -s /etc/nginx/sites-available/slouch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL 证书（Let's Encrypt）

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 更新部署

```bash
cd /var/www/slouch
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart slouch-blog
```
