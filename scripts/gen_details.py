#!/usr/bin/env python3
"""Generate detail pages for works, articles, albums from data/*.json + a shared template."""
import json
import os

ROOT = "/workspace/portfolio"
DATA = f"{ROOT}/data"

def head(title):
    return '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>' + title + ' · 个人作品集</title>\n\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">\n\n  <link rel="stylesheet" href="../assets/css/tokens.css" />\n  <link rel="stylesheet" href="../assets/css/base.css" />\n  <link rel="stylesheet" href="../assets/css/components.css" />\n  <link rel="stylesheet" href="../assets/css/layout.css" />\n  <link rel="stylesheet" href="../assets/css/animations.css" />\n  <link rel="stylesheet" href="../assets/css/pages.css" />\n  <link rel="icon" type="image/svg+xml" href="../assets/images/avatar.svg" />\n</head>'

NAV = '''  <nav class="top-nav">
    <div class="container">
      <a class="brand" href="../index.html">
        <span class="brand-mark"></span>
        <span data-site-brand>@yourname</span>
      </a>
      <div class="nav-links">
        <a href="../works.html">作品</a>
        <a href="../articles.html">文章</a>
        <a href="../albums.html">相册</a>
        <a href="../videos.html">视频</a>
        <a href="../documents.html">文档</a>
        <a href="../presentations.html">PPT</a>
        <a href="../about.html">关于</a>
      </div>
      <button class="nav-toggle" aria-label="菜单">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>
    </div>
  </nav>'''

FOOTER = '''  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom" style="border-top: 0; padding-top: 0;">
        <span>© 2024 <span data-site-brand>@yourname</span>.</span>
        <span><a href="../index.html">返回首页</a></span>
      </div>
    </div>
  </footer>'''

SCRIPTS_BASE = '''  <script src="../assets/js/data.js"></script>
  <script src="../assets/js/nav.js"></script>
  <script src="../assets/js/filter.js"></script>
  <script src="../assets/js/carousel.js"></script>
  <script src="../assets/js/main.js"></script>
</body>
</html>'''

SCRIPTS_ALBUM = '''  <script src="../assets/js/data.js"></script>
  <script src="../assets/js/nav.js"></script>
  <script src="../assets/js/filter.js"></script>
  <script src="../assets/js/carousel.js"></script>
  <script src="../assets/js/main.js"></script>
</body>
</html>'''

def tag_palette(t):
    palette = ["purple", "pink", "blue", "mint", "yellow", "dark"]
    h = sum(ord(c) for c in t)
    return palette[abs(h) % len(palette)]

def tags_html(tags):
    return " ".join('<span class="tag tag-' + tag_palette(t) + '">' + t + '</span>' for t in (tags or []))

