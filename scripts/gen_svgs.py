#!/usr/bin/env python3
"""Generate placeholder SVG covers for works, articles, albums, videos, etc."""
import os

ROOT = "/workspace/portfolio/assets/images"

GRADIENTS = [
    ("purple-pink", "#A259FF", "#FF7262"),
    ("pink-blue", "#FF7262", "#1ABCFE"),
    ("blue-purple", "#1ABCFE", "#A259FF"),
    ("purple-blue", "#A259FF", "#1ABCFE"),
    ("orange-pink", "#F24E1E", "#FF7262"),
    ("mint-blue", "#0ACF83", "#1ABCFE"),
    ("purple-yellow", "#A259FF", "#FFCB05"),
    ("dark-purple", "#0D0D0D", "#A259FF"),
]

def grad(idn, c1, c2, x1=0, y1=0, x2=100, y2=100):
    return f'<linearGradient id="{idn}" x1="{x1}%" y1="{y1}%" x2="{x2}%" y2="{y2}%"><stop offset="0%" stop-color="{c1}"/><stop offset="100%" stop-color="{c2}"/></linearGradient>'

def cover_svg(label, sublabel="", gradient="purple-pink", w=800, h=500, show_label=True, dark=True):
    g = next((g for g in GRADIENTS if g[0] == gradient), GRADIENTS[0])
    text_color = "white" if dark else "#0D0D0D"
    label_block = ""
    if show_label:
        label_block = f'<text x="40" y="{h-60}" font-family="Inter, sans-serif" font-size="36" font-weight="700" fill="{text_color}" letter-spacing="-1">{label}</text>'
        if sublabel:
            label_block += f'<text x="40" y="{h-30}" font-family="Inter, sans-serif" font-size="18" fill="rgba(255,255,255,0.7)">{sublabel}</text>'
        label_block += f'<text x="{w-40}" y="{h-30}" font-family="Inter, sans-serif" font-size="14" fill="rgba(255,255,255,0.5)" text-anchor="end">PLACEHOLDER</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><defs>{grad("bg", g[1], g[2])}<pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="16" cy="16" r="1.5" fill="rgba(255,255,255,0.18)"/></pattern></defs><rect width="{w}" height="{h}" fill="url(#bg)"/><rect width="{w}" height="{h}" fill="url(#dots)"/>{label_block}</svg>'

def album_photo_svg(label, idx, gradient="purple-pink", w=1200, h=800, caption=""):
    g = next((g for g in GRADIENTS if g[0] == gradient), GRADIENTS[0])
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><defs>{grad("bg", g[1], g[2])}</defs><rect width="{w}" height="{h}" fill="url(#bg)"/><circle cx="{w*0.2:.0f}" cy="{h*0.3:.0f}" r="{min(w,h)*0.15:.0f}" fill="rgba(255,255,255,0.1)"/><circle cx="{w*0.8:.0f}" cy="{h*0.7:.0f}" r="{min(w,h)*0.2:.0f}" fill="rgba(255,255,255,0.08)"/><rect x="{w*0.5-50:.0f}" y="{h*0.4:.0f}" width="100" height="100" rx="20" fill="rgba(255,255,255,0.12)" transform="rotate(15 {w*0.5:.0f} {h*0.45:.0f})"/><text x="{w/2:.0f}" y="{h/2-20:.0f}" font-family="Inter, sans-serif" font-size="{min(w,h)//15}" font-weight="700" fill="white" text-anchor="middle" letter-spacing="-2">{label}</text>' + (f'<text x="{w/2:.0f}" y="{h/2+30:.0f}" font-family="Inter, sans-serif" font-size="{min(w,h)//30}" fill="rgba(255,255,255,0.85)" text-anchor="middle">{caption}</text>' if caption else "") + f'<text x="{w-30:.0f}" y="{h-20:.0f}" font-family="Inter, sans-serif" font-size="14" fill="rgba(255,255,255,0.4)" text-anchor="end">{idx}/8</text></svg>'

# === Works covers ===
works = [
    ("cover-1", "B 端产品体验升级", "从用户研究到落地改版", "blue-purple"),
    ("cover-2", "用户增长实验", "A/B 测试 + 漏斗优化", "purple-pink"),
    ("cover-3", "新手引导重设计", "提升 30% 转化", "pink-blue"),
    ("cover-4", "CRM 系统重构", "B 端工作流优化", "purple-blue"),
    ("cover-5", "数据可视化探索", "Dashboard 设计", "mint-blue"),
    ("cover-6", "竞品分析报告", "工具类产品深度研究", "orange-pink"),
]
os.makedirs(f"{ROOT}/works", exist_ok=True)
for slug, title, sub, grad_name in works:
    with open(f"{ROOT}/works/{slug}.svg", "w") as f:
        f.write(cover_svg(title, sub, grad_name))

