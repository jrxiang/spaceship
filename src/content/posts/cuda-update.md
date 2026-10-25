---
title: CUDA Update
description: '在 Windows 上查看、卸载并重新安装 CUDA Toolkit 的步骤，包括环境变量检查。'
published: 2026-01-12
category: Tools
tags:
  - cuda
---
## 查看当前CUDA版本

在终端中输入`nvcc -V`并回车，`release`后面就是当前安装的版本号。

## 查看最高支持的CUDA版本

在终端中输入`nvidia-smi`并回车，`CUDA Version`后面就是驱动支持的最高版本号。

## 卸载现有CUDA

1. Windows+i快捷键，进入设置页面，在已安装的应用中搜索CUDA，全部卸载。
2. 进入控制面板，卸载CUDA相关的软件。
3. 查看环境变量是否已被清除。

## 安装CUDA

1. 进入CUDA Toolkit官网：[CUDA Toolkit](https://developer.nvidia.com/cuda-downloads)，下载安装包。（注：Installer Type选exe(local)）
2. 选择自定义，全部安装，最好还是安装到C盘。

## 查看环境变量

系统变量中应有：

- CUDA_PATH = C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.1
- CUDA_PATH V13.1 = C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.1

其中的Path中应有：

- C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.1\bin
- C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.1\bin\x64

## 检查是否安装成功

在命令行输入`nvcc -V`。

## 安装cuDNN

cuDNN（NVIDIA CUDA Deep Neural Network library）是NVIDIA开发的GPU加速深度学习库，专为深度神经网络（DNN）提供高度优化的计算操作（如卷积、池化），需与CUDA配合使用以提升模型训练和推理效率。‌

1. 进入cuDNN官网：[cuDNN](https://developer.nvidia.com/cudnn-downloads)，下载安装包。
2. 选择自定义，安装对应CUDA版本的cuDNN，Samples可以不用安装。
3. 把安装的bin、include和lib三个文件夹放到C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.1目录下。

## 安装Pytorch

进入Pytorch官网：[Pytorch](https://pytorch.org/)，用命令行在miniconda中安装pytorch。

- 测试是否安装成功：
在Anaconda Powershell Prompt输入：

```bash
python
import torch
torch.__version__
torch.cuda.is_available()
```
