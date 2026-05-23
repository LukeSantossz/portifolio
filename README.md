# 🌾 Lucas Gonçalves — Portfolio

> **AI Engineer** specialized in building production-ready NLP pipelines, computer vision systems, and LLM agents for agribusiness.

Welcome to the source code repository of my personal portfolio landing page. This is a single-page, high-performance, dark-tech themed website showcasing my academic research, technical projects, and professional experience at the intersection of AI and Agribusiness.

🌐 **Live Demo:** [lukesz-portifolio.vercel.app](https://lukesz-portifolio.vercel.app/)  
✉️ **Contact:** [lucassg2015@gmail.com](mailto:lucassg2015@gmail.com)

---

## 🚀 Featured Case Studies & Projects

My work focuses on applied AI that solves real-world challenges, particularly in low-connectivity agricultural settings:

### 🌡️ [Global Temperature Forecasting Pipeline](https://github.com/LukeSantossz/weather-forecast)
*   **Tagline:** 0.19°C RMSE across 211 countries — statistical and ML ensemble for agricultural climate planning.
*   **Problem:** Single-model pipelines lack the robustness needed for frost/heat alerts and irrigation planning.
*   **Approach:** Analyzed 133K+ daily observations across 211 countries. Compared 5 approaches (Prophet, ARIMA, SARIMA, LightGBM, GradientBoosting) and combined the best performers in a weighted ensemble. Added dual anomaly detection via Z-score and Isolation Forest.
*   **Result:** 0.19°C RMSE (LightGBM), representing a 75% improvement over the Prophet baseline.
*   **Stack:** Python, LightGBM, ARIMA/SARIMA, Prophet, scikit-learn, PyArrow/Parquet, pandas.

### 🤖 [SmartB100: RAG Agent with Hallucination Scoring](https://github.com/LukeSantossz/sb100_agents)
*   **Tagline:** RAG-powered Q&A for agronomy with semantic entropy to flag unreliable answers in real-time.
*   **Problem:** Generic LLMs hallucinate with no confidence signaling, making them unsafe for field decision-making.
*   **Approach:** Integrated Ollama (llama3.2:3b + nomic-embed-text) with FastAPI and Qdrant vector search. Implemented semantic entropy (Farquhar et al., Nature 2024) to score response confidence (0.0-1.0) and integrated multi-provider verification dispatch (Groq/OpenRouter).
*   **Result:** Production-ready MVP spanning 12 specialized modules with fully containerized docker-compose setup.
*   **Stack:** Python, FastAPI, Qdrant, Ollama, LangGraph, HuggingFace, Gradio, Docker.

### 📱 [VisioSoil: On-Device Soil Classifier](https://github.com/LukeSantossz/visiosoil-app)
*   **Tagline:** Cross-platform mobile app for geolocated soil classification with on-device TFLite inference — no connectivity required.
*   **Problem:** Lab analysis is slow and specialists are scarce in remote rural properties.
*   **Approach:** Cross-platform Flutter app with local TensorFlow Lite inference (12 USDA soil classes). Runs classification in a background isolate, geo-tags records, and stores records locally in Drift/SQLite.
*   **Achievements:** Accepted at **ConBAP/ICPA 2026** (abstract #14064) and Top 250 at **FETEPS 2025**.
*   **Stack:** Flutter, Dart, TensorFlow Lite, Riverpod, GoRouter, Drift/SQLite.

---

## 🛠️ Tech Stack & Architecture

This portfolio landing page is engineered for speed, responsiveness, and premium aesthetics:

*   **Astro 6:** Static Site Generation (SSG) for ultra-fast loading, optimal performance, and best-in-class SEO.
*   **Tailwind CSS v4:** Modern styling with styling tokens loaded dynamically from `@theme` in `global.css`.
*   **TypeScript:** Strict type-safety across components and data configurations.
*   **Content Collections:** Projects are managed as structured Markdown schemas in `src/content/projects/`.
*   **Web3Forms:** Seamless contact form integration that functions without requiring a backend server.

---

## 💻 Local Development

To run this project locally, make sure you have [Node.js](https://nodejs.org) installed, then execute:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/LukeSantossz/portifolio.git
    cd portifolio
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure environment variables:**
    Copy the example environment file and add your Web3Forms access key:
    ```bash
    cp .env.example .env
    ```
    Edit the `.env` file to replace `your_web3forms_key_here` with your actual access key from [Web3Forms](https://web3forms.com).
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:4321](http://localhost:4321) in your browser.
5.  **Build for production:**
    ```bash
    npm run build
    ```
    The static files will be generated in the `dist/` directory, ready to be deployed.

---

## ⚖️ License & Contact

Developed with care by **Lucas Gonçalves** (LG). Feel free to reach out for collaboration or professional opportunities!

*   **Email:** [lucassg2015@gmail.com](mailto:lucassg2015@gmail.com)
*   **LinkedIn:** [linkedin.com/in/lucas-gonçalvessz/](https://www.linkedin.com/in/lucas-gon%C3%A7alvessz/)
*   **GitHub:** [github.com/LukeSantossz](https://github.com/LukeSantossz)
