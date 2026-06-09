const swatches = [
  { token: "brand-blush",    hex: "#FFF0F0", label: "Blush",    dark: false },
  { token: "brand-pink",     hex: "#FFCCCC", label: "Pink",     dark: false },
  { token: "brand-rose",     hex: "#E8847E", label: "Rose",     dark: false },
  { token: "brand-burgundy", hex: "#8B3A3A", label: "Burgundy", dark: true  },
  { token: "brand-sage",     hex: "#A8C0A8", label: "Sage",     dark: false },
  { token: "brand-mist",     hex: "#8090A8", label: "Mist",     dark: false },
  { token: "brand-cream",    hex: "#F7F6F2", label: "Cream",    dark: false },
  { token: "brand-sand",     hex: "#F5F2ED", label: "Sand",     dark: false },
  { token: "brand-stone",    hex: "#D0CFC8", label: "Stone",    dark: false },
  { token: "brand-gold",     hex: "#C9A96E", label: "Gold",     dark: false },
  { token: "brand-ember",    hex: "#C8371A", label: "Ember",    dark: true  },
  { token: "brand-dark",     hex: "#1A1612", label: "Dark",     dark: true  },
  { token: "brand-ink",      hex: "#0A0A0A", label: "Ink",      dark: true  },
];

export default function PalettePage() {
  return (
    <main style={{ background: "#F7F6F2", minHeight: "100vh", padding: "48px 40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0A0A0A", marginBottom: 40, opacity: 0.5 }}>
        Brand Colour Tokens
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
        {swatches.map(({ token, hex, label, dark }) => (
          <div key={token} style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ background: hex, height: 100 }} />
            <div style={{ background: "#fff", padding: "12px 14px" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{label}</p>
              <p style={{ fontSize: 11, color: "#888", margin: "3px 0 0", fontFamily: "monospace" }}>{hex}</p>
              <p style={{ fontSize: 10, color: "#bbb", margin: "2px 0 0", fontFamily: "monospace" }}>{token}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