# === Article covers ===
articles = [
    ("cover-1", "如何做用户访谈", "USER RESEARCH", "blue-purple"),
    ("cover-2", "产品经理的工具箱", "TOOLING", "purple-pink"),
    ("cover-3", "增长黑客的 10 个套路", "GROWTH", "pink-blue"),
    ("cover-4", "从 0 到 1 设计落地页", "DESIGN", "mint-blue"),
]
os.makedirs(f"{ROOT}/articles", exist_ok=True)
for slug, title, sub, grad_name in articles:
    with open(f"{ROOT}/articles/{slug}.svg", "w") as f:
        f.write(cover_svg(title, sub, grad_name))

# === Album covers + photos ===
albums = {
    "iceland": ("冰岛极光之旅", "ICELAND TRIP", "blue-purple"),
    "daily": ("日常生活碎片", "DAILY LIFE", "purple-pink"),
    "design": ("设计灵感合集", "DESIGN INSPO", "mint-blue"),
}
for album_id, (title, sub, grad_name) in albums.items():
    os.makedirs(f"{ROOT}/albums/{album_id}", exist_ok=True)
    with open(f"{ROOT}/albums/{album_id}/cover.svg", "w") as f:
        f.write(cover_svg(title, sub, grad_name))
    photo_labels = [
        "Reykjavik", "Aurora", "Glacier", "Waterfall",
        "Black Sand", "Sun Voyager", "Hallgrim", "Hot Spring"
    ] if album_id == "iceland" else (
        ["Morning", "Coffee", "Workspace", "Reading",
         "Evening", "Friends", "Streets", "Weekend"] if album_id == "daily" else
        ["Typography", "Color", "Layout", "Texture",
         "Grid", "Iconography", "Branding", "Print"]
    )
    photo_captions = [
        "首都雷克雅未克的清晨",
        "北极光下的营地",
        "瓦特纳冰川徒步",
        "斯科加瀑布",
        "维克镇黑沙滩",
        "太阳航行者雕塑",
        "哈尔格林姆教堂",
        "蓝湖温泉",
    ] if album_id == "iceland" else (
        ["早晨的第一缕光", "咖啡与三明治", "居家办公空间", "枕边读物",
         "傍晚的窗台", "朋友小聚", "城市街景", "周末的散步"] if album_id == "daily" else
        ["字体研究", "色彩搭配", "版式参考", "质感灵感",
         "网格系统", "图标设计", "品牌设计", "印刷工艺"]
    )
    for i in range(8):
        with open(f"{ROOT}/albums/{album_id}/{i+1:02d}.svg", "w") as f:
            f.write(album_photo_svg(photo_labels[i], i+1, grad_name, caption=photo_captions[i]))

# === Video covers ===
videos = [
    ("cover-1", "设计思维分享", "B 站 12:30", "purple-pink"),
    ("cover-2", "产品经理日常", "B 站 8:45", "blue-purple"),
    ("cover-3", "用户研究方法论", "YouTube 15:20", "pink-blue"),
    ("cover-4", "Figma 进阶技巧", "B 站 22:10", "mint-blue"),
    ("cover-5", "增长团队搭建", "B 站 18:00", "orange-pink"),
    ("cover-6", "PRD 写作指南", "YouTube 10:30", "purple-blue"),
]
os.makedirs(f"{ROOT}/videos", exist_ok=True)
for slug, title, sub, grad_name in videos:
    with open(f"{ROOT}/videos/{slug}.svg", "w") as f:
        svg = cover_svg(title, sub, grad_name)
        play = '<circle cx="400" cy="250" r="40" fill="rgba(255,255,255,0.9)"/><polygon points="390,230 390,270 425,250" fill="#0D0D0D"/>'
        svg = svg.replace("</svg>", play + "</svg>")
        f.write(svg)

with open(f"{ROOT}/doc-cover.svg", "w") as f:
    f.write(cover_svg("研究报告封面", "RESEARCH REPORT", "blue-purple"))

with open(f"{ROOT}/ppt-cover.svg", "w") as f:
    f.write(cover_svg("产品 PRD 演示", "PRD PRESENTATION", "purple-pink"))

with open(f"{ROOT}/grid-bg.svg", "w") as f:
    f.write('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" fill="rgba(13,13,13,0.08)"/></svg>')

print("Generated all SVG placeholders")
print(f"  Works: {len(works)}")
print(f"  Articles: {len(articles)}")
print(f"  Albums: {len(albums)} x 9 (cover + 8 photos)")
print(f"  Videos: {len(videos)}")
print(f"  Docs/PPT: 2")