def works_content(w, is_template=False):
    title = "作品详情模板" if is_template else w["title"]
    subtitle = w.get("subtitle", "")
    cover = w.get("cover", "assets/images/works/cover-1.svg")
    tags = w.get("tags", [])
    date = w.get("date", "")
    summary = w.get("summary", "")
    subtitle_html = '<p class="subtitle">' + subtitle + '</p>' if subtitle else ""
    summary_html = '<p style="font-size: 17px; line-height: 1.7;">' + summary + '</p>' if summary else ""
    return '''
  <section class="detail-page">
    <div class="container container-narrow">

      <a class="back" href="../works.html">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回作品列表
      </a>

      <div class="detail-header">
        <h1>''' + title + '''</h1>
        ''' + subtitle_html + '''

        <div class="detail-meta">
          ''' + tags_html(tags) + '''
          <span class="dot"></span>
          <span>''' + date + '''</span>
          <span class="dot"></span>
          <span>''' + w.get('category', 'product') + '''</span>
        </div>
      </div>

      <div class="detail-cover">
        <img src="../''' + cover + '''" alt="''' + title + '''" />
      </div>

      <article class="detail-content">
        ''' + summary_html + '''

        <h2>📌 项目背景</h2>
        <p>这里是项目背景描述。说明为什么要做这个项目、目标用户是谁、核心问题是什么。</p>

        <div class="callout">
          <strong>核心指标：</strong> 7 日留存 ↑28%，任务完成时长 ↓42%，NPS ↑15 分。
        </div>

        <h2>🔍 用户研究</h2>
        <p>介绍你做的用户研究：访谈多少人、用了什么方法、发现了什么洞察。</p>
        <ul>
          <li>研究方法 1：用户访谈</li>
          <li>研究方法 2：问卷调研</li>
          <li>研究方法 3：可用性测试</li>
        </ul>

        <h2>💡 核心洞察</h2>
        <blockquote>把最关键的发现写成一句话。</blockquote>
        <p>围绕这个洞察展开分析，解释为什么重要、它如何影响后续的产品决策。</p>

        <h2>🎨 方案设计</h2>
        <p>介绍你设计的解决方案。可以分阶段说明：</p>
        <ol>
          <li><strong>第一阶段：</strong>解决的问题、具体设计</li>
          <li><strong>第二阶段：</strong>解决的问题、具体设计</li>
          <li><strong>第三阶段：</strong>解决的问题、具体设计</li>
        </ol>

        <h2>📊 实验与数据</h2>
        <p>用真实数据展示效果。比如 A/B 测试结果、关键指标变化、用户反馈。</p>

        <h2>🎓 复盘与思考</h2>
        <p>这次项目最大的收获是什么？踩过哪些坑？如果重新做一次，会怎么改进？</p>
        <p>完整复盘文章见 <a href="../articles.html">文章列表</a>。</p>
      </article>

      <div style="margin-top: 64px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a class="btn btn-primary" href="#">
          查看原型
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </a>
        <a class="btn btn-secondary" href="../documents.html">查看完整报告</a>
        <a class="btn btn-ghost" href="../works.html">← 返回作品列表</a>
      </div>
    </div>
  </section>'''

def article_content(a, is_template=False):
    title = "文章模板" if is_template else a["title"]
    subtitle = a.get("subtitle", "")
    cover = a.get("cover", "assets/images/articles/cover-1.svg")
    tags = a.get("tags", [])
    date = a.get("date", "")
    read_time = a.get("read_time", "10 分钟阅读")
    author = a.get("author", "你的名字")
    excerpt = a.get("excerpt", "")
    subtitle_html = '<p class="subtitle">' + subtitle + '</p>' if subtitle else ""
    excerpt_html = '<p style="font-size: 17px; line-height: 1.7; color: var(--t-secondary);">' + excerpt + '</p>' if excerpt else ""
    return '''
  <section class="detail-page">
    <div class="container container-narrow">

      <a class="back" href="../articles.html">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回文章列表
      </a>

      <div class="detail-header">
        <h1>''' + title + '''</h1>
        ''' + subtitle_html + '''

        <div class="detail-meta">
          ''' + tags_html(tags) + '''
          <span class="dot"></span>
          <span>''' + date + '''</span>
          <span class="dot"></span>
          <span>''' + read_time + '''</span>
          <span class="dot"></span>
          <span>''' + author + '''</span>
        </div>
      </div>

      <div class="detail-cover">
        <img src="../''' + cover + '''" alt="''' + title + '''" />
      </div>

      <article class="detail-content">
        ''' + excerpt_html + '''

        <h2>引言</h2>
        <p>在文章开头简要说明要讨论的问题、为什么重要、你打算怎么切入。</p>

        <h2>第一部分：背景与动机</h2>
        <p>铺垫必要的背景知识。可以引用数据、案例、研究。</p>
        <blockquote>关键的洞察用引用块展示，视觉上更突出。</blockquote>

        <h2>第二部分：方法论</h2>
        <p>详细描述你用的方法、流程、工具。可以分步骤说明：</p>
        <ol>
          <li><strong>步骤一：</strong>具体做什么、为什么</li>
          <li><strong>步骤二：</strong>具体做什么、为什么</li>
          <li><strong>步骤三：</strong>具体做什么、为什么</li>
        </ol>

        <h2>第三部分：案例与实践</h2>
        <p>用真实案例说明方法的应用。可以包含：</p>
        <ul>
          <li>项目背景与目标</li>
          <li>执行过程</li>
          <li>结果与反思</li>
        </ul>

        <div class="callout">
          <strong>💡 关键提示：</strong>重要的内容用 callout 框突出显示。
        </div>

        <h2>总结</h2>
        <p>总结要点、给读者的建议、延伸阅读。保持简洁。</p>

        <h2>参考资料</h2>
        <ul>
          <li>相关书籍 / 论文</li>
          <li>延伸阅读链接</li>
          <li>工具与模板下载</li>
        </ul>
      </article>

      <div style="margin-top: 64px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a class="btn btn-ghost" href="../articles.html">← 返回文章列表</a>
      </div>
    </div>
  </section>'''

