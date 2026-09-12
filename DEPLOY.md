# 部署指南 · DEPLOY

将本作品集部署到 **GitHub Pages** ，并配置国内访问加速。

## 方案 A：GitHub Pages（推荐）

### 1. 准备 GitHub 仓库

1. 登录 GitHub，创建一个新仓库（如 `personal-workship`）
2. 仓库设为 **Public**
3. **不要** 勾选 "Add a README"（本地已有）

### 2. 推送代码

```bash
# 进入项目目录
cd portfolio

# 初始化 git
git init
git add .
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/personal-workship.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

> 如果仓库已有文件，先 `git pull --rebase origin main`。

### 3. 启用 GitHub Pages

1. 进入 GitHub 仓库页面
2. **Settings** → **Pages**
3. **Source**: 选择 `Deploy from a branch`
4. **Branch**: 选择 `main` + `/ (root)`
5. 点击 **Save**

等待 1-2 分钟，访问：

```
https://YOUR_USERNAME.github.io/personal-workship/
```

### 4. 自定义域名（可选）

#### 4.1 购买域名

推荐国内：
- 阿里云万网
- 腾讯云 DNSPod
- Cloudflare Registrar

#### 4.2 配置 DNS

在域名服务商添加：

- **CNAME 记录**：
  - 主机记录：`@`
  - 记录类型：`CNAME`
  - 记录值：`YOUR_USERNAME.github.io`

- **CNAME 记录**（子域名 www）：
  - 主机记录：`www`
  - 记录类型：`CNAME`
  - 记录值：`YOUR_USERNAME.github.io`

#### 4.3 在 GitHub 启用

仓库 → **Settings** → **Pages** → **Custom domain**：
- 填入你的域名（如 `yourname.com`）
- 勾选 **Enforce HTTPS**（稍等证书生成）

## 方案 B：国内访问加速

GitHub Pages 在国内访问较慢。推荐以下加速方案：

### B1. Cloudflare CDN（免费，最简单）

1. 注册 [Cloudflare](https://cloudflare.com)
2. 添加你的自定义域名
3. 把域名的 NS 记录改为 Cloudflare
4. 在 Cloudflare 开启 **代理**（橙色云朵）
5. 在 Cloudflare 配置 GitHub Pages：
   - **DNS** → 添加 CNAME 记录指向 `YOUR_USERNAME.github.io`
   - 代理状态：**已代理**（橙色）
   - **SSL/TLS** → 设置为 **Full**
6. 等待 DNS 生效（10-30 分钟）

优点：免费、自动 HTTPS、全球加速。

### B2. Vercel（推荐，国内访问好）

1. 注册 [Vercel](https://vercel.com)（用 GitHub 账号登录）
2. **Import Project** → 选择你的 GitHub 仓库
3. 配置：
   - **Framework Preset**: `Other`
   - **Build Command**: 留空
   - **Output Directory**: `./`
4. 点击 **Deploy**

部署完成后访问 `https://your-project.vercel.app`。

Vercel 国内访问速度一般，但比 GitHub Pages 快。

### B3. Netlify（备选）

类似 Vercel，注册 [Netlify](https://netlify.com) 后导入仓库即可。

### B4. 国内云 + 自定义 CDN（最稳定）

适用场景：作品集包含大量图片/视频，需要国内极速访问。

#### 阿里云 OSS + CDN

1. 开通 [阿里云 OSS](https://oss.aliyun.com)，创建 Bucket
2. 开启 **静态网站托管**
3. 上传整个 `portfolio/` 目录
4. 在 [阿里云 CDN](https://cdn.aliyun.com) 添加加速域名
5. 配置 OSS 作为源站

#### 腾讯云 COS + CDN

类似阿里云，[腾讯云 COS](https://cloud.tencent.com/product/cos) + [CDN](https://cloud.tencent.com/product/cdn)。

#### 七牛云（适合中小型）

[七牛云](https://www.qiniu.com)：
- 每月 10GB 免费存储
- 每月 10GB 免费 CDN 流量
- 自带图片处理（WebP 转换、缩略图）

#### 又拍云

[又拍云](https://www.upyun.com)：
- 每月 15GB 免费存储
- 每月 15GB 免费 CDN 流量

## 方案 C：国内镜像（最简单）

把构建后的静态文件传到国内云存储，用云存储的 URL 访问。

### 七牛云镜像

1. 注册七牛云，实名认证
2. 创建存储空间（Bucket）
3. 上传 `portfolio/` 目录
4. 绑定自定义域名（可选，需要已备案）
5. 用七牛提供的测试域名访问

测试域名格式：`http://your-bucket.qiniucs.com/`

### 使用 UPYUN（又拍云）

类似七牛，每月免费额度大。

## 推荐组合

| 用途 | 推荐方案 |
| --- | --- |
| 个人展示 / Demo | GitHub Pages + Cloudflare |
| 国内访问优化 | Vercel/Netlify + Cloudflare |
| 大型项目 / 含视频 | 七牛云 + 阿里云 CDN |
| 完全备案 + 自定义域名 | 阿里云 OSS + CDN + 已备案域名 |

## 持续部署

### GitHub Pages 自动部署

每次 push 到 main 分支，GitHub Pages 自动重新部署（1-2 分钟）。

### Vercel/Netlify 自动部署

类似 GitHub Pages，push 后自动部署。

## 常见问题

### Q: 推送后页面没更新？
A: 等待 1-2 分钟，强制刷新（Ctrl+Shift+R）清除缓存。

### Q: 国内访问慢？
A: 使用方案 B 中推荐的 CDN 加速。

### Q: 微信二维码显示不出来？
A: 确保图片路径正确，建议用 `https://` 开头的绝对路径。

### Q: B 站视频嵌入失败？
A: 检查 `bvid` 是否正确，格式如 `BV1xx411c7mD`。

### Q: PDF 预览打不开？
A: 用 Google Docs Viewer：`https://docs.google.com/viewer?url=YOUR_PDF_URL&embedded=true`
需要 PDF 文件可公开访问。
