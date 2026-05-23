# 🌾 Personal Portfolio — Data, AI & Agribusiness

> **AI Engineer** specialized in building production-ready NLP pipelines, computer vision systems, and LLM agents for agribusiness.

🌐 **Live Demo:** [lukesz-portifolio.vercel.app](https://lukesz-portifolio.vercel.app/)  
✉️ **Contact:** [lucassg2015@gmail.com](mailto:lucassg2015@gmail.com)

---

## 💼 1. Business Context

Agribusiness is the most data-rich vertical that applied AI has yet to serve at scale. This project exists to bridge the gap between complex machine learning pipelines and real-world industrial opportunities. 

Instead of acting as a simple catalog of repositories, this portfolio functions as a high-impact developer vitrine. Every project is intentionally framed as a **business case study** (*problem → approach → result with measurable metrics*) designed to immediately prove capability to technical recruiters, academic peers, and industry stakeholders. It showcases production-ready, low-latency, and offline-first solutions specifically targeted at solving agricultural and environmental challenges.

---

## 🏗️ 2. Architecture Diagram

The application is built on top of **Astro 6** as a static site, fully decoupling visual components from individual dataset items to achieve rapid load times and optimal SEO score.

```mermaid
graph TD
    subgraph Client ["Client Browser"]
        UI["Interactive Landing Page"]
    end

    subgraph Astro ["Astro 6 SSG Engine"]
        Pages["src/pages/index.astro"]
        Components["src/components/*.astro (Hero, About, Projects, etc.)"]
        Layout["src/layouts/Layout.astro"]
        Styles["src/styles/global.css (Tailwind v4 @theme)"]
    end

    subgraph DataStore ["Decoupled Content & Configuration"]
        SiteData["src/data/site.ts (Metadata & SEO)"]
        SkillsData["src/data/skills.ts (Skill Groups)"]
        ExpData["src/data/experience.ts (Timeline Items)"]
        ProjectsCollection["src/content/projects/*.md (Markdown Schema)"]
    end

    subgraph External ["External Services"]
        W3F["Web3Forms API (Serverless Form Submission)"]
        Env["Vercel Environment Variables (.env)"]
    end

    %% Flows
    ProjectsCollection -->|Content Collection Loader| Pages
    SiteData & SkillsData & ExpData --> Pages
    Pages --> Layout
    Components --> Pages
    Styles --> Layout
    Layout -->|Builds| UI
    UI -->|POST /submit (with PUBLIC_WEB3FORMS_KEY)| W3F
    Env -->|Astro Meta Env| SiteData
```

---

## 🛠️ 3. Engineering Decisions

*   **Tailwind CSS v4 Integration via PostCSS:** 
    *   *Decision:* We configured Tailwind v4 using PostCSS (`postcss.config.mjs`) instead of the default `@tailwindcss/vite` plugin.
    *   *Rationale:* Astro 6 utilizes a Vite setup that leverages the Rolldown compiler under the hood. The default Vite-specific Tailwind v4 plugin throws errors during compilation due to typescript path resolution issues (`Missing field tsconfigPaths`). Bypassing this through PostCSS and importing Tailwind in `global.css` preserves build integrity with zero performance compromises.
*   **Decoupled Content Architecture:**
    *   *Decision:* Centralized all profile details in `src/data/*.ts` and projects inside Astro's Content Collections (`src/content/projects/`).
    *   *Rationale:* Decoupling content from rendering code keeps Astro components modular and reusable. Lucas (or any developer) can update project descriptions, skills, or career highlights without modifying any HTML, CSS, or TS logic, simplifying long-term maintenance.
*   **Serverless Contact Form (Web3Forms):**
    *   *Decision:* Used Web3Forms API combined with a client-side fetch handler in `Contact.astro`.
    *   *Rationale:* This approach keeps the application 100% static (`output: 'static'`) for optimal SEO and rapid delivery on Vercel's global CDN while supporting user outreach without maintaining a dedicated backend, database, or API server.
*   **Environment Variable for Access Keys:**
    *   *Decision:* Moved the Web3Forms access key from code to `import.meta.env.PUBLIC_WEB3FORMS_KEY` with a safe local fallback.
    *   *Rationale:* Prevents exposing active API integration keys in the public Git history, complying with security best practices.

---

## 🚀 4. How to Run

Follow these simple commands to install, configure environment variables, and boot up the development server:

```bash
# Clone the repository
git clone https://github.com/LukeSantossz/portifolio.git
cd portifolio

# Install dependencies, setup environment variables, and run locally in one command:
npm install && cp .env.example .env && npm run dev
```

*   **Local Server:** Open [http://localhost:4321](http://localhost:4321) in your browser.
*   **Production Build:** To build the optimized static bundle in `/dist`, run `npm run build`.

---

## ⚖️ License & Contact

Developed with care by **Lucas Gonçalves** (LG). Feel free to reach out for collaboration or professional opportunities!

*   **Email:** [lucassg2015@gmail.com](mailto:lucassg2015@gmail.com)
*   **LinkedIn:** [linkedin.com/in/lucas-gonçalvessz/](https://www.linkedin.com/in/lucas-gon%C3%A7alvessz/)
*   **GitHub:** [github.com/LukeSantossz](https://github.com/LukeSantossz)
