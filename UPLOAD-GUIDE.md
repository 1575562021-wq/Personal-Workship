# 文件上传指南 · UPLOAD GUIDE

把作品/文章/相册/视频/文档/PPT 所需的素材上传到云存储，然后在 JSON 中引用 URL。

## 目录

- [文件命名规范](#文件命名规范)
- [图片压缩](#图片压缩)
- [七牛云配置](#七牛云配置)
- [又拍云配置](#又拍云配置)
- [阿里云 OSS 配置](#阿里云-oss-配置)
- [视频上传到 B 站](#视频上传到-b-站)
- [JSON 中引用文件](#json-中引用文件)
- [提交到 GitHub](#提交到-github)

## 文件命名规范

### 推荐格式

- **小写字母 + 数字 + 连字符**（kebab-case）
- ❌ `My Project/截图 1.JPG`
- ✅ `my-project/cover-01.jpg`

### 推荐目录结构

```
assets/images/
├── avatar.svg / avatar.jpg           # 头像
├── wechat-qr.png / wechat-qr.jpg     # 微信二维码
├── works/
│   └── {work-id}/
│       ├── cover.jpg                 # 作品封面（800x500）
│       ├── 01.jpg                    # 作品内配图
│       └── 02.jpg
├── articles/
│   └── {article-id}/
│       └── cover.jpg                 # 文章封面（1200x630）
├── albums/
│   └── {album-id}/
│       ├── cover.jpg                 # 相册封面
│       ├── 01.jpg                    # 8 张照片
│       ├── 02.jpg
│       └── ...
└── videos/
    └── {video-id}/
        └── cover.jpg                 # 视频封面（1280x720）
```

## 图片压缩

### 推荐工具

- **Squoosh**（网页版）：https://squoosh.app
- **TinyPNG**（在线）：https://tinypng.com
- **ImageOptim**（Mac）：https://imageoptim.com
- **Squoosh CLI**（批处理）

### 推荐规格

| 用途 | 尺寸 | 格式 | 大小 |
| --- | --- | --- | --- |
| 头像 | 200x200 | WebP/JPG | < 50KB |
| 作品封面 | 800x500 | WebP | < 200KB |
| 文章封面 | 1200x630 | WebP | < 300KB |
| 相册照片 | 1600x1067 | WebP/JPG | < 500KB |
| 视频封面 | 1280x720 | WebP | < 200KB |

### 转换 WebP 命令

```bash
# macOS (需要 cwebp)
for f in *.jpg; do cwebp -q 80 "$f" -o "${f%.jpg}.webp"; done

# 使用 Squoosh CLI
npm install -g @squoosh/cli
squoosh-cli --webp '{"quality":80}' -d ./output *.jpg
```

## 七牛云配置

七牛云是国内最快的对象存储之一，每月 10GB 免费。

### 1. 注册认证

1. 访问 https://www.qiniu.com 注册
2. 完成实名认证（必须，否则无法使用）

### 2. 创建存储空间

1. 进入 **对象存储** 控制台
2. 点击 **新建存储空间**
3. 填写：
   - 名称：`yourname-portfolio`
   - 区域：华东（推荐）/ 华南 / 华北
   - 访问控制：**公开空间**
4. 创建成功后会得到一个测试域名

### 3. 上传文件

#### 方式 A：Web 控制台

1. 在空间列表点击进入
2. 点击 **上传** 按钮
3. 拖拽文件或选择文件
4. 等待上传完成

#### 方式 B：命令行工具

```bash
# 安装 qshell
# macOS
brew install qiniu/qiniu/qshell

# 配置
qshell account <AK> <SK> <Name>

# 上传
qshell rput yourname-portfolio works/cover-1.jpg ./cover-1.jpg
```

#### 方式 C：图形化客户端

- macOS: [QBox](https://developer.qiniu.com/kodo/tools/5972/kodo-browser)
- Windows: 同上

### 4. 获取文件 URL

上传后文件的 URL 格式：

```
http://yourname-portfolio.qiniucs.com/works/cover-1.jpg
```

（`qiniucs.com` 是七牛提供的测试域名，每月有流量限制）

### 5. 绑定自定义域名（推荐）

1. 在空间设置 → **域名绑定**
2. 添加加速域名（如 `cdn.yourname.com`）
3. 在域名服务商添加 CNAME 记录：
   - 主机记录：`cdn`
   - 记录类型：`CNAME`
   - 记录值：七牛提供的加速域名
4. 等待 DNS 生效

### 6. 启用 HTTPS

七牛自动支持 HTTPS，直接用 `https://` 即可。

## 又拍云配置

又拍云每月 15GB 免费，CDN 加速好。

### 1. 注册

访问 https://www.upyun.com 注册并实名。

### 2. 创建服务

1. 进入 **云存储** 控制台
2. 创建服务：`yourname-portfolio`
3. 选择 **文件存储** + 启用 **CDN 加速**

### 3. 上传文件

#### Web 控制台

直接拖拽上传。

#### 命令行

使用 `upyun-cli`：

```bash
npm install -g upyun-cli
upyun-cli login
upyun-cli upload /path/to/file /remote/path
```

### 4. URL 格式

```
http://yourname-portfolio.b0.upaiyun.com/works/cover-1.jpg
```

### 5. 绑定域名

类似七牛，在控制台添加加速域名。

## 阿里云 OSS 配置

适合需要大量存储 + 全球加速的场景。

### 1. 开通

1. 访问 https://oss.aliyun.com
2. 创建 Bucket：
   - 名称：`yourname-portfolio`
   - 区域：华东 1（杭州）
   - 读写权限：**公共读**

### 2. 上传文件

#### Web 控制台

直接上传。

#### 命令行 ossutil

```bash
# 安装
brew install aliyun-cli  # macOS

# 配置
aliyun oss config --host oss-cn-hangzhou.aliyuncs.com --access-key-id <AK> --access-key-secret <SK>

# 上传
aliyun oss cp ./cover-1.jpg oss://yourname-portfolio/works/cover-1.jpg
```

### 3. URL 格式

```
https://yourname-portfolio.oss-cn-hangzhou.aliyuncs.com/works/cover-1.jpg
```

### 4. 绑定 CDN

1. 开通阿里云 CDN
2. 添加加速域名
3. 源站选择 OSS Bucket
4. 配置 CNAME

## 视频上传到 B 站

### 1. 注册 B 站账号

访问 https://member.bilibili.com 完成实名。

### 2. 上传视频

1. 进入创作者中心：https://member.bilibili.com/v2#/upload/video
2. 上传视频文件
3. 填写标题、简介、标签、封面
4. 提交审核（通常 1-2 小时）

### 3. 获取嵌入代码

上传成功后，访问视频页面，URL 格式：

```
https://www.bilibili.com/video/BV1xx411c7mD
```

其中 `BV1xx411c7mD` 就是 `bvid`。

### 4. 在 JSON 中使用

```json
{
  "id": "my-video",
  "title": "视频标题",
  "platform": "bilibili",
  "embed_url": "//player.bilibili.com/player.html?bvid=BV1xx411c7mD&autoplay=0",
  "youtube_url": "https://www.youtube.com/embed/XXX"
}
```

> 注意：`embed_url` 用 `//` 开头，自动适配 http/https。

### 5. 同时上传 YouTube（可选）

如果想覆盖海外用户，把视频也上传到 YouTube。

YouTube 嵌入 URL 格式：

```
https://www.youtube.com/embed/VIDEO_ID
```

`VIDEO_ID` 在 YouTube 视频 URL 中：

```
https://www.youtube.com/watch?v=VIDEO_ID
```

## JSON 中引用文件

引用云存储上的文件：

```json
{
  "cover": "https://cdn.yourname.com/works/cover-1.webp",
  "photos": [
    { "src": "https://cdn.yourname.com/albums/iceland/01.webp", "caption": "图 1" },
    ...
  ]
}
```

引用本地文件（占位图）：

```json
{
  "cover": "assets/images/works/cover-1.svg"
}
```

## 提交到 GitHub

### 完整流程

```bash
# 1. 进入项目
cd portfolio

# 2. 检查状态
git status

# 3. 添加变更
git add .

# 4. 提交
git commit -m "添加新作品: product-redesign"

# 5. 推送到 GitHub
git push origin main
```

### 第一次推送

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/personal-workship.git
git push -u origin main
```

### 推送时输入凭据

- **Username**: 你的 GitHub 用户名
- **Password**: Personal Access Token（不是密码！）

#### 创建 Personal Access Token

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token**
3. 勾选 `repo` 权限
4. 生成后**立即保存**（只显示一次）

## 配置文件模板

参考 `UPLOAD-CONFIG.example.json`：

```json
{
  "cdn_domain": "https://cdn.yourname.com",
  "image_base": "https://cdn.yourname.com/images",
  "video_base": "https://cdn.yourname.com/videos",
  "doc_base": "https://cdn.yourname.com/docs",
  "image_format": "webp",
  "max_image_size_kb": 500
}
```

## 常见问题

### Q: GitHub Pages 国内访问慢怎么办？
A: 使用 Cloudflare CDN（免费）或国内云存储（七牛、又拍、阿里云 OSS）。

### Q: 视频文件太大，能直接传 GitHub 吗？
A: ❌ 不要。GitHub 限制单文件 100MB。用 B 站/YouTube 嵌入。

### Q: 图片可以传 GitHub 吗？
A: ✅ 可以，但仓库总大小建议 < 1GB。最好用云存储。

### Q: CDN 流量用完了怎么办？
A: 七牛/又拍云免费额度用完后按量付费；或者切到 Cloudflare（无限流量免费）。

### Q: 文件名包含中文会出问题吗？
A: 会。建议用英文 + 数字 + 连字符。
