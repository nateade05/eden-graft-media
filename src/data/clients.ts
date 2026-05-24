// ─── Credibility strip — brands we've worked with ────────────────────────────
// Add new clients by appending to this array.
// logoSrc: place image in /public/assets/clients/

export type Client = {
  id: string;
  name: string;
  logoSrc: string;
  sizeClass?: string;
};

export const clients: Client[] = [
  { id: "charles-keith", name: "Charles & Keith", logoSrc: "/assets/clients/charles-keith.png", sizeClass: "h-4" },
  { id: "sony",          name: "Sony",            logoSrc: "/assets/clients/sony.png",          sizeClass: "h-5" },
  { id: "puma",          name: "Puma",            logoSrc: "/assets/clients/puma.png",          sizeClass: "h-9" },
  { id: "bmg",           name: "BMG",             logoSrc: "/assets/clients/bmg.png" },
  { id: "ralph-lauren",  name: "Ralph Lauren",    logoSrc: "/assets/clients/ralph-lauren.png",  sizeClass: "h-9" },
  { id: "don-julio",     name: "Don Julio",       logoSrc: "/assets/clients/don-julio.png" },
  { id: "illvzn",        name: "ILLVZN",          logoSrc: "/assets/clients/illvzn.webp" },
  { id: "bevknight",     name: "Bev Knight",      logoSrc: "/assets/clients/bevknight.png" },
  { id: "cmc",           name: "CMC",             logoSrc: "/assets/clients/cmc.webp" },
];
