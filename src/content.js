// All site copy lives here. Anything still missing is a string starting with
// "TODO_" — run `grep -rn TODO_ src/content.js` to list what's left to fill in.
// Replace a TODO with the real value (a URL, an image path like
// "/img/fulfilliq-1.webp", an email address...) and the site picks it up.

// While true, placeholders show their TODO key on the page so they're easy to
// spot. Flip to false before launch to show a neutral "coming soon" instead.
export const SHOW_TODOS = true;

export const isTodo = (value) => !value || String(value).startsWith("TODO_");

export const person = {
  name: "Umer Ahmed",
  first: "Umer",
  last: "Ahmed",
  monogram: "UA",
  // Drop a background-removed, chest-up cutout at public/img/portrait.webp
  // (TODO_PORTRAIT). Until that file exists the slot stays hidden.
  portrait: "/img/portrait.webp",
};

export const contact = {
  email: "TODO_EMAIL",
  // Digits only, with country code, e.g. "923001234567"
  whatsapp: "TODO_WHATSAPP_NUMBER",
  linkedin: "TODO_LINKEDIN_URL",
  // e.g. "/cv/umer-ahmed-cv.pdf" once the PDF is in public/cv/
  cv: "TODO_CV_URL",
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Clients", href: "#clients" },
  { label: "Lab", href: "#lab" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  roles: ["Marketer", "Builder", "AI-first", "Shipper"],
  headline: "I build AI-powered SaaS products end to end, from idea to deployed.",
  sub: "Marketing brain, builder's hands. I find the business problem, design the product, and ship it with Claude Code, React and Supabase.",
  primaryCta: { label: "Hire me for a build", href: "#contact" },
  secondaryCta: { label: "Download CV" },
  scrollCue: "Scroll to explore",
};

export const marquee = [
  "Find The Problem",
  "Write The Spec",
  "Build With Claude Code",
  "Control The Economics",
  "Ship And Share",
];

export const productsIntro = {
  eyebrow: "Featured Products",
  heading: ["Problems solved,", "products shipped."],
  count: "05 / Products",
};

export const products = [
  {
    id: "fulfilliq",
    name: "FulfillIQ",
    tagline: "“Can I deliver this order on time?”",
    audience: "Small manufacturers · B2B",
    status: "Live",
    tone: "live",
    stack: ["React", "Tailwind", "Supabase", "Vercel", "Claude Code"],
    blocks: [
      {
        title: "Problem",
        body: "Small manufacturers accept orders on gut feel. Inventory tools show what's in stock, not whether a specific order can actually ship by its date.",
      },
      {
        title: "What I built",
        body: "An order-promising engine. Enter a product, quantity and delivery date; FulfillIQ explodes the bill of materials against current stock and supplier lead times, then returns a clear verdict: feasible, at risk, or infeasible.",
      },
      {
        title: "Why it matters",
        body: "It answers a planning question that usually lives inside expensive ERP systems, in a tool a small factory can actually use. I wrote the full spec first (data model, screens, BOM logic, design tokens, seed data), then built it with Claude Code.",
      },
    ],
    url: "https://fulfilliq-three.vercel.app",
    images: [
      "TODO_FULFILLIQ_SCREENSHOT_1",
      "TODO_FULFILLIQ_SCREENSHOT_2",
      "TODO_FULFILLIQ_SCREENSHOT_3",
    ],
  },
  {
    id: "nurtureai",
    name: "NurtureAI",
    tagline: "A child development companion built for Pakistan.",
    audience: "Pakistani parents & schools",
    status: "Live",
    tone: "live",
    stack: ["Claude Code"],
    blocks: [
      {
        title: "Problem",
        body: "Parents of children aged 4 to 12 have few accessible, culturally relevant ways to track development or know when to seek help. Most parenting apps are Western templates, translated badly.",
      },
      {
        title: "What I built",
        body: "Parents log everyday observations; NurtureAI builds a continuous development profile and suggests personalised, age-appropriate activities. It never diagnoses — it surfaces patterns and points to psychologists, speech therapists, tutors and OTs through a referral marketplace.",
      },
      {
        title: "Business thinking",
        body: "English, Urdu and Roman Urdu from day one. Three revenue streams: freemium subscriptions, per-student school licences and booking commission. Backed by a full proposal: 7Ps, MVP scope, validation plan and roadmap.",
      },
    ],
    url: "https://nurture-ai-kappa.vercel.app",
    images: ["TODO_NURTUREAI_SCREENSHOT_1"],
  },
  {
    id: "studyforge",
    name: "StudyForge",
    tagline: "From messy notes to a day-by-day study plan.",
    audience: "Students · B2C",
    status: "Live",
    tone: "live",
    stack: ["React", "Tailwind", "Claude API", "Vercel"],
    blocks: [
      {
        title: "Problem",
        body: "The week before an exam, students sit on piles of notes, quizzes and assignments with no idea what to prioritise.",
      },
      {
        title: "What I built",
        body: "Upload PDFs or photos of handwritten notes and pick an exam date. The Claude API finds the key topics, weights them by how often they show up in quizzes and assignments, and builds a prioritised day-by-day plan — downloadable as a PDF.",
      },
      {
        title: "Product decisions",
        body: "No sign-up, so zero friction. Three generations per visitor per day keep API costs in check, and a “Built by Umer Ahmed” banner turns every shared plan into marketing.",
      },
    ],
    url: "https://studyforge-flax.vercel.app",
    images: ["TODO_STUDYFORGE_SCREENSHOT_1"],
  },
  {
    id: "restockiq",
    name: "RestockIQ",
    tagline: "Restock alerts based on real consumption.",
    audience: "Small manufacturers · B2B",
    status: "Deployed",
    tone: "live",
    stack: ["React", "Tailwind", "Supabase", "Vercel", "Claude Code"],
    blocks: [
      {
        title: "Problem",
        body: "Production businesses run out of raw materials mid-run because nobody tracks what actually leaves the warehouse. I saw it first-hand at a production-based fashion brand.",
      },
      {
        title: "What I built",
        body: "A raw material tracker where production staff log every withdrawal. Stock updates instantly, each material is colour-coded red, yellow or green, and days-until-stockout is estimated from rolling average consumption.",
      },
    ],
    url: "https://restockiq-sable.vercel.app",
    images: ["TODO_RESTOCKIQ_SCREENSHOT_1"],
  },
  {
    id: "kahwa",
    name: "kahwa.",
    tagline: "A cafe finder that feels like a concierge.",
    audience: "Coffee lovers in Lahore & Karachi",
    status: "Status TBC",
    tone: "tbc",
    stack: ["Web app", "AI concierge"],
    blocks: [
      {
        title: "Problem",
        body: "Cafe directories all look the same: endless lists and star ratings that never answer “where should I go right now?”",
      },
      {
        title: "What I built",
        body: "A mood-first experience. Three or four taps capture your vibe, company and priority, then an AI concierge reveals one recommendation, conversationally, instead of a list.",
      },
      {
        title: "Why it's here",
        body: "Product and UX range beyond B2B dashboards: a consumer experience designed to feel unlike any other app.",
      },
    ],
    url: "TODO_KAHWA_URL",
    images: ["TODO_KAHWA_SCREENSHOT_1"],
  },
];

export const clientsIntro = {
  eyebrow: "Client Work",
  heading: ["Where the problems", "come from."],
};

export const clients = [
  {
    name: "Carte Blanche",
    org: "Carte Blanche By Nabeel Ahmed",
    role: "Social Media Manager",
    summary:
      "Ran social for a production-based fashion brand. Watching raw materials run out mid-production is where RestockIQ and FulfillIQ started.",
    tags: ["Social media", "Content", "Ops insight"],
    related: ["restockiq", "fulfilliq"],
    image: "TODO_CLIENT_CARTEBLANCHE_IMAGE",
  },
  {
    name: "Ukiyo Pakistan",
    org: "Ukiyo Pakistan",
    role: "Content Strategy & Instagram Analysis",
    summary:
      "Content strategy and Instagram performance analysis for a Japanese-inspired streetwear brand: reading what the numbers say, then deciding what to post next.",
    tags: ["Content strategy", "Instagram analytics"],
    related: [],
    image: "TODO_CLIENT_UKIYO_IMAGE",
  },
  {
    name: "Rizq LSE",
    org: "Rizq LSE",
    role: "Director of Fundraising",
    summary:
      "Led fundraising for Rizq LSE and raised 550K+ PKR. The same pitch-and-persuade muscle now goes into positioning every product I ship.",
    tags: ["Fundraising", "Leadership"],
    related: [],
    image: "TODO_CLIENT_RIZQ_IMAGE",
  },
];

export const experimentsIntro = {
  eyebrow: "Experiments",
  heading: ["The lab."],
  note: "Side projects, each proving a different skill.",
};

export const experiments = [
  {
    id: "jarvis",
    name: "JARVIS",
    what: "A working voice AI assistant with a dark sci-fi interface.",
    stack: ["React", "Vite", "Claude API", "ElevenLabs", "Web Speech API"],
    proves: "Wiring multiple AI APIs into a real-time experience.",
  },
  {
    id: "realflow",
    name: "RealFlow AI",
    what: "WhatsApp automation for Pakistani real estate agencies, with a 150-day plan to $1,000 a month recurring.",
    stack: ["n8n", "WhatsApp Business API"],
    proves: "Automation, B2B service design, revenue planning.",
  },
  {
    id: "postcraft",
    name: "PostCraft",
    what: "AI copy for Pakistani SMEs across WhatsApp, Instagram, Facebook and Daraz listings — validated before building.",
    stack: ["AI content", "Validation-first"],
    proves: "Marketing plus product, validate-first thinking.",
  },
  {
    id: "coreops",
    name: "CoreOps",
    what: "Modular SME software — bookkeeping, inventory, CRM, invoicing, HR — at 90–95% below traditional ERP cost, with a 7-page proposal.",
    stack: ["Strategy", "Pricing", "Market sizing"],
    proves: "Strategy, pricing and market sizing.",
  },
];

export const servicesIntro = {
  eyebrow: "Services",
  heading: ["What I can", "build for you."],
  note: "Every offer is backed by something already shipped.",
  cta: "Tell me what you want built",
};

export const services = [
  {
    title: "Custom microSaaS builds",
    body: "A working, deployed web app with auth, database and a polished UI — without hiring a full dev team.",
    proof: ["fulfilliq", "restockiq"],
  },
  {
    title: "AI-powered tools",
    body: "Apps that read documents, generate plans or give recommendations using the Claude API.",
    proof: ["studyforge", "nurtureai", "kahwa"],
  },
  {
    title: "Business automations",
    body: "WhatsApp, lead handling and workflow automation on n8n, so the busywork runs itself.",
    proof: ["realflow"],
  },
];

export const aboutIntro = {
  eyebrow: "About",
  heading: ["Marketing brain,", "builder's hands."],
  pitch: [
    "I'm Umer, a BBA Marketing student at Lahore School of Economics with minors in Data Analytics and Mathematics. Since mid-2025 I've been building with AI every day, and turned that into a habit of shipping.",
    "I understand both sides of a product — why people buy it and how it gets built. That's the gap between marketing and engineering most teams struggle to fill.",
  ],
};

export const stats = [
  { value: "5", label: "Products shipped" },
  { value: "4", label: "Experiments & side projects" },
  { value: "550K+", label: "PKR raised for Rizq LSE" },
  { value: "Daily", label: "Building with AI since mid-2025" },
];

export const education = {
  degree: "BBA, Lahore School of Economics",
  detail: "Major in Marketing · Minors in Data Analytics and Mathematics · Expected May 2027",
  coursework: [
    { area: "Marketing", courses: "Industrial (B2B) Marketing, Consumer Behaviour, Advertising" },
    { area: "Data & quant", courses: "Time Series Analysis, Research Methods, Data Analytics & Mathematics minors" },
    { area: "Business & ops", courses: "Operations Management, Entrepreneurship & SME Management, Cost Accounting" },
    { area: "Finance", courses: "Working Capital Management, Intro to Capital Markets, Banking" },
  ],
  thesis:
    "How AI disclosure in social media ads (Instagram vs TikTok) affects perceived authenticity and purchase intention among Pakistani Gen Z, with AI literacy as a moderator.",
  applied: [
    "Toyota statistical quality analysis in Minitab",
    "Pakistan auto industry time series forecast",
    "Operations site study at Shahkam Industries",
    "Five-year PSX performance report",
  ],
};

export const process = {
  intro:
    "I build AI-first: I design the product and the logic, and Claude Code is my engineering partner. That's why I ship in days, not months.",
  steps: [
    { title: "Find the real problem", body: "Start from an operational pain I've seen or researched, not a feature list." },
    { title: "Write the spec", body: "Data model, screens, core logic, design tokens and seed data before any code." },
    { title: "Build with Claude Code", body: "Core flow working first, polish and animation last." },
    { title: "Control the economics", body: "Rate limits, stateless designs or caps so a public demo doesn't burn API credits." },
    { title: "Ship and share", body: "Deploy on Vercel, then document the build publicly on LinkedIn." },
  ],
};

export const stack = [
  { category: "Build", tools: ["Claude Code", "React", "Vite", "Tailwind CSS", "Lovable"] },
  { category: "Backend & hosting", tools: ["Supabase", "Vercel"] },
  { category: "AI", tools: ["Claude API", "Gemini", "ElevenLabs"] },
  { category: "Automation", tools: ["n8n", "WhatsApp Business API", "Apify"] },
  { category: "Creative", tools: ["Canva AI", "Higgsfield"] },
  { category: "Analysis", tools: ["Excel", "Minitab", "Time series", "Statistics"] },
];

export const credentials = {
  certifications: ["Anthropic — Claude 101", "Anthropic — Claude Code 101"],
  learning: "Building AI literacy daily since mid-2025; accounting and finance courses on Coursera.",
};

export const contactIntro = {
  eyebrow: "Let's Build",
  heading: ["Tell me what you", "want built."],
  body: "A microSaaS, an internal tool or an AI automation — send the problem and I'll reply with how I'd build it. WhatsApp is fastest.",
  signoff: "Designed & built with Claude Code.",
};