def album_content(album, is_template=False):
    title = "相册详情模板" if is_template else album["title"]
    cover = album.get("cover", "assets/images/albums/iceland/cover.svg")
    tag = album.get("tag", "")
    date = album.get("date", "")
    desc = album.get("description", "")
    photos = album.get("photos", [])
    if is_template:
        photos = [{"src": "../assets/images/albums/iceland/0" + str(i) + ".svg", "caption": "示例图 " + str(i)} for i in range(1, 9)]
    if not photos:
        photos = [{"src": "../assets/images/albums/iceland/0" + str(i) + ".svg", "caption": "示例图 " + str(i)} for i in range(1, 9)]

    # Build slides HTML
    slides_parts = []
    for p in photos:
        src = p['src']
        caption = p.get('caption', '')
        slide = '''            <div class="swiper-slide">
              <img src="''' + src + '''" alt="''' + caption + '''" loading="lazy" onerror="this.outerHTML='<div style=\'width:100%;height:100%;background:linear-gradient(135deg,#FF7262,#A259FF);display:flex;align-items:center;justify-content:center;color:white;\'></div>'" />'''
        if caption:
            slide += '\n              <p class="caption">' + caption + '</p>'
        slide += '\n            </div>'
        slides_parts.append(slide)
    slides_html = "\n".join(slides_parts)

    # Build thumbs HTML
    thumbs_parts = []
    for i, p in enumerate(photos):
        src = p['src']
        caption = p.get('caption', '')
        active = "active" if i == 0 else ""
        thumb = '''          <div class="thumb ''' + active + '''" data-index="''' + str(i) + '''">
            <span class="index">''' + str(i+1) + '''</span>
            <img src="''' + src + '''" alt="''' + caption + '''" loading="lazy" onerror="this.outerHTML='<div style=\'width:100%;height:100%;background:linear-gradient(135deg,#FF7262,#A259FF);\'></div>'" />
          </div>'''
        thumbs_parts.append(thumb)
    thumbs_html = "\n".join(thumbs_parts)

    # Build photos JSON for inline JS
    photos_json = json.dumps([{'src': p['src'], 'caption': p.get('caption', '')} for p in photos], ensure_ascii=False)

    return '''
  <section class="detail-page">
    <div class="container container-wide">

      <a class="back" href="../albums.html">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回相册列表
      </a>

      <div class="detail-header">
        <h1 data-album-title>''' + title + '''</h1>
        <p class="subtitle" data-album-desc>''' + desc + '''</p>

        <div class="detail-meta">
          <span class="tag tag-blue" data-album-tag>''' + tag + '''</span>
          <span class="dot"></span>
          <span data-album-date>''' + date + '''</span>
          <span class="dot"></span>
          <span>''' + str(len(photos)) + ''' 张照片</span>
        </div>
      </div>

      <div class="album-swiper-wrap">
        <div class="swiper album-swiper" data-album-id="''' + album['id'] + '''">
          <div class="swiper-wrapper">
''' + slides_html + '''
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-pagination"></div>
        </div>
        <div class="album-thumbs">
''' + thumbs_html + '''
        </div>
      </div>

      <article class="detail-content">
        <h2>📷 拍摄故事</h2>
        <p>介绍这个相册背后的故事：什么时候拍的、用了什么设备、为什么喜欢这些照片。</p>

        <h2>📍 地点 / 背景</h2>
        <p>说明拍摄地点或场景背景。可以分阶段介绍旅行路线、每天的安排。</p>

        <h2>✨ 精选</h2>
        <p>挑几张最满意的作品说说为什么好、当时的心情、背后的故事。</p>

        <div class="callout">
          <strong>💡 提示：</strong>点击大图可以放大查看；用键盘 ← → 切换；点击下方缩略图直接跳转到对应图片。
        </div>
      </article>

      <div style="margin-top: 64px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a class="btn btn-ghost" href="../albums.html">← 返回相册列表</a>
      </div>
    </div>
  </section>

  <!-- Swiper -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  <script>
    // Init album swiper with photos from inline data
    document.addEventListener('DOMContentLoaded', function() {
      const photos = ''' + photos_json + ''';
      if (typeof Carousel !== 'undefined' && photos.length) {
        Carousel.initAlbumSwiper(photos);
      }
    });
  </script>'''

