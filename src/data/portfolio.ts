// ─── Portfolio items ──────────────────────────────────────────────────────────
// To add new work: drop the file into public/assets/portfolio/ (images) or
// public/assets/videos/portfolio/ (videos), then add an entry below.
//
// Fields:
//   id       – unique slug
//   type     – "image" | "video"
//   src      – path from /public (e.g. "/assets/portfolio/ck-bag.jpg")
//   client   – brand name shown on hover
//   tags     – used for filtering; pick from the TAGS list below
//   aspect   – "portrait" | "landscape" | "square" (drives grid sizing)

export type PortfolioItem = {
  id: string;
  type: "image" | "video";
  src: string;
  client: string;
  tags: string[];
  aspect: "portrait" | "landscape" | "square";
  description?: string;
};

// Available filter tags — add new ones freely
export const TAGS = [
  "All",
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Product",
  "Campaign",
  "Video",
] as const;

export const portfolioItems: PortfolioItem[] = [
  {
    id: "graft-clip-01",
    type: "video",
    src: "/assets/videos/portfolio/clip-01.mp4",
    client: "Graft Media",
    tags: ["Fashion", "Campaign", "Video"],
    aspect: "portrait",
    description: "Fashion — editorial campaign",
  },
  {
    id: "graft-clip-02",
    type: "video",
    src: "/assets/videos/portfolio/clip-02.mp4",
    client: "Graft Media",
    tags: ["Fashion", "Campaign", "Video"],
    aspect: "landscape",
    description: "Fashion — campaign visual",
  },
  {
    id: "graft-clip-03",
    type: "video",
    src: "/assets/videos/portfolio/clip-03.mp4",
    client: "Graft Media",
    tags: ["Lifestyle", "Campaign", "Video"],
    aspect: "landscape",
    description: "Lifestyle — motion campaign",
  },
  {
    id: "graft-clip-04",
    type: "video",
    src: "/assets/videos/portfolio/clip-04.mp4",
    client: "Graft Media",
    tags: ["Campaign", "Video"],
    aspect: "square",
    description: "Campaign — character study",
  },
  {
    id: "graft-clip-05",
    type: "video",
    src: "/assets/videos/portfolio/clip-05.mp4",
    client: "Graft Media",
    tags: ["Product", "Fashion", "Video"],
    aspect: "portrait",
    description: "Product — footwear campaign",
  },
  {
    id: "graft-clip-06",
    type: "video",
    src: "/assets/videos/portfolio/clip-06.mp4",
    client: "Graft Media",
    tags: ["Product", "Video"],
    aspect: "landscape",
    description: "Product — object study",
  },
  {
    id: "graft-clip-07",
    type: "video",
    src: "/assets/videos/portfolio/clip-07.mp4",
    client: "Graft Media",
    tags: ["Beauty", "Lifestyle", "Video"],
    aspect: "landscape",
    description: "Beauty — floral campaign",
  },
  {
    id: "graft-clip-08",
    type: "video",
    src: "/assets/videos/portfolio/clip-08.mp4",
    client: "Graft Media",
    tags: ["Campaign", "Video"],
    aspect: "landscape",
    description: "Campaign — character hero",
  },
  {
    id: "graft-clip-09",
    type: "video",
    src: "/assets/videos/portfolio/clip-09.mp4",
    client: "Graft Media",
    tags: ["Lifestyle", "Campaign", "Video"],
    aspect: "square",
    description: "Lifestyle — narrative campaign",
  },
  {
    id: "graft-clip-10",
    type: "video",
    src: "/assets/videos/portfolio/clip-10.mp4",
    client: "Graft Media",
    tags: ["Fashion", "Campaign", "Video"],
    aspect: "landscape",
    description: "Fashion — movement study",
  },
  {
    id: "graft-clip-11",
    type: "video",
    src: "/assets/videos/portfolio/clip-11.mp4",
    client: "Graft Media",
    tags: ["Beauty", "Video"],
    aspect: "portrait",
    description: "Beauty — hero visual",
  },
  {
    id: "graft-clip-12",
    type: "video",
    src: "/assets/videos/portfolio/clip-12.mp4",
    client: "Graft Media",
    tags: ["Lifestyle", "Video"],
    aspect: "landscape",
    description: "Lifestyle — brand world",
  },
  {
    id: "graft-clip-13",
    type: "video",
    src: "/assets/videos/portfolio/clip-13.mp4",
    client: "Graft Media",
    tags: ["Campaign", "Video"],
    aspect: "landscape",
    description: "Campaign — full suite",
  },
  // ── Add client campaign images below as they come in ──────────────────────
  // Example:
  // {
  //   id: "ck-ss25-bag",
  //   type: "image",
  //   src: "/assets/portfolio/ck-ss25-bag.jpg",
  //   client: "Charles & Keith",
  //   tags: ["Fashion", "Product", "Campaign"],
  //   aspect: "portrait",
  //   description: "SS25 Quilted Bag Campaign",
  // },
];
