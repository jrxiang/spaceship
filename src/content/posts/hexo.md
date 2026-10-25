---
title: hexo
description: 'Hexo 博客的创建、更新、源文件备份与多设备写作流程。'
published: 2026-01-12
category: Tools
tags:
  - hexo
---
参考资料：

1. [从零开始搭建 Hexo 博客简明教程（2024版）](https://www.philoli.com/building-a-blog-from-scratch/)
2. [Butterfly](https://butterfly.js.org/)

## 博客更新

```bash
hexo new "my first passage" # 创建新文章
hexo clean # 清空静态网页 cache，然后 hexo d 重新生成
hexo g # hexo generate，根据源文件生成静态网页
hexo s # hexo server，本地部署测试，预览博客效果
hexo d # hexo deploy，发布推送到 GitHub Pages
```

## 源文件备份

```bash
git remote add origin https://github.com/jrxiang/jrxiang.github.io.git
git add .
git commit -m "update source"
git checkout -b source # 若source分支已存在则不用-b
git push -u origin source:source
```

## 用不同电脑写博客

```bash
npm install -g hexo-cli # 安装hexo框架
git clone https://github.com/jrxiang/jrxiang.github.io.git
git pull
git checkout source
```

## 插入图片

创建新文章时会自动在`_posts/`下生成与之同名的文件夹，其中可存放文中用到的图片。例如，文中需要用到名为`picture.jpg`的图片，则直接在文中按如下方式引用即可（注：“标题”可省略）。

```md
![图片](picture.jpg "标题")
```