# === Generate works ===
works = json.load(open(f"{DATA}/works.json", encoding="utf-8"))["works"]
for w in works:
    if w["id"] == "product-redesign":
        continue  # already exists
    html = head(w["title"]) + '\n<body data-page="works">\n' + NAV + works_content(w) + FOOTER + SCRIPTS_BASE
    path = f"{ROOT}/works/{w['id']}.html"
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"  Wrote {path}")

# === Generate article-template ===
art_template = {"id": "article-template", "title": "文章模板", "subtitle": "克隆这个文件创建新文章", "cover": "assets/images/articles/cover-1.svg", "tags": ["方法论"], "date": "2024-12-01", "read_time": "10 分钟阅读", "author": "你的名字", "excerpt": "这是文章摘要，写在首页列表中显示。"}
html = head("文章模板") + '\n<body data-page="articles">\n' + NAV + article_content(art_template, is_template=True) + FOOTER + SCRIPTS_BASE
with open(f"{ROOT}/articles/article-template.html", "w", encoding="utf-8") as f:
    f.write(html)
print(f"  Wrote {ROOT}/articles/article-template.html")

# === Generate articles ===
articles = json.load(open(f"{DATA}/articles.json", encoding="utf-8"))["articles"]
for a in articles:
    html = head(a["title"]) + '\n<body data-page="articles">\n' + NAV + article_content(a) + FOOTER + SCRIPTS_BASE
    path = f"{ROOT}/articles/{a['id']}.html"
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"  Wrote {path}")

# === Generate album-template ===
alb_template = {"id": "album-template", "title": "相册详情模板", "tag": "示例", "date": "2024-12", "description": "克隆这个文件创建新相册。每个相册至少包含 8 张图。", "cover": "assets/images/albums/iceland/cover.svg", "photos": [{"src": "assets/images/albums/iceland/0" + str(i) + ".svg", "caption": "示例图 " + str(i)} for i in range(1, 9)]}
html = head("相册详情模板") + '\n<body data-page="albums-detail" data-album-id="album-template">\n' + NAV + album_content(alb_template, is_template=True) + FOOTER + SCRIPTS_ALBUM
with open(f"{ROOT}/albums/album-template.html", "w", encoding="utf-8") as f:
    f.write(html)
print(f"  Wrote {ROOT}/albums/album-template.html")

# === Generate albums ===
albums = json.load(open(f"{DATA}/albums.json", encoding="utf-8"))["albums"]
for al in albums:
    html = head(al["title"]) + '\n<body data-page="albums-detail" data-album-id="' + al["id"] + '">\n' + NAV + album_content(al) + FOOTER + SCRIPTS_ALBUM
    path = f"{ROOT}/albums/{al['id']}.html"
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"  Wrote {path}")

print("\nAll detail pages generated!")
