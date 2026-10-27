---
title: CUDA Update
description: '在 Windows 上查看、卸载并重新安装 CUDA Toolkit 的步骤，包括环境变量检查'
published: 2026-01-12
category: Tools
tags: [cuda]
---
## 查看当前 CUDA 版本

在终端中输入`nvcc -V`并回车，`release`后面就是当前安装的版本号。

## 查看最高支持的 CUDA 版本

在终端中输入`nvidia-smi`并回车，`CUDA Version`后面就是驱动支持的最高版本号。

## 卸载现有 CUDA

1. Windows+i 快捷键，进入设置页面，在已安装的应用中搜索 CUDA，全部卸载。
2. 进入控制面板，卸载 CUDA 相关的软件。
3. 查看环境变量是否已被清除。

## 安装 CUDA

1. 进入 CUDA Toolkit 官网：[CUDA Toolkit](https://developer.nvidia.com/cuda-downloads)，下载安装包。（注：Installer Type 选 exe(local)）
2. 选择自定义，全部安装，最好还是安装到 C 盘。

## 查看环境变量

系统变量中应有：

- CUDA_PATH = C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.1
- CUDA_PATH V13.1 = C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.1

其中的 Path 中应有：

- C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.1\bin
- C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.1\bin\x64

## 检查是否安装成功

在命令行输入`nvcc -V`。

## 安装 cuDNN

cuDNN（NVIDIA CUDA Deep Neural Network library）是 NVIDIA 开发的 GPU 加速深度学习库，专为深度神经网络（DNN）提供高度优化的计算操作（如卷积、池化），需与 CUDA 配合使用以提升模型训练和推理效率。‌

1. 进入 cuDNN 官网：[cuDNN](https://developer.nvidia.com/cudnn-downloads)，下载安装包。
2. 选择自定义，安装对应 CUDA 版本的 cuDNN，Samples 可以不用安装。
3. 把安装的 bin、include 和 lib 三个文件夹放到 C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.1 目录下。

## 安装 Pytorch

进入 Pytorch 官网：[Pytorch](https://pytorch.org/)，用命令行在 miniconda 中安装 pytorch。

- 测试是否安装成功：
在 Anaconda Powershell Prompt 输入：

```bash
python
import torch
torch.__version__
torch.cuda.is_available()
```
