/**
 * ✨ Curve Gather & Shatter Background
 * Vệt cong phát sáng gom công thức toán / mã nguồn & vỡ thành hạt bụi.
 * Hỗ trợ:
 *   - Tùy chọn ký tự biến đổi ngẫu nhiên liên tục khi đang bay (Matrix morphing effect)
 *   - Điều chỉnh tốc độ thay đổi ký tự
 *   - Dark/Light Theme tự động
 *   - F11 Zen Mode
 */
(function (window, document) {
  if (window.__curveGatherInstance) return;

  // --- 1. KHO KÝ TỰ & MÃ NGUỒN ---
  const GLYPHS = [
    "∂", "∇", "∫", "∬", "∭", "∮", "∑", "∏", "√", "∞", "≈", "≠", "±", "≤", "≥",
    "≡", "∝", "∴", "∵", "⊕", "⊗", "∥", "⊥", "∠", "⇒", "⇔", "→", "←", "↔",
    "∀", "∃", "∄", "¬", "∧", "∨", "∈", "∉", "∪", "∩", "⊂", "⊆", "∅", "ℝ", "ℂ", "ℕ", "ℤ", "ℚ",
    "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "π", "ρ", "σ", "τ",
    "υ", "φ", "χ", "ψ", "ω", "Γ", "Δ", "Θ", "Λ", "Ξ", "Π", "Σ", "Φ", "Ψ", "Ω",
    "ħ", "ℏ", "ℓ", "c", "G", "k_B", "r_s", "M_☉", "ε₀", "μ₀", "x̂", "p̂", "Ĥ",
    "{}", "[]", "()", "<>", "=>", "->", "::", "!=", "==", "&&", "||", "++", "--", "<<", ">>",
    "0", "1", "0x0", "0xFF", "NULL", "nil", "i++", "&p", "*p", "#!", "$?", "~/"
  ];

  const EQUATIONS = [
    "E=mc²", "E = hν", "λ = h/p", "F = dp/dt", "F = ma", "H = T + V", "L = T - V",
    "F = G·m₁m₂/r²", "PV = nRT", "ΔS ≥ 0", "S = k·ln(Ω)", "r_s = 2GM/c²",
    "v_e = √(2GM/r)", "∇²φ = 4πGρ", "∇·E = ρ/ε₀", "∇·B = 0", "∇×E = -∂B/∂t",
    "∇×B = μ₀J + μ₀ε₀∂E/∂t", "∮ B·dl = 0", "∂ψ/∂t = Ĥψ", "iℏ∂ψ/∂t = Ĥψ", "Ĥ|ψ⟩ = E|ψ⟩",
    "[x̂, p̂] = iℏ", "Δx·Δp ≥ ℏ/2", "|ψ⟩ = α|0⟩ + β|1⟩", "E_n = ℏω(n + ½)",
    "R_μν - ½g_μνR = 8πGT_μν", "G_μν + Λg_μν = 8πT_μν", "ds² = -(1-2M/r)dt²",
    "dτ² = dt² - dx²", "T_H = ℏc³/8πGMk_B", "S_BH = k_B c³A/4Għ",
    "Γ^λ_μν = ½g^λσ(∂μg_σν+∂νg_σμ-∂σg_μν)", "∫ e^(-x²) dx = √π", "∫₀^∞ e^(-x) dx = 1",
    "∑ 1/n² = π²/6", "∑ xⁿ/n! = eˣ", "e^(iπ) + 1 = 0", "lim x→0 (sin x)/x = 1",
    "d/dx(eˣ) = eˣ", "Γ(n) = (n-1)!", "ζ(s) = ∑ 1/nˢ", "det(A - λI) = 0", "A·v = λ·v",
    "‖x‖ = √(x·x)", "a² + b² = c²", "x = (-b ± √(b²-4ac))/2a", "∇f = (∂f/∂x, ∂f/∂y)",
    "P(A|B) = P(B|A)P(A)/P(B)", "σ² = E[(X-μ)²]", "H(X) = -∑ p·log p", "∀ε>0 ∃δ>0",
    "O(n log n)", "f(x) = ∑ aₙxⁿ", "∫ f dμ", "sin²θ + cos²θ = 1", "tan θ = sin θ / cos θ",
    "V = IR", "P = IV", "c = λν", "Q = mcΔT", "ΔG = ΔH - TΔS", "pH = -log[H⁺]"
  ];

  const DEFAULT_CODE = [
    "def __init__(self):", "import sys, math", "class DesktopPet(Widget):",
    "self.drag_pos = event.globalPos()", "sys.exit(app.exec_())", "pet.show()",
    "self.timer.start(16)", "while True:", "yield singularity", "return None",
    "async def pull():", "lambda x: x*x", "def forward(self, x):", "for i in range(n):",
    "if __name__ == '__main__':", "import numpy as np", "from typing import List",
    "with open(path) as fh:", "@property", "raise NotImplementedError",
    "const [a, b] = await Promise.all(t)", "export default function App()",
    "document.querySelector('#root')", "useEffect(() => {}, [])", "JSON.parse(raw)",
    "ptr = malloc(sizeof(void*))", "int main(int argc, char **argv)", "#include <stdio.h>",
    "free(ptr); ptr = NULL;", "return EXIT_SUCCESS;", "#pragma once", "std::vector<int> v;",
    "fn main() -> Result<()>", "let mut x = 0u32;", "func main() {",
    "go func() { ch <- 1 }()", "&ptr->next", "*(int *)p", "x << 3 | y >> 1",
    "0x7FFF8000", "0xDEADBEEF", "0xCAFEBABE", "0x00FF00", "0b10110010",
    "#!/usr/bin/env bash", "set -euo pipefail", "export PATH=$PATH:/usr/local/bin",
    "docker build -t app .", "docker compose up -d", "kubectl get pods -A"
  ];

  const CODE = (Array.isArray(window.CODE) && window.CODE.length > 0) ? window.CODE : DEFAULT_CODE;
  const TEXT_MIX = { glyph: 0.32, equation: 0.28, code: 0.40 };

  function pickText() {
    const r = Math.random() * (TEXT_MIX.glyph + TEXT_MIX.equation + TEXT_MIX.code);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    if (r < TEXT_MIX.glyph) return { text: pick(GLYPHS), isFormula: true, type: "glyph" };
    if (r < TEXT_MIX.glyph + TEXT_MIX.equation) return { text: pick(EQUATIONS), isFormula: true, type: "equation" };
    return { text: pick(CODE), isFormula: false, type: "code" };
  }

  // --- 2. BẢNG MÀU SÁNG / TỐI ---
  const THEME_PRESETS = {
    dark: {
      backgroundColor: "#030712",
      starColor: "#ffffff",
      textFormulaColor: "224, 242, 254",
      textCodeColor: "203, 213, 225",
      textPathColor: "224, 242, 254",
      trailCyan: "125, 211, 252",
      trailWhite: "226, 240, 255",
      arcOuterGlow: "rgba(56, 189, 248, 0.9)",
      arcOuterFill: "rgba(255, 255, 255, 0.88)",
      arcCoreGlow: "rgba(224, 242, 254, 0.9)",
      arcCoreFill: "#ffffff",
      arcWisps: "rgba(186, 230, 253, 0.28)",
      haloColor: "125, 211, 252",
      palette: ["#ffffff", "#bae6fd", "#7dd3fc"]
    },
    light: {
      backgroundColor: "#f8fafc",
      starColor: "#475569",
      textFormulaColor: "30, 41, 59",
      textCodeColor: "71, 85, 105",
      textPathColor: "99, 102, 241",
      trailCyan: "79, 70, 229",
      trailWhite: "99, 102, 241",
      arcOuterGlow: "rgba(99, 102, 241, 0.85)",
      arcOuterFill: "rgba(67, 56, 202, 0.9)",
      arcCoreGlow: "rgba(79, 70, 229, 0.8)",
      arcCoreFill: "#312e81",
      arcWisps: "rgba(99, 102, 241, 0.35)",
      haloColor: "165, 180, 252",
      palette: ["#312e81", "#4338ca", "#6366f1"]
    }
  };

  // --- 3. CẤU HÌNH THÔNG SỐ HIỆU ỨNG ---
  const DEFAULT_CONFIG = {
    // Tùy chọn đổi ký tự liên tục
    randomizeOnFlight: true,   // true = ký tự biến đổi liên tục khi đang bay
    randomizeInterval: 8,       // Số frame giữa mỗi lần đổi (càng nhỏ càng nhanh giật, vd: 3-5 = siêu nhanh; 15-20 = chậm rãi)
    
    textCount: 250,       // Số ký tự / công thức đang bay vào
    sparkCount: 50,      // Số vệt sáng mảnh (tạo cảm giác dòng chảy dày đặc)
    streamSpeed: 1.5,     // Tốc độ dòng chảy
    // Đường bay phía sau chữ
    //   "path" : đường mảnh từ điểm xuất phát tới chỗ chữ đang bay (theo đúng quỹ đạo cong)
    //   "full" : vẽ cả đoạn còn lại tới điểm đích trên vệt cong (phần phía trước mờ hơn)
    //   "none" : tắt hẳn
    textTrail: "full",
    textTrailWidth: 0.1,  // Độ dày đường bay (px)
    textTrailAlpha: 0.2,  // Độ đậm tối đa của đường bay
    // Hướng dòng chảy
    //   "rtl"    : từ phải qua trái (mặc định)
    //   "ltr"    : từ trái qua phải (vệt cong tự lật sang bên phải)
    //   "radial" : từ mọi phía (ngoài) vào trong - tự dùng vòng tròn đặt giữa màn hình
    direction: "radial",
    radialAnchorX: 0.5,   // Vị trí tâm vòng khi direction = "radial" (theo chiều rộng)
    // Vệt cong
    //   arcSpan = Math.PI  -> vòng tròn khép kín
    //   arcSpan < Math.PI  -> cung hở (0.85 = vệt trăng khuyết như bản trước)
    arcSpan: Math.PI,     // Độ dài cung (radian, mỗi bên). Math.PI = vòng tròn đầy đủ
    arcRadius: 0.3,       // Bán kính theo chiều cao màn hình (vòng tròn ~0.3, cung hở ~0.36)
    arcAnchorX: 0.2,     // Cung hở: vị trí điểm lồi nhất. Vòng tròn: vị trí TÂM vòng (theo chiều rộng)
    arcAnchorY: 0.5,      // Vị trí theo chiều cao
    arcTilt: 0,       // Độ nghiêng (radian) - chỉ dùng cho cung hở
    arcWidth: 15,          // Độ dày tối đa của vệt (px)
    arcTargetSpread: 0.65,  // Cung hở: độ trải điểm đích dọc vệt (nhỏ = dồn về giữa)
    ringTargetSpread: 2.4,  // Vòng tròn: độ trải điểm đích quanh vòng (1.35 ≈ 72% dồn nửa trái, 2.4 ≈ đều cả vòng)
    // Vỡ hạt
    burstMin: 10,          // Số hạt tối thiểu khi 1 ký tự vỡ
    burstMax: 100,         // Số hạt tối đa
    burstSpeed: 1.0,      // Hệ số tốc độ tán xạ của hạt
    burstLife: 2.5,       // Hệ số thời gian sống của hạt (lớn hơn = tan chậm hơn)
    maxParticles: 4000,   // Giới hạn hạt cùng lúc (vòng đệm)
    // Hiển thị nền
    opacity: 0.8,              // Độ đậm của hiệu ứng (0 → 1). Nền tối bên dưới vẫn giữ nguyên, chỉ chữ/vệt/hạt mờ đi
    zIndex: -10,                 // Lớp xếp chồng. 0 = nằm trên nội dung không định vị; -1 = nằm sau toàn bộ nội dung
    backgroundColor: "#030712", // Màu nền vũ trụ
    enableF11Zen: true    // Bật chế độ F11 xem toàn màn hình
  };

  const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.CURVE_CONFIG || {});
  const TAU = Math.PI * 2;
  const ARC_SAMPLES = 512;
  const BIN_COUNT = 64;

  class CurveGatherBackground {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.time = 0;
      this.lastTs = 0;

      this.isDark = this.checkIsDark();
      this.theme = this.isDark ? THEME_PRESETS.dark : THEME_PRESETS.light;

      this.arcPts = [];
      this.heat = new Float32Array(BIN_COUNT);

      this.textParticles = [];
      this.sparks = [];
      this.stars = [];

      const N = CONFIG.maxParticles;
      this.px = new Float32Array(N);
      this.py = new Float32Array(N);
      this.pvx = new Float32Array(N);
      this.pvy = new Float32Array(N);
      this.plife = new Float32Array(N);
      this.pmax = new Float32Array(N);
      this.psize = new Float32Array(N);
      this.pcol = new Uint8Array(N);
      this.pCursor = 0;

      this._a = { x: 0, y: 0 };
      this._b = { x: 0, y: 0 };
      this._c = { x: 0, y: 0 };
      this._d = { x: 0, y: 0, nx: 0, ny: 0 };
      this.flowDir = "rtl";
      this.arcClosed = false;
      this.arcCenter = { x: 0, y: 0 };

      this.initDOM();
      this.handleResize();
      this.createParticles();
      this.bindEvents();
      this.startLoop();
    }

    checkIsDark() {
      return document.documentElement.classList.contains("dark") ||
             document.body.classList.contains("dark") ||
             (!("theme" in localStorage) && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    updateTheme() {
      this.isDark = this.checkIsDark();
      this.theme = this.isDark ? THEME_PRESETS.dark : THEME_PRESETS.light;
      if (this.viewport) {
        this.viewport.style.backgroundColor = this.theme.backgroundColor;
      }
    }

    initDOM() {
      const style = document.createElement("style");
      style.innerHTML = `
        #curve-viewport {
          position: fixed !important;
          top: 0 !important; left: 0 !important;
          width: 100vw !important; height: 100dvh !important;
          background-color: ${this.theme.backgroundColor} !important;
          z-index: ${CONFIG.zIndex} !important;
          pointer-events: none !important;
          overflow: hidden !important;
          transition: background-color 0.3s ease;
        }
        #curve-canvas { display: block; width: 100%; height: 100%; opacity: ${CONFIG.opacity}; }

        html.zen-mode, body.zen-mode {
          overflow: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html.zen-mode::-webkit-scrollbar, body.zen-mode::-webkit-scrollbar {
          display: none !important; width: 0 !important; height: 0 !important;
        }
        body.zen-mode header,
        body.zen-mode #layout-body,
        body.zen-mode #sidebar-expand-btn,
        body.zen-mode .fixed:not(#curve-viewport):not(#cg-zen-toast) {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          transition: opacity 0.3s ease, visibility 0.3s ease !important;
        }
        body.zen-mode #curve-canvas {
          opacity: 1 !important;
        }
        #cg-zen-toast {
          position: fixed; top: 2rem; left: 50%;
          transform: translateX(-50%); z-index: 999999;
          background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #f8fafc; font-size: 0.85rem; font-family: system-ui, sans-serif;
          padding: 0.5rem 1.25rem; border-radius: 9999px;
          pointer-events: none; opacity: 0; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          transition: opacity 0.4s ease;
        }
      `;
      document.head.appendChild(style);

      this.viewport = document.createElement("div");
      this.viewport.id = "curve-viewport";

      this.canvas = document.createElement("canvas");
      this.canvas.id = "curve-canvas";
      this.ctx = this.canvas.getContext("2d", { alpha: false });

      this.viewport.appendChild(this.canvas);
      document.body.prepend(this.viewport);
    }

    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      this.buildArc();
      this.createStars();
    }

    buildArc() {
      const W = this.width, H = this.height;
      const mobile = W <= 768;
      const dir = CONFIG.direction;
      this.flowDir = dir === "ltr" || dir === "radial" ? dir : "rtl";
      const radial = this.flowDir === "radial";
      const span = radial ? Math.PI : Math.min(CONFIG.arcSpan, Math.PI);
      const closed = span >= Math.PI - 1e-3;
      this.arcClosed = closed;

      let R = H * CONFIG.arcRadius * (mobile ? 0.83 : 1);
      const ay = H * CONFIG.arcAnchorY;
      let ax;
      if (closed) {
        R = Math.min(R, W * (mobile ? 0.36 : 0.5));
        const cxFrac = radial ? (mobile ? 0.5 : CONFIG.radialAnchorX) : (mobile ? 0.45 : CONFIG.arcAnchorX);
        ax = W * cxFrac - R;
      } else {
        ax = W * (mobile ? 0.3 : CONFIG.arcAnchorX);
      }
      const tilt = closed ? 0 : CONFIG.arcTilt;
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt);

      this.arcCenter = { x: ax + R * cosT, y: ay + R * sinT };

      this.arcPts = [];
      for (let i = 0; i <= ARC_SAMPLES; i++) {
        const u = i / ARC_SAMPLES;
        const th = Math.PI + (u - 0.5) * 2 * span;
        const rx = R + R * Math.cos(th);
        const ry = R * Math.sin(th);
        this.arcPts.push({
          x: ax + rx * cosT - ry * sinT,
          y: ay + rx * sinT + ry * cosT,
          nx: Math.cos(th + tilt),
          ny: Math.sin(th + tilt)
        });
      }

      if (this.flowDir === "ltr") {
        for (const pt of this.arcPts) { pt.x = W - pt.x; pt.nx = -pt.nx; }
        this.arcCenter.x = W - this.arcCenter.x;
      }
    }

    rayExit(x, y, dx, dy) {
      let d = Infinity;
      if (dx > 1e-6) d = Math.min(d, (this.width - x) / dx);
      else if (dx < -1e-6) d = Math.min(d, -x / dx);
      if (dy > 1e-6) d = Math.min(d, (this.height - y) / dy);
      else if (dy < -1e-6) d = Math.min(d, -y / dy);
      return Math.max(0, d);
    }

    arcLerp(u, out) {
      const f = Math.max(0, Math.min(ARC_SAMPLES, u * ARC_SAMPLES));
      const i = Math.min(ARC_SAMPLES - 1, Math.floor(f));
      const m = f - i;
      const a = this.arcPts[i], b = this.arcPts[i + 1];
      out.x = a.x + (b.x - a.x) * m;
      out.y = a.y + (b.y - a.y) * m;
      out.nx = a.nx + (b.nx - a.nx) * m;
      out.ny = a.ny + (b.ny - a.ny) * m;
      return out;
    }

    arcAt(u) {
      return this.arcPts[Math.max(0, Math.min(ARC_SAMPLES, Math.round(u * ARC_SAMPLES)))];
    }

    createStars() {
      this.stars = [];
      const n = Math.floor((this.width * this.height) / 14000);
      for (let i = 0; i < n; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          r: Math.random() * 1.1 + 0.3,
          ph: Math.random() * TAU,
          sp: 0.5 + Math.random() * 1.5
        });
      }
    }

    createParticles() {
      this.textParticles = [];
      for (let i = 0; i < CONFIG.textCount; i++) this.textParticles.push(this.spawnTextParticle(true));
      this.sparks = [];
      for (let i = 0; i < CONFIG.sparkCount; i++) this.sparks.push(this.spawnSpark(true));
    }

    pickTargetU() {
      if (this.flowDir === "radial") return Math.random();
      const g = (Math.random() + Math.random() + Math.random()) / 3;
      if (this.arcClosed) {
        const u = 0.5 + (g - 0.5) * CONFIG.ringTargetSpread;
        return u - Math.floor(u);
      }
      return Math.min(0.97, Math.max(0.03, 0.5 + (g - 0.5) * CONFIG.arcTargetSpread));
    }

    spawnTextParticle(initial = false) {
      const u = this.pickTargetU();
      const pick = pickText();
      const p = {
        text: pick.text,
        type: pick.type,
        u,
        t: initial ? Math.random() : 0,
        speed: (0.0016 + Math.random() * 0.0026) * CONFIG.streamSpeed,
        wobble: (Math.random() - 0.5) * 0.7,
        fontSize: Math.floor(10 + Math.random() * 8),
        opacity: Math.random() * 0.8 + 0.2,
        isFormula: pick.isFormula,
        // Bộ đếm chu kỳ đổi ký tự ngẫu nhiên
        morphFrame: Math.floor(Math.random() * Math.max(1, CONFIG.randomizeInterval))
      };
      return this.setupFlow(p, 0.85, 0.45);
    }

    setupFlow(p, base, range) {
      const tg = this.arcAt(p.u);
      const W = this.width;
      if (this.flowDir === "radial") {
        const ang = Math.atan2(tg.ny, tg.nx) + (Math.random() - 0.5) * 0.5;
        p.ax = Math.cos(ang); p.ay = Math.sin(ang);
        p.px = -p.ay; p.py = p.ax;
        p.Q = (Math.random() - 0.5) * this.height * 0.05;
        p.L = Math.max(140, this.rayExit(tg.x, tg.y, p.ax, p.ay) * (1.0 + Math.random() * 0.45));
      } else {
        const sgn = this.flowDir === "ltr" ? -1 : 1;
        const f = W * (base + Math.random() * range);
        const sx = sgn === 1 ? f : W - f;
        p.ax = sgn; p.ay = 0; p.px = 0; p.py = 1;
        p.L = Math.max(60, (sx - tg.x) * sgn);
        p.Q = (tg.y - this.height * CONFIG.arcAnchorY) * 1.5 + (Math.random() - 0.5) * this.height * 0.3;
      }
      return p;
    }

    spawnSpark(initial = false) {
      const u = this.pickTargetU();
      const p = {
        u,
        t: initial ? Math.random() : 0,
        speed: (0.002 + Math.random() * 0.004) * CONFIG.streamSpeed,
        wobble: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 1.2 + 0.5,
        cyan: Math.random() < 0.3
      };
      return this.setupFlow(p, 0.8, 0.55);
    }

    flowPos(p, t, out) {
      const tg = this.arcPts[Math.round(p.u * ARC_SAMPLES)];
      const e = t * (0.65 + 0.35 * t);
      const along = p.L * (1 - e);
      const spread = Math.pow(1 - e, 1.35);
      const amp = 34 * e * (1 - e);
      const sway = Math.sin(e * 5 + (tg.x + tg.y) * 0.006 + this.time * 0.9 + p.wobble * 0.8);
      const perp = p.Q * spread + sway * amp;
      out.x = tg.x + p.ax * along + p.px * perp;
      out.y = tg.y + p.ay * along + p.py * perp;
    }

    hit(u, amount) {
      const i = Math.floor(u * (BIN_COUNT - 1));
      const h = this.heat;
      h[i] = Math.min(1.6, h[i] + amount);
      if (i > 0) h[i - 1] = Math.min(1.6, h[i - 1] + amount * 0.5);
      if (i < BIN_COUNT - 1) h[i + 1] = Math.min(1.6, h[i + 1] + amount * 0.5);
    }

    heatAt(u) {
      const f = u * (BIN_COUNT - 1);
      const i = Math.floor(f), j = Math.min(BIN_COUNT - 1, i + 1);
      const m = f - i;
      return this.heat[i] * (1 - m) + this.heat[j] * m;
    }

    emit(x, y, nx, ny, power) {
      const N = CONFIG.maxParticles;
      const i = this.pCursor;
      this.pCursor = (i + 1) % N;

      const base = Math.atan2(ny, nx);
      const ang = Math.random() < 0.7
        ? base + (Math.random() + Math.random() + Math.random() - 1.5) * 2.0
        : Math.random() * TAU;
      const sp = (0.25 + Math.pow(Math.random(), 2) * 3.6) * power * CONFIG.burstSpeed;

      this.px[i] = x;
      this.py[i] = y;
      this.pvx[i] = Math.cos(ang) * sp;
      this.pvy[i] = Math.sin(ang) * sp;
      const life = (45 + Math.random() * 95) * CONFIG.burstLife;
      this.plife[i] = life;
      this.pmax[i] = life;
      this.psize[i] = 0.6 + Math.pow(Math.random(), 3) * 1.8;
      const r = Math.random();
      this.pcol[i] = r < 0.55 ? 0 : r < 0.85 ? 1 : 2;
    }

    burst(p) {
      const pt = this.arcAt(p.u);
      this.hit(p.u, 0.22);
      const extra = Math.min(6, Math.floor(p.text.length / 5));
      const n = CONFIG.burstMin + Math.floor(Math.random() * (CONFIG.burstMax - CONFIG.burstMin + 1)) + extra;
      const halfW = Math.min(p.text.length * p.fontSize * 0.28, 16);

      for (let i = 0; i < n; i++) {
        this.emit(
          pt.x + (Math.random() - 0.5) * halfW * 2,
          pt.y + (Math.rando
