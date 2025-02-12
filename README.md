<!--
 * @Author: nwafufhy hyf7753@gmail.com
 * @Date: 2025-02-12 23:25:30
 * @LastEditors: nwafufhy hyf7753@gmail.com
 * @LastEditTime: 2025-02-12 23:25:39
 * @FilePath: \prompt-optimizer\README.md
 * @Description: 
-->
# Prompt Optimizer Platform

[![CI Status](https://github.com/yourname/prompt-optimizer/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yourname/prompt-optimizer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

智能Prompt优化管理平台，实现从创建到持续改进的全生命周期管理。

## ✨ 功能特性
- 结构化Prompt模板引擎
- AI辅助的自动优化循环
- 版本控制系统
- 可视化知识库管理
- 多模型沙箱测试环境

## 🛠️ 技术栈
| 领域       | 技术选型                  |
|------------|--------------------------|
| 前端       | React + Ant Design + Vite|
| 后端       | FastAPI + MongoDB        |
| AI集成     | LangChain + OpenAI       |
| 基础设施   | Docker + Nginx           |

## 🚀 快速开始

### 前置需求
- Node.js 18+
- Python 3.10+
- Docker Desktop

### 安装步骤
```bash
git clone https://github.com/yourname/prompt-optimizer.git
cd prompt-optimizer

# 前端依赖
cd client && npm install

# 后端依赖
cd ../server && poetry install

# 启动MongoDB
docker-compose -f infra/docker-compose.yml up -d
```

### 配置环境
创建 `.env` 文件：
```ini
# 前端
VITE_API_BASE=http://localhost:8000

# 后端
MONGO_URI=mongodb://localhost:27017/prod_db
OPENAI_API_KEY=your_api_key
```

### 启动开发模式
```bash
# 前端
cd client && npm run dev

# 后端
cd ../server && poetry run uvicorn main:app --reload
```

## 📚 使用文档
- [API参考](docs/api.md)
- [架构设计](docs/architecture.md)
- [贡献指南](docs/CONTRIBUTING.md)

## 🤝 贡献流程
1. Fork仓库
2. 创建特性分支 (`git checkout -b feat/new-feature`)
3. 提交变更 (`git commit -am 'Add new feature'`)
4. 推送到分支 (`git push origin feat/new-feature`)
5. 创建Pull Request

## 📄 License
MIT License