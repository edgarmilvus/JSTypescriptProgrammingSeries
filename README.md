# Building Intelligent Apps with JavaScript & TypeScript
### Volume 1: Foundations of the OpenAI API, Zod, and LangChain.js

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Official Source Code Repository** for the book by **Edgar Milvus**.
>
> 📖 **Get the Book:** [Available on Amazon](https://www.amazon.com/dp/B0G59X6X7W)
> 🔗 **Author Info:** [linktr.ee/edgarmilvus](https://linktr.ee/edgarmilvus)

---

## 🚀 About This Repository

This repository contains the complete, production-ready source code examples found in **Volume 1** of the **Web AI Series**.

This book is designed to break the Python monopoly in AI development, teaching you how to build robust, type-safe AI applications using the modern stack you already know: **JavaScript**, **TypeScript**, and **Node.js**.

### 📚 Volume 1 Coverage
This repo covers the foundational techniques required to become an AI Engineer:

*   **Part 1: Foundations:** Setting up a secure Node.js AI environment and mastering the OpenAI API with `fetch` and the SDK.
*   **Part 2: Type-Safe AI:** Using **Zod** to enforce strict JSON schemas and prevent LLM hallucinations.
*   **Part 3: Prompt Engineering:** Advanced patterns like System Prompts, Few-Shot Learning, and Chain-of-Thought (CoT).
*   **Part 4: LangChain.js:** Building orchestrations, chains, and structured parsers.

---

## 📂 Project Structure

The code is organized by **Chapter** and **Subsection**, mirroring the book's structure exactly.

```text
/Book_01
  ├── /Chapter_01_Breaking_the_Python_Monopoly...
  │     ├── 00_Theory_Concepts/    # Theoretical code snippets
  │     ├── 01_Basic_Examples/     # "Hello World" style scripts
  │     └── 02_Advanced_Project/   # Production-grade implementations
  │
  ├── /Chapter_02_Talking_to_the_Machine...
  │     └── ...
  │
  ├── ...
  │
  └── /Chapter_20_Capstone...
        └── 03_Solutions/          # Complete solutions to end-of-chapter exercises
```

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

## 📄 License

This code is provided under the **MIT License**. You are free to use it in your own projects, commercial or personal. See the [LICENSE](LICENSE) file for details.
