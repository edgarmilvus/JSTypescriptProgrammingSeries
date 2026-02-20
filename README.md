# Building Intelligent Apps with JavaScript & TypeScript


[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Official Source Code Repository** for the book by **Edgar Milvus**.

### Volume 1: Foundations of the OpenAI API, Zod, and LangChain.js
### Volume 2: The Modern Stack. Building Generative UI with Next.js, Vercel AI SDK, and React Server Components.
 
 
### The Complete Series “AI with JavaScript & TypeScript”: 

[Volumes 1 to 5: Available on Amazon](https://www.amazon.com/dp/B0G59X6X7W)

[ALL Volumes: On Leanpub.com, quantity discounts](https://leanpub.com/u/edgarmilvus)

---

Check also the [Python Programming Series](https://github.com/edgarmilvus/PythonProgrammingSeries) and
the [C# & AI Masterclass Programming Series](https://github.com/edgarmilvus/PythonProgrammingSeries)

--- 

## 🚀 About This Repository

This repository contains the complete, production-ready source code examples found in **Volumes** of the **Web AI Series**.
 
---

## 🛠️ Getting Started

To run these examples, you need **Node.js (v18+)** installed.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/web-ai-vol1.git
cd web-ai-vol1
```

### 2. Install Dependencies
This project uses standard packages like `openai`, `zod`, `langchain`, and `dotenv`.
```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables
Security is a major focus of this book. **Never hardcode your API keys.**
Create a `.env` file in the root directory (or inside specific chapter folders if running individually):

```bash
touch .env
```

Add your keys:
```env
OPENAI_API_KEY=sk-your-key-here
# Optional for later chapters:
# SERPER_API_KEY=...
# PINECONE_API_KEY=...
```

### 4. Run an Example
Most scripts are designed to be run directly with `ts-node` for immediate feedback.

```bash
# Example: Running the basic Zod validation script
npx ts-node Book_01/Chapter_03_Type_Safe_AI/01_Basic_Examples/basic_zod_validation.ts
```
---

[Series Blog](https://programmingcentral.hashnode.dev/series/typescript-js-programming)

---

## 📄 License

This code is provided under the **MIT License**. You are free to use it in your own projects, commercial or personal. See the [LICENSE](LICENSE) file for details.
