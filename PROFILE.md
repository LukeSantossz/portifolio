# Perfil — Preencha para montarmos o portfólio

Responda **após cada `→`**. Pode escrever em **português** que eu adapto para o
inglês do site. Deixe em branco o que não se aplica.

> Dica de ouro (vinda da pesquisa): o que mais converte recrutador de IA é
> **projeto narrado como case** — *problema → o que você fez → resultado com número*.
> Vale mais 3 projetos fortes do que 8 fracos.

Legenda: **[obrigatório]** · *(opcional)* · 🇬🇧 = vai aparecer em inglês no site.

---

## 1. Identidade & Posicionamento  → `src/data/site.ts`

**1.1 Nome completo** **[obrigatório]**
→ 

**1.2 Iniciais (para o selo/logo)** *(ex: LS)*
→ 

**1.3 Cargo/título curto** 🇬🇧 *(ex: AI Engineer)* **[obrigatório]**
→ 

**1.4 Headline de posicionamento** 🇬🇧 **[obrigatório]**
_Formato sugerido: “[papel] specialized in [domínio]. [resultado mensurável].”_
_Ex: “AI Engineer building computer-vision and LLM systems that ship to production.”_
→ 

**1.5 Sub-headline (1–2 frases de apoio)** 🇬🇧
→ 

**1.6 Localização** *(ex: Brasil / Remote)*
→ 

---

## 2. Contato & Links  → `src/data/site.ts`

**2.1 E-mail de contato (o SEU, pessoal)** **[obrigatório]**
→ 

**2.2 GitHub (URL)** **[obrigatório]**
→ 

**2.3 LinkedIn (URL)** **[obrigatório]**
→ 

**2.4 Outros links** *(Hugging Face, Kaggle, X/Twitter, site, Google Scholar…)*
→ 

---

## 3. Sobre / Bio  → `src/components/About.astro`

**3.1 Bio em 2–3 parágrafos curtos (na sua voz)** 🇬🇧 **[obrigatório]**
_Quem você é, no que é forte, o que te diferencia. Sem “amo café e código”._
→ 


**3.2 O que você procura** *(ex: full-time, remoto, tipo de empresa/projeto)*
→ 

**3.3 Fatos rápidos (cards do About)** — confirme/edite:
- Focus 🇬🇧 → 
- Domains 🇬🇧 *(ex: CV · NLP · MLOps)* → 
- Open to 🇬🇧 *(ex: Full-time · Remote)* → 

---

## 4. Skills  → `src/data/skills.ts`

Liste só o que você realmente usa. Pode renomear/criar categorias.

- **Languages** 🇬🇧 *(ex: Python, SQL, TypeScript)* → 
- **Data & ML** 🇬🇧 *(ex: pandas, scikit-learn, PyTorch)* → 
- **AI / LLM** 🇬🇧 *(ex: RAG, LangChain, OpenAI/Anthropic APIs)* → 
- **Automation & Data Eng** 🇬🇧 *(ex: Airflow, ETL, APIs)* → 
- **Tools & Cloud** 🇬🇧 *(ex: Docker, PostgreSQL, AWS/GCP)* → 

---

## 5. Experiência & Formação  → `src/data/experience.ts`

Copie o bloco abaixo para **cada** cargo/curso (mais recente primeiro).

### Item
- **Tipo:** trabalho ☐ / formação ☐
- **Cargo / curso** 🇬🇧 → 
- **Empresa / instituição** → 
- **Período** *(ex: 2023 — Atual)* → 
- **Descrição (1–2 frases)** 🇬🇧 → 
- **Destaques com número** 🇬🇧 *(ex: “automatizei X, economizando ~Yh/semana”)*
  - → 
  - → 

<!-- duplique o bloco "### Item" quantas vezes precisar -->

---

## 6. Projetos (o coração)  → `src/content/projects/*.md`

Preencha **3 a 6**. Copie o bloco para cada projeto. Os melhores têm **número no resultado**.

### Projeto
- **Título** 🇬🇧 *(orientado a problema, ex: “Crop Disease Detector”)* → 
- **Tagline (1 linha)** 🇬🇧 → 
- **Domínio de IA** *(Computer Vision / NLP & LLMs / MLOps & Agents / Data Engineering / outro)* → 
- **Ano** → 
- **Problema** 🇬🇧 *(por que existia, qual a dor)* → 
- **Abordagem** 🇬🇧 *(o que você fez / como)* → 
- **Resultado** 🇬🇧 *(impacto, de preferência com métrica)* → 
- **Stack** 🇬🇧 *(ex: Python, PyTorch, Docker)* → 
- **Link do repositório (GitHub)** → 
- **Link de demo** *(se houver)* → 
- **Destaque?** *(sim = aparece em evidência)* → 

<!-- duplique o bloco "### Projeto" para cada projeto (3 a 6) -->

---

## 7. Assets (você fornece os arquivos)

- **CV em PDF** → coloque o arquivo em `public/cv.pdf`  ☐ entregue
- **Foto** *(opcional)* → `public/images/profile.jpg`  ☐ entregue
- **Imagem de compartilhamento** *(opcional, 1200×630)* → `public/og-image.png`  ☐ entregue

---

## 8. Preferências & Integrações

**8.1 Tema:** tinta escuro (atual) ☐ / papel claro ☐ / tanto faz ☐
→ 

**8.2 Cor de acento:** manter vermelhão *shu-iro* ☐ / outra (qual?) →

**8.3 Web3Forms (formulário de contato):** crie a chave grátis em
https://web3forms.com com o e-mail que deve **receber** as mensagens, e cole aqui:
→ 

---

## 9. SEO *(opcional — se deixar em branco, eu redijo a partir do resto)*

- **Título da aba/Google** 🇬🇧 *(ex: “Lucas Santos — AI Engineer”)* → 
- **Descrição (1 frase)** 🇬🇧 → 

---

> Quando preencher (mesmo que parcialmente), me avise — eu populo `site.ts`,
> `skills.ts`, `experience.ts` e crio os arquivos de projeto, e a gente revisa.
