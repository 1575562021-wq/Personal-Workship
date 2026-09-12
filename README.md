# 个人作品集 · Portfolio

> Figma 风格的产品经理/设计师个人作品集网站。
> 纯静态 + 数据驱动，零构建工具，可直接部署到 GitHub Pages。

## ✨ 特性

- 🎨 **Figma 风格设计** — 黑/白/灰 + 紫蓝粉渐变 + 点阵网格
- 📦 **数据驱动** — 所有内容从 `data/*.json` 读取
- 🚀 **零构建** — 纯 HTML + CSS + 原生 JS，可直接打开
- 🇨🇳 **国内友好** — 通过云存储 + Cloudflare CDN 加速
- 📱 **响应式** — 移动端 375px → 桌面 1280px+
- 🖼️ **相册轮播** — Swiper.js 实现 8 张图轮播 + 缩略图 + 灯箱
- 🎬 **视频嵌入** — B 站/YouTube iframe
- 📄 **文档预览** — Google Docs Viewer / Office Online
- 📊 **PPT 浏览** — reveal.js 渲染

## 📁 目录结构

```
portfolio/
├── index.html                     # 首页
├── works.html                     # 作品列表
├── works/{slug}.html              # 作品详情（6 个）
├── articles.html                  # 文章列表
├── articles/{slug}.html           # 文章详情（4 个 + 模板）
├── albums.html                    # 相册列表（按标签分组）
├── albums/{slug}.html             # 相册详情（3 个 + 模板，含轮播）
├── videos.html                    # 视频列表（轮播 + 网格）
├── documents.html                 # 文档列表
├── presentations.html             # PPT 列表
├── presentations/{slug}.html      # PPT 详情（reveal.js）
├── about.html                     # 关于我
├── add-new.html                   # 添加新作品教程
│
├── assets/
│   ├── css/                       # 设计 token、基础、组件、布局、动效、页面
│   ├── js/                        # data、carousel、filter、nav、main
│   └── images/                    # 占位图（SVG）+ 头像 + 微信二维码
│
├── data/                          # JSON 数据
│   ├── site.json                  # 个人信息
│   ├── works.json                 # 作品
│   ├── articles.json              # 文章
│   ├── albums.json                # 相册
│   ├── videos.json                # 视频
│   ├── documents.json             # 文档
│   └── presentations.json         # PPT
│
├── README.md                      # 本文件
├── DEPLOY.md                      # 部署指南
├── UPLOAD-GUIDE.md                # 文件上传规范
└── .nojekyll                      # GitHub Pages 配置
```

## 🚀 本地预览

由于使用 `fetch()` 加载 JSON，**必须用 HTTP 服务器预览**，不能直接双击 HTML。

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code
安装 Live Server 插件，右键 index.html → Open with Live Server
```

打开 http://localhost:8000

## 🔧 替换个人信息

编辑 `data/site.json`：

```json
{
  "name": "你的真实姓名",
  "tagline": "你的定位标语",
  "school": "XX 大学 · XX 专业",
  "email": "your@email.com",
  "github": "https://github.com/yourname",
  "linkedin": "https://linkedin.com/in/yourname",
  "twitter": "https://twitter.com/yourname",
  "zhihu": "https://www.zhihu.com/people/yourname",
  "wechat_id": "your-wechat-id"
}
```

替换 `assets/images/avatar.svg` 为真实头像（建议 200x200 的 WebP）。
替换 `assets/images/wechat-qr.svg` 为真实微信二维码图片。

## ➕ 添加新内容

### 添加作品
1. 把作品封面图放到 `assets/images/works/{id}/cover.jpg`
2. 在 `data/works.json` 添加新条目
3. 复制 `works/{id}.html` 模板（任意一个），修改 `id` 和 `title`

### 添加文章
1. 在 `data/articles.json` 添加条目
2. 复制 `articles/article-template.html`，重命名

### 添加相册
1. 把 8 张照片放到 `assets/images/albums/{id}/01.jpg ~ 08.jpg`
2. 在 `data/albums.json` 添加条目
3. 复制 `albums/album-template.html`，修改

### 添加视频
1. 上传视频到 B 站，获取 `bvid`（如 `BV1xx411c7mD`）
2. 在 `data/videos.json` 添加条目，填写 `embed_url`

### 添加文档
1. 上传 PDF/Word 到云存储（七牛云/又拍云）
2. 在 `data/documents.json` 添加条目，填写 `url` 和 `preview_url`

详细步骤见 [add-new.html](add-new.html)。

## 🎨 设计 Token 摘要

```css
/* 主色 */
--c-figma-purple: #A259FF;
--c-figma-pink:   #FF7262;
--c-figma-blue:   #1ABCFE;

/* 渐变 */
--g-figma: linear-gradient(135deg, #A259FF 0%, #FF7262 50%, #1ABCFE 100%);

/* 中性色 */
--c-black:     #000000;
--c-charcoal:  #0D0D0D;
--c-slate:     #6B6B6B;
--c-mist:      #D4D4D4;
--c-line:      #E5E5E5;
--c-paper:     #F7F7F7;
--c-white:     #FFFFFF;
```

## 📦 技术栈

- HTML5 / CSS3 / 原生 JavaScript ES6+
- Swiper.js 11 (CDN) — 轮播图
- reveal.js 4.5 (CDN) — PPT
- Inter (Google Fonts) — 字体
- 0 个构建工具

## 📚 文档

- [DEPLOY.md](DEPLOY.md) — 部署到 GitHub Pages
- [UPLOAD-GUIDE.md](UPLOAD-GUIDE.md) — 文件上传与云存储配置

## 📄 License

MIT — 自由使用、修改、分发。
