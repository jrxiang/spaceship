---
title: Git
description: 'Git 工作流与核心原理笔记，涵盖仓库初始化、远程协作与常见操作'
published: 2025-09-24
category: Tools
tags: [git]
---
参考资料：

1. [Git 工作流和核心原理（b 站技术蛋老师）](https://www.bilibili.com/video/BV1r3411F7kn?spm_id_from=333.788.videopod.sections&vd_source=de897355931c3f4d397b0817936d4be1)
2. [给学完 Git，还不会用 GitHub 的朋友们（b 站技术蛋老师）](https://www.bilibili.com/video/BV1RC411W7UE?spm_id_from=333.788.videopod.sections&vd_source=de897355931c3f4d397b0817936d4be1)
3. [向一个项目贡献（开源指北）](https://gitee.com/opensource-guide/git-tutorial/advanced/distributed-of-git/contribute-to-a-project.html)

## 创建并维护自己的项目

### 初始化

- 先远程后本地

先在 Github 上新建远程仓库（需要创建 README.md ），再把仓库克隆到本地。

```shell
git clone https://github.com/jrxiang/test.git
cd test
echo "hello" > abc.md
git add abc.md
git commit -m "Add abc.md"
git push
```

- 先本地后远程

先在本地创建仓库，再把它推送到远程仓库上。

```shell
git init
git add README.md
git commit -m "first commit"
git branch -M main # 本地 git 默认分支为 master，需与远程仓库保持一致
git remote add origin https://github.com/jrxiang/test.git # origin 是远程仓库的别名
git push -u origin main # -u 参数设为默认值，后续可直接 git push
```

### 维护原则

main 分支是最核心的分支，可以理解为项目的稳定版。此时，如果要开发一个新的功能，就要在本地创建一个分支。

```shell
git checkout -b featureA
```

接下来，对应的功能就在 featureA 分支上完成，完成后再合并到 main 分支。

```shell
git switch main
git merge featureA
```

## 参与别人的项目

### 私有化团队

一般都会采用类似 SVN 的集中式工作流程，即几个程序员共同在 master 分支上做开发。对于快速迭代，成员少的小项目来说，不失为一种好用的方式。

每个人都将远程仓库 clone 到本地，开发各自的功能。

然后经过`git add`、`git commit`、`git push`到远程仓库。

例如：现有甲乙两人，他们都克隆了项目，并且分别改了新增和修改的脚本文件并提交，此时没有任何问题。如果二人同时修改了 delete 脚本，那么第二个人提交时会出现冲突。此时需要使用 git fetch 拉取远程变更，然后处理冲突后再提交。修改 delete 脚本，提交推送到远程仓库。

### 私有管理团队（Branch PR）

#### 克隆仓库

```shell
git clone https://github.com/username/repo.git
cd repo
```

#### 创建新分支

为了避免直接在 main 或 master 分支上进行开发，通常会创建一个新的分支：

```shell
git checkout -b new-feature # 创建新分支并切换到该分支
git checkout new-feature # 切换到该分支
```

#### 暂存文件并提交更改

将修改过的文件添加到暂存区，以便进行下一步的提交操作：

```shell
git add filename
# 或者添加所有修改的文件
git add .
```

将暂存区的更改提交到本地仓库，并添加提交信息：

```shell
git commit -m "Add new feature"
```

#### 拉取最新更改

在推送本地更改之前，最好从远程仓库拉取最新的更改，以避免冲突：

```shell
# 先更新本地 main，拿到团队最新改动
git checkout main
git pull origin main

# 返回功能分支，将本地 main 的最新内容合并或变基进来
git switch new-feature
git merge main # 或者 git rebase main

# 如果远程已有同名功能分支，顺带同步它
git pull origin new-feature # 建议先 git fetch
```

这样做可以在本地尽早发现冲突、验证新旧代码能否协同工作，再推送到远程，避免把问题留到 Pull Request 或主分支合并时才暴露。

#### 推送更改

将本地的提交推送到远程仓库：

```shell
git push origin new-feature
```

#### 创建 Pull Request（PR）

在 GitHub 或其他托管平台上创建 Pull Request，邀请团队成员进行代码审查。PR 合并后，你的更改就会合并到主分支。

#### 合并更改

在 PR 审核通过并合并后，可以将远程仓库的主分支合并到本地分支：

```shell
git checkout main # 切换到本地的 main 分支
git pull origin main
git merge new-feature # 把新功能整合到主分支中
```

#### 删除分支

如果不再需要新功能分支，可以将其删除：

```shell
git branch -d new-feature
```

或者从远程仓库删除分支：

```shell
git push origin --delete new-feature
```

### 派生的公开项目（Fork PR）

找到一个公开项目点击 Fork。

在自己的派生仓库上进行修改开发（注意要新建一个分支），接下来类似于 Branch PR，即开发完成后推送到自己的派生仓库中，这时候再进行 PR。

## 本地工作流

### 开发一个新功能

```shell
# 1. 创建主分支（如果需要）
git branch -M main

# 2. 创建并切换分支
git checkout -b feature/new-feature

# 3. 开始开发，修改代码。..
# （这里写你的代码）

# 4. 查看修改
git status
git diff

# 5. 添加修改到暂存区
git add .                    # 添加所有
# 或
git add specific_file.py     # 添加特定文件

# 6. 提交到本地仓库
git commit -m "feat: 实现登录页面 UI"

# 7. 继续开发，再次提交
git add .
git commit -m "feat: 添加表单验证逻辑"

# 8. 查看提交历史
git log --oneline --graph --all # 或 git log --oneline
```

### 合并分支

```shell
# 切换到主分支
git checkout main

# 合并功能分支
git merge feature/new-feature

# 查看合并后的历史
git log --oneline --graph --all
```

### 版本回退与恢复

- 查看历史

```shell
# 查看完整历史
git log

# 查看简化历史
git log --oneline
```

- 回退到指定版本

```shell
# 查看提交哈希（如 abc123f）
git log --oneline

# 临时回退查看（不修改当前状态）
git checkout abc123f

# 回到主分支
git checkout main

# 永久回退（硬重置）
git reset --hard abc123f

# 回退到前一个提交
git reset --hard HEAD~1
```

- 后悔药：恢复误操作

```shell
# 查看所有操作记录（包括被重置的提交）
git reflog

# 找到要恢复的提交哈希
# 然后重置回去
git reset --hard 哈希值
```

### 规范

- commit 规范
  - feat: 新功能
  - fix: 修复 bug
  - docs: 文档更新
  - style: 代码格式调整
  - refactor: 重构代码
  - test: 测试相关
  - chore: 构建过程或辅助工具的变动
- 分支命名规范
  - feature/xxx - 新功能开发
  - bugfix/xxx - bug 修复
  - hotfix/xxx - 紧急修复
  - release/xxx - 发布分支
  - docs/xxx - 文档更新

## 常用指令

注：windows 中用`"`，linux 中用`'`。

```shell
# 仓库初始化与克隆
git init # 初始化一个新的 Git 仓库
git clone git://github.com/someone/some_project.git some_project # 将 URL 地址的远程版本库克隆到本地 some_project 目录下
git config --global user.name "xxx" # 配置用户名
git config --global user.email "xxx@xxx.com" # 配置邮件

# 查看状态与日志
git status # 查看当前工作区和暂存区的状态
git log # 查看提交历史记录，加上--oneline 获得简介输出

# 文件跟踪、添加与提交
git add abc.txt # 将文件添加到暂存区
git add . # 将所有修改文件添加到暂存区
git commit -m "first commit" # 提交暂存区的更改到本地仓库
git commit -am "xxx" # 将 add 和 commit 合为一步   

# 分支管理
git branch # 列出本地所有分支
git branch main # 创建新分支，但不会自动切换到该分支
git checkout main # 切换到指定分支
git checkout -b main # 创建并切换到新分支
git merge main # 将指定分支合并到当前分支
git branch -M main # 将当前分支重命名为 main

# 远程仓库操作
git remote # 查看已添加的远程仓库列表
git remote add origin https://github.com/Thomas-Bob/test.git # 将本地仓库与远程仓库关联起来
git push -u origin main # 将本地的提交推送到远程仓库，其中-u 的作用是将本地分支与远程分支关联起来，这样以后在使用 git push 或 git pull 时可以省略远程仓库名和分支名
git push origin main # 将本地分支推送到远程仓库
git pull origin main # 从 origin 仓库拉取 main 分支的最新提交并自动合并

# 比较、还原与撤销操作
git diff # 查看文件修改的具体差异
git reset README.md # 将文件从暂存区移除，但文件修改本身还在
git reset --hard <commit> # 将工作区和暂存区回退到某个提交（是 git commit 的提交），会直接回退文件内容，<commit>通过 git log 来看最前面的 hash 值（HEAD -> main 表示最新提交）

# 临时保存和恢复修改
git stash # 将当前未提交的修改存储起来，恢复到干净的工作区
git stash pop # 应用最近一次存储的修改并将其从 stash 列表中移除

# 标签管理
git tag # 列出所有标签
git tag -a v1.0 -m "version 1.0" # 给当前提交打上标签，使用-a 参数添加带有说明的标签

# 获取远程更新
git fetch # 从远程仓库获取最新的分支和提交，但不会自动合并，需要手动合并或检查
```
