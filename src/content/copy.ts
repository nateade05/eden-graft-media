// ─────────────────────────────────────────────────────────────────────────────
// GRAFT MEDIA — SITE COPY
//
// Edit the string values below. Do not rename keys — they are referenced by code.
// Sections map 1:1 to the pages and components on the site.
// ─────────────────────────────────────────────────────────────────────────────

export const copy = {

  // ── Navigation ───────────────────────────────────────────────────────────────

  nav: {
    cta: "Start a project",
    links: [
      { label: "Work",    href: "#portfolio" },
      { label: "Contact", href: "#cta" },
    ],
  },


  // ── Hero (homepage) ──────────────────────────────────────────────────────────

  hero: {
    headlineLine1: "Brief in.",
    headlineLine2: "Campaign out.",
    subtitle:      "AI-powered production. Human-directed craft.",
    mobileCta:     "See the work",

    speed: {
      overline: "Speed",
      headline: "Days, not weeks. Quality, not compromise.",
      body:     "What used to require studios, casting agents, and six-week timelines now happens in days. AI handles the production. We handle the vision.",
    },

    variations: {
      overline: "Variations",
      headlineLine1: "One brief.",
      headlineLine2: "Infinite cuts.",
      body:     "12 social formats, 3 hero banners, a short-form video. One brief covers all of it. We deliver the full suite.",
    },

    outroCta: {
      prompt: "Ready to produce?",
      button: "Start a project",
    },
  },


  // ── Credibility Strip ────────────────────────────────────────────────────────

  credibility: {
    trustedByLabel: "Trusted by",
    stats: [
      { value: "48h", label: "Avg. turnaround" },
      { value: "10×", label: "Faster than a shoot" },
      { value: "∞",   label: "Format variations" },
    ],
  },


  // ── Services ─────────────────────────────────────────────────────────────────

  services: {
    overline: "What we do",
    headline: "A full creative production studio. Powered by AI.",
    phases: [
      {
        number: "01",
        name:   "Concepts",
        description: "The thinking before anything is made: direction, narrative, and the visual world your brand lives in.",
        deliverables: [
          "Creative direction",
          "Brand voice",
          "Character design",
          "Visual world-building",
        ],
      },
      {
        number: "02",
        name:   "Asset Creation",
        description: "Using AI to generate the raw material: every image, render, and visual building block your campaign needs.",
        deliverables: [
          "Character & scene renders",
          "Campaign stills",
          "Ecommerce imagery",
          "Product mockups",
          "Merch design",
          "Graphic design",
        ],
      },
      {
        number: "03",
        name:   "Campaign Production",
        description: "Static assets become motion. We produce the final content that goes live, cut, graded, and ready to perform.",
        deliverables: [
          "Short-form video",
          "Colour grading",
          "Sound design & SFX",
          "Format cuts & delivery",
        ],
      },
    ],
  },


  // ── Portfolio ────────────────────────────────────────────────────────────────

  portfolio: {
    overline: "The work",
    headline: "Built to stop the scroll.",
    caseStudies: {
      overline: "Case studies",
      headline: "See how it's made.",
      items: [
        {
          client:      "Beverley Knight",
          title:       "Tour Merch & Music Video, Built in AI",
          description: "Four merch designs, photorealistic wear mockups, and a full music video for the Systematic Overload tour — all Ai.",
        },
        {
          client:      "Charles & Keith",
          title:       "Runway Campaign, AI-Produced",
          description: "Seasonal runway campaign stills and motion assets. No shoot, no travel, no compromise.",
        },
        {
          client:      "Nike",
          title:       "A Nike Concept. Built Entirely in AI.",
          description: "Raw character design, street energy, and a concept film. No cast, no crew, no studio — just a brief and the tools.",
        },
      ],
    },
  },


  // ── Process ──────────────────────────────────────────────────────────────────

  process: {
    overline: "How it works",
    headline: "From brief to campaign, in days.",
    steps: [
      {
        number:      "01",
        title:       "Brief",
        description: "Share your product, campaign goal, and any reference that inspires you. A 30-minute call is enough. No lengthy briefs, no agency decks.",
      },
      {
        number:      "02",
        title:       "Concept",
        description: "We develop the visual direction: mood, aesthetic, and the world your product lives in. You review and sign off before a pixel is produced.",
      },
      {
        number:      "03",
        title:       "Production",
        description: "We generate, composite, and refine every asset using AI tools guided by experienced creative direction. Not prompts and hope. Deliberate craft.",
      },
      {
        number:      "04",
        title:       "Delivery",
        description: "All formats, export-ready. Stills, video, cut-downs, platform sizes. Typically 48–72 hours from sign-off. Unlimited revisions until it's right.",
      },
    ],
  },


  // ── Final CTA ────────────────────────────────────────────────────────────────

  finalCta: {
    overline:      "Let's work together",
    headlineLine1: "Your next campaign",
    headlineLine2: "starts with a brief.",
    body:          "Tell us about your product, your brand, and what you're trying to say. We'll handle the rest.",
    primaryCta:    "Start a project",
    email:         "hello@graft.media",
    footnote:      "Typical delivery 48–72 hours · All formats included · Unlimited revisions",
  },


  // ── Footer ───────────────────────────────────────────────────────────────────

  footer: {
    tagline: "AI-Led Creative Production Studio",
    socials: ["Instagram", "LinkedIn"],
  },


  // ─────────────────────────────────────────────────────────────────────────────
  // CASE STUDIES
  // ─────────────────────────────────────────────────────────────────────────────


  // ── Case Study: Beverley Knight ───────────────────────────────────────────────

  beverleyKnight: {
    hero: {
      overline: "Case study",
      headline: "Beverley Knight",
      subtitle: "Tour merch and a music video for the Systematic Overload tour — designed, rendered, and delivered entirely in AI.",
    },
    stats: [
      { value: "4", label: "Merch designs" },
      { value: "1", label: "Music video" },
      { value: "0", label: "Shoot days" },
    ],
    brief: {
      overline: "The brief",
      body:     "Beverley Knight needed a full creative suite for her Systematic Overload tour: merch designs, photorealistic wear mockups, and a music video for the title track. Every asset built in AI. No photographer, no print studio, no production crew.",
    },
    merch: {
      overline: "01. Merch Designs",
      headline: "Four designs. Zero print studio.",
      body:     "Each design built from Beverley's catalogue — her portrait and three of her most iconic song titles. Tour-ready artwork generated in AI, print-ready from day one.",
      items: [
        { label: "Portrait" },
        { label: "Everything's Gonna Be Alright" },
        { label: "Come As You Are" },
        { label: "Shoulda Woulda Coulda" },
      ],
    },
    mockups: {
      overline: "02. Wear Mockups",
      headline: "Product shoot. No product shoot.",
      body:     "AI-rendered wear mockups across four colourways and designs. Photorealistic enough to go straight to e-commerce — no model booking, no garment printing, no photography day.",
      items: [
        { design: "Portrait tee — black" },
        { design: "Shoulda Woulda Coulda — white" },
        { design: "Come As You Are — black" },
        { design: "Everything's Gonna Be Alright — white" },
      ],
    },
    film: {
      overline: "03. The Music Video",
      headline: "Systematic Overload.",
      body:     "The full music video for the tour title track. Directed, generated, and edited entirely using AI tools — every scene, every transition, every grade.",
      specs: [
        { label: "Runtime", value: "3:17" },
        { label: "Format",  value: "1920×1080, 16:9" },
        { label: "Tools",   value: "Kling AI · Runway · Premier Pro" },
      ],
    },
    cta: {
      overline:        "Start your project",
      headline:        "Brief in. Campaign out.",
      primaryButton:   "Start a project",
      secondaryButton: "View Charles & Keith",
    },
  },


  // ── Case Study: Charles & Keith ───────────────────────────────────────────────

  charlesKeith: {
    hero: {
      overline: "Case study",
      headline: "Charles & Keith",
      subtitle: "Summer Calling. A fully AI-produced runway campaign for Charles & Keith's SS26 collection.",
    },
    stats: [
      { value: "12",  label: "AI-generated looks" },
      { value: "60+", label: "Campaign stills" },
      { value: "1",   label: "Hero film" },
    ],
    brief: {
      overline: "The brief",
      body:     "Charles & Keith needed a full runway campaign for their Summer 2026 collection. Every look AI-generated from the ground up: character, styling, set, and light. No casting. No studio. No shoot days. A complete visual campaign built entirely in AI.",
    },
    direction: {
      overline: "01. Direction",
      headline: "Setting the world.",
      body:     "Before generating a single look, we established the world: light quality, set aesthetic, colour palette, and the mood the collection needed to live in. Everything built from a creative direction brief, not a prompt.",
    },
    looks: {
      overline: "02. The Looks",
      headline: "12 looks. No studio.",
      body:     "Each look built individually using AI: character generation, outfit application, lighting matching, and final grading. Iterated to match the creative direction exactly.",
    },
    stills: {
      overline: "03. Campaign Stills",
      headline: "Graded and ready.",
    },
    film: {
      overline: "04. The Film",
      headline: "Summer Calling.",
      body:     "The campaign film. Every frame AI-generated and composited, colour-graded to match the creative direction. Produced for YouTube and paid social placements.",
      specs: [
        { label: "Format", value: "1920×1080, 16:9" },
        { label: "Output", value: "YouTube, paid social" },
        { label: "Tools",  value: "Kling AI · Runway · DaVinci Resolve" },
      ],
    },
    context: {
      overline: "05. In Context",
      headline: "How it lands.",
    },
    web: {
      overline: "06. Live on the Web",
      headline: "Campaign to website. Same day.",
      body:     "The campaign assets went straight from generation into a live Charles & Keith editorial site — desktop and mobile, no reshoots, no resizing.",
    },
    cta: {
      overline:        "Start your project",
      headline:        "Your campaign. Built in AI.",
      primaryButton:   "Start a project",
      secondaryButton: "View Nike",
    },
  },


  // ── Case Study: Nike ─────────────────────────────────────────────────────────

  nike: {
    hero: {
      overline: "Case study",
      headline: "Nike",
      subtitle: "A Nike concept built entirely in AI. Raw characters, street energy, and a short film — no cast, no crew, no studio.",
    },
    stats: [
      { value: "8", label: "Character portraits" },
      { value: "1", label: "Concept film" },
      { value: "0", label: "Shoot days" },
    ],
    brief: {
      overline: "The brief",
      body:     "A proof of concept for what Nike campaign production looks like without a single real asset. We built the entire visual world from scratch — characters, environments, a concept film — using AI. No casting. No crew. No studio. Just a brief and the tools.",
    },
    concept: {
      overline: "01. The Concept",
      headline: "Street energy. No street required.",
      body1:    "The brief was to show what a Nike campaign looks like when it's built entirely in AI — not polished CGI, but raw, lived-in energy. Characters that feel like they've been somewhere. Imagery with weight to it.",
      body2:    "We worked from the brand outwards: the culture, the aesthetic codes, the kind of athlete Nike actually speaks to. Everything generated from that direction — not from a prompt, but from a point of view.",
    },
    assets: {
      overline: "02. The Assets",
      headline: "Every image, AI-built.",
      body:     "Each visual generated to feel unpolished by design. The grain, the lighting, the composition — all calibrated to look like a real shoot that wasn't supposed to surface. AI that doesn't look like AI.",
    },
    film: {
      overline: "03. The Film",
      headline: "Just Do It. No studio required.",
      body:     "The concept film brings the assets into motion. Produced entirely with AI video tools — no location, no crew, no casting.",
      specs: [
        { label: "Format", value: "720×1280, 9:16" },
        { label: "Output", value: "Social, paid, broadcast" },
        { label: "Tools",  value: "Kling AI · Runway · DaVinci Resolve" },
      ],
    },
    banner: "Built in AI. Feels like contraband.",
    cta: {
      overline:        "Start your project",
      headline:        "Brief in. Campaign out.",
      primaryButton:   "Start a project",
      secondaryButton: "View Beverley Knight",
    },
  },

};
