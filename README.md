# Building Intelligent Apps with JavaScript & TypeScript - ebooks series

Volume 1: Building Intelligent Apps with JavaScript & TypeScript. Foundations, OpenAI API, Zod, and LangChain.js.

Volume 2: The Modern Stack. Building Generative UI with Next.js, Vercel AI SDK, and React Server Components.

Volume 3: Master Your Data. Production RAG, Vector Databases, and Enterprise Search with JavaScript.

Volume 4: Autonomous Agents. Building Multi-Agent Systems and Workflows with LangGraph.js.

Volume 5: The Edge of AI. Local LLMs (Ollama), Transformers.js, WebGPU, and Performance Optimization.

Volume 6: The AI-Ready SaaS Boilerplate. Auth, Database with Vector Support, and Payment Stack.

Volume 7: Backend for Frontend & Intelligent APIs Backend for Frontend & Intelligent APIs. tRPC, Edge Functions, and LLM Data Transformation

Volume 8: The Monetization Engine The Monetization Engine. Stripe, Smart Dunning, and AI Customer Support Agents

Volume 9: AI-Driven Growth Engineering. Programmatic SEO with GPT-4, Content Automation, and Analytics.

Volume 11: No More Localhost. Mastering Docker, Linux, and Containerization for JS & AI Apps

Volume 12: The Perfect Pipeline. Advanced CI/CD with GitHub Actions, Automated Testing, and AI Code Reviews.

Volume 14: Kubernetes & Orchestration. Deploying Scalable Node.js & AI Clusters without Tears

Volume 16: React Native for Web Developers. From Next.js to Expo, NativeWind, and Universal App

Volume 19: Offline AI & Local LLMs. Running Llama 3 and Vector Search directly on the Smartphone

Volume 20: App Store Engineering. CI/CD for Mobile (EAS), OTA Updates, and AI-Driven App Store Optimization

Volume 21: The TypeScript-First Architect. Building Robust Applications with Effect, Zod, and Drizzle

Volume 22: The Native Era. Modern Node.js, Bun & Deno without Bundlers or Transpilers.

Volume 23: Local-First Systems in TypeScript. Collaborative & Offline-Ready Web Apps with CRDTs and WASM DBs

Volume 24: TypeScript Metaprogramming. Advanced Type Gymnastics, Modern Decorators, and Compiler Internals

Volume 25: Model Context Protocol (MCP) & Computer Use. Standardizing Tool Integration, Vision-Driven Browser Automation, and Agent Governance

Voluime 26: Book 26: Generative Media & Visual Workflow Engines. Node-Based AI Canvases, Real-Time Media Streaming Pipelines, and WebGPU Processing


Get the volumes on  <!-- on [Amazon](https://www.amazon.com/dp/B0G59X6X7W) or --> [Leanpub.com](https://leanpub.com/u/edgarmilvus)

---
19-03-2026 News

### 🚀 Free TypeScript & AI Engineering Masterclass

I have made the entire series available on a dedicated, lightning-fast platform. 
Each chapter covers everything from the basics to common pitfalls while the ebooks also feature advanced code with comments and exercises with instructor analysis.

👉 [**Access the TypeScript & AI Series on Programming Central**](https://programmingcentral.vercel.app/books/typescript/)

**Why learn here?**
*   **Zero Friction:** No signup, no email required, and no "waitlists." Everything is **instantly accessible** for free.
*   **Structured Learning:** Use the sidebar menu on the left to browse the full curriculum. Chapters flow logically from core concepts to real-world AI implementation.
*   **Engineering First:** We don't just show syntax; we dive into **practical examples** and identify **common pitfalls** that senior developers avoid.
*   **Interactive Quizzes:** At the end of each chapter, you can test your knowledge with our custom quiz engine.

**How the quizzes work:**
The system generates a random set of engineering challenges for every attempt. You get **instant feedback** and, most importantly, a **detailed architectural explanation** for every correct and incorrect choice. It’s designed to ensure you master the *logic* of AI engineering, not just the code.

---

# Other programming & AI series:


[Android & Kotlin AI Series](https://github.com/edgarmilvus/AndroidKotlinAIProgrammingSeries)

[Swift & AI Series](https://github.com/edgarmilvus/SwiftAIProgrammingSeries)

[C# & AI Series](https://github.com/edgarmilvus/CSharpProgrammingSeries)  

[Typescript & AI Series](https://github.com/edgarmilvus/JSTypescriptProgrammingSeries)

[Rust & AI Series](https://github.com/edgarmilvus/RustAIProgrammingSeries)

[Python & AI Series](https://github.com/edgarmilvus/PythonProgrammingSeries) 

 
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
