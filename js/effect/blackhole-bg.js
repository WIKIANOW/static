/**
 * ✨ Curve Gather & Shatter Background
 * Vệt cong phát sáng gom công thức toán / mã nguồn,
 * rồi vỡ thành các hạt bụi nhỏ bay ngẫu nhiên và tan biến.
 * Tự động gắn vào nền - Hỗ trợ F11 Zen Mode toàn màn hình
 *
 * Lưu ý: dùng thay cho blackhole-bg.js (đừng nạp cả hai cùng lúc).
 */
(function (window, document) {
  if (window.__curveGatherInstance) return;

  // --- 1. KHO KÝ TỰ: chia 3 nhóm để kiểm soát tỉ lệ hiển thị ---

  // Ký hiệu đơn (ngắn, nhiều, tạo cảm giác "bụi chữ")
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

  // Công thức toán & vật lý
  const EQUATIONS = [
    "E=mc²", "E = hν", "λ = h/p", "F = dp/dt", "F = ma", "H = T + V", "L = T - V",
    "F = G·m₁m₂/r²", "PV = nRT", "ΔS ≥ 0", "S = k·ln(Ω)", "r_s = 2GM/c²",
    "v_e = √(2GM/r)", "∇²φ = 4πGρ", "∇·E = ρ/ε₀", "∇·B = 0", "∇×E = -∂B/∂t",
    "∇×B = μ₀J + μ₀ε₀∂E/∂t", "∮ B·dl = 0",
    "∂ψ/∂t = Ĥψ", "iℏ∂ψ/∂t = Ĥψ", "Ĥ|ψ⟩ = E|ψ⟩", "[x̂, p̂] = iℏ", "Δx·Δp ≥ ℏ/2",
    "|ψ⟩ = α|0⟩ + β|1⟩", "E_n = ℏω(n + ½)",
    "R_μν - ½g_μνR = 8πGT_μν", "G_μν + Λg_μν = 8πT_μν", "ds² = -(1-2M/r)dt²",
    "dτ² = dt² - dx²", "T_H = ℏc³/8πGMk_B", "S_BH = k_B c³A/4Għ",
    "Γ^λ_μν = ½g^λσ(∂μg_σν+∂νg_σμ-∂σg_μν)",
    "∫ e^(-x²) dx = √π", "∫₀^∞ e^(-x) dx = 1", "∑ 1/n² = π²/6", "∑ xⁿ/n! = eˣ",
    "e^(iπ) + 1 = 0", "lim x→0 (sin x)/x = 1", "d/dx(eˣ) = eˣ", "Γ(n) = (n-1)!",
    "ζ(s) = ∑ 1/nˢ", "det(A - λI) = 0", "A·v = λ·v", "‖x‖ = √(x·x)", "a² + b² = c²",
    "x = (-b ± √(b²-4ac))/2a", "∇f = (∂f/∂x, ∂f/∂y)", "P(A|B) = P(B|A)P(A)/P(B)",
    "σ² = E[(X-μ)²]", "H(X) = -∑ p·log p", "∀ε>0 ∃δ>0", "ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ",
    "O(n log n)", "f(x) = ∑ aₙxⁿ", "∫ f dμ", "sin²θ + cos²θ = 1", "tan θ = sin θ / cos θ",
    "V = IR", "P = IV", "c = λν", "Q = mcΔT", "ΔG = ΔH - TΔS", "pH = -log[H⁺]"
  ];

  // Mã nguồn & lệnh (Python, JS, C/C++, Rust, Go, asm, shell, DevOps, SQL, YAML)
  const CODE = [
    // Python
    "def __init__(self):", "import sys, math", "class DesktopPet(Widget):",
    "self.drag_pos = event.globalPos()", "sys.exit(app.exec_())", "pet.show()",
    "self.timer.start(16)", "while True:", "yield singularity", "return None",
    "async def pull():", "lambda x: x*x", "def forward(self, x):", "for i in range(n):",
    "if __name__ == '__main__':", "import numpy as np", "from typing import List",
    "with open(path) as fh:", "@property", "raise NotImplementedError",
    "x = [i**2 for i in range(10)]", "np.linalg.eig(A)", "torch.no_grad()",
    "app = QApplication(sys.argv)", "self.layout.addWidget(btn)", "print('hello, world')",
    // JS / TS
    "const [a, b] = await Promise.all(t)", "export default function App()",
    "document.querySelector('#root')", "useEffect(() => {}, [])", "JSON.parse(raw)",
    "() => console.log('ok')", "npm run build", "let x: number = 0;",
    // C / C++ / Rust / Go
    "ptr = malloc(sizeof(void*))", "int main(int argc, char **argv)", "#include <stdio.h>",
    "free(ptr); ptr = NULL;", "return EXIT_SUCCESS;", "#pragma once", "std::vector<int> v;",
    "fn main() -> Result<()>", "let mut x = 0u32;", "func main() {",
    "go func() { ch <- 1 }()", "&ptr->next", "*(int *)p", "x << 3 | y >> 1",
    // Hex / binary / asm
    "0x7FFF8000", "0xDEADBEEF", "0xCAFEBABE", "0x00FF00", "0b10110010",
    "mov eax, [ebp+8]", "xor eax, eax", "jmp 0x401000", "push rbp",
    // Shell / DevOps
    "#!/usr/bin/env bash", "set -euo pipefail", "if [ -f ./.env ]; then",
    "export PATH=$PATH:/usr/local/bin", "chmod +x deploy.sh", "kill -9 $PID",
    "tail -f /var/log/syslog", "journalctl -u app -f", "systemctl restart nginx",
    "ps aux | grep python", "grep -rn 'error' ./logs", "awk '{print $1}' access.log",
    "rsync -avz ./dist/", "ssh -L 8080:localhost:80", "ping -c 4 8.8.8.8",
    "curl -sS localhost:9090/metrics", "git rebase -i HEAD~3", "git push origin main",
    "docker build -t app .", "docker compose up -d", "kubectl get pods -A",
    "helm upgrade --install app .", "terraform apply -auto-approve",
    "ansible-playbook site.yml", "cat /proc/cpuinfo",
    // YAML / Dockerfile / HTTP / SQL
    "apiVersion: apps/v1", "kind: Deployment", "replicas: 3", "image: nginx:1.27",
    "status: Running", "FROM alpine:3.20", "EXPOSE 8080", "HTTP/1.1 200 OK",
    "uptime: 99.99%", "SELECT * FROM orders LIMIT 10;", "CREATE INDEX idx ON t(col);"
  ];

  // Tỉ lệ chọn mỗi nhóm (tổng không cần bằng 1)
  const TEXT_MIX = { glyph: 0.32, equation: 0.28, code: 0.40 };

  function pickText() {
    const r = Math.random() * (TEXT_MIX.glyph + TEXT_MIX.equation + TEXT_MIX.code);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    if (r < TEXT_MIX.glyph) return { text: pick(GLYPHS), isFormula: true };
    if (r < TEXT_MIX.glyph + TEXT_MIX.equation) return { text: pick(EQUATIONS), isFormula: true };
    return { text: pick(CODE), isFormula: false };
  }

  // --- 2. CẤU HÌNH THÔNG SỐ HIỆU ỨNG ---
  const DEFAULT_CONFIG = {
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
  // Tự động gộp cấu hình từ window.CURVE_CONFIG (nếu có)
  const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.CURVE_CONFIG || {});

  const TAU = Math.PI * 2;
  const ARC_SAMPLES = 512;
  const BIN_COUNT = 64;
  const PALETTE = ["#ffffff", "#bae6fd", "#7dd3fc"];

  class CurveGatherBackground {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.time = 0;
      this.lastTs = 0;

      this.arcPts = [];
      this.heat = new Float32Array(BIN_COUNT); // độ sáng cục bộ của vệt khi bị "va chạm"

      this.textParticles = [];
      this.sparks = [];
      this.stars = [];

      // Bể hạt bụi (struct-of-arrays, dùng vòng đệm để không cấp phát lại)
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

    initDOM() {
      const style = document.createElement("style");
      style.innerHTML = `
        #curve-viewport {
          position: fixed !important;
          top: 0 !important; left: 0 !important;
          width: 100vw !important; height: 100dvh !important;
          background-color: ${CONFIG.backgroundColor} !important;
          z-index: ${CONFIG.zIndex} !important;
          pointer-events: none !important;
          overflow: hidden !important;
          transform: translate3d(0, 0, 0) !important;
          will-change: transform !important;
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
        body.zen-mode > *:not(#curve-viewport):not(#cg-zen-toast) {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          transition: opacity 0.35s ease, visibility 0.35s ease !important;
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

    // --- 3. DỰNG VỆT CONG (bảng tra điểm + pháp tuyến) ---
    buildArc() {
      const W = this.width, H = this.height;
      const mobile = W <= 768;
      const dir = CONFIG.direction;
      this.flowDir = dir === "ltr" || dir === "radial" ? dir : "rtl";
      const radial = this.flowDir === "radial";
      const span = radial ? Math.PI : Math.min(CONFIG.arcSpan, Math.PI); // radial luôn là vòng tròn
      const closed = span >= Math.PI - 1e-3; // vòng tròn khép kín
      this.arcClosed = closed;

      let R = H * CONFIG.arcRadius * (mobile ? 0.83 : 1);
      const ay = H * CONFIG.arcAnchorY;
      let ax; // điểm trái nhất của vệt
      if (closed) {
        R = Math.min(R, W * (mobile ? 0.36 : 0.5));
        const cxFrac = radial ? (mobile ? 0.5 : CONFIG.radialAnchorX) : (mobile ? 0.45 : CONFIG.arcAnchorX);
        ax = W * cxFrac - R; // tâm vòng
      } else {
        ax = W * (mobile ? 0.3 : CONFIG.arcAnchorX);
      }
      const tilt = closed ? 0 : CONFIG.arcTilt;
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt);

      this.arcCenter = { x: ax + R * cosT, y: ay + R * sinT };

      this.arcPts = [];
      for (let i = 0; i <= ARC_SAMPLES; i++) {
        const u = i / ARC_SAMPLES;
        const th = Math.PI + (u - 0.5) * 2 * span; // u=0.5 là điểm trái nhất; vòng tròn: u=0 và u=1 gặp nhau ở mặt phải
        const rx = R + R * Math.cos(th);
        const ry = R * Math.sin(th);
        this.arcPts.push({
          x: ax + rx * cosT - ry * sinT,
          y: ay + rx * sinT + ry * cosT,
          nx: Math.cos(th + tilt), // pháp tuyến hướng ra ngoài
          ny: Math.sin(th + tilt)
        });
      }

      // Chạy từ trái qua phải: lật gương toàn bộ vệt theo chiều ngang
      if (this.flowDir === "ltr") {
        for (const pt of this.arcPts) { pt.x = W - pt.x; pt.nx = -pt.nx; }
        this.arcCenter.x = W - this.arcCenter.x;
      }
    }

    // Khoảng cách từ (x, y) theo hướng (dx, dy) tới khi ra khỏi màn hình
    rayExit(x, y, dx, dy) {
      let d = Infinity;
      if (dx > 1e-6) d = Math.min(d, (this.width - x) / dx);
      else if (dx < -1e-6) d = Math.min(d, -x / dx);
      if (dy > 1e-6) d = Math.min(d, (this.height - y) / dy);
      else if (dy < -1e-6) d = Math.min(d, -y / dy);
      return Math.max(0, d);
    }

    // Nội suy tuyến tính trên bảng điểm (dùng khi vẽ vệt để nét mượt, không bị răng cưa)
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

    // Vị trí đích trên vệt: dồn nhiều về giữa (điểm trái nhất), thưa dần ra hai bên
    // Vòng tròn: trải rộng và cuộn vòng qua mặt phải
    pickTargetU() {
      if (this.flowDir === "radial") return Math.random(); // đều khắp vòng
      const g = (Math.random() + Math.random() + Math.random()) / 3;
      if (this.arcClosed) {
        const u = 0.5 + (g - 0.5) * CONFIG.ringTargetSpread;
        return u - Math.floor(u); // cuộn vòng về [0, 1)
      }
      return Math.min(0.97, Math.max(0.03, 0.5 + (g - 0.5) * CONFIG.arcTargetSpread));
    }

    spawnTextParticle(initial = false) {
      const u = this.pickTargetU();
      const pick = pickText();
      const p = {
        text: pick.text,
        u,
        t: initial ? Math.random() : 0,
        speed: (0.0016 + Math.random() * 0.0026) * CONFIG.streamSpeed,
        wobble: (Math.random() - 0.5) * 0.7,
        fontSize: Math.floor(10 + Math.random() * 8),
        opacity: Math.random() * 0.8 + 0.2,
        isFormula: pick.isFormula
      };
      return this.setupFlow(p, 0.85, 0.45);
    }

    // Thiết lập trục tiến vào của một hạt, tuỳ theo hướng dòng chảy:
    //   (ax, ay) : vector đơn vị chỉ từ điểm đích ra phía xuất phát
    //   (px, py) : vector vuông góc (hướng lắc / xoè chùm)
    //   L        : khoảng cách xuất phát dọc trục; Q : độ lệch ngang lúc xuất phát
    setupFlow(p, base, range) {
      const tg = this.arcAt(p.u);
      const W = this.width;
      if (this.flowDir === "radial") {
        // Tia hướng tâm: đi từ ngoài màn hình vào đúng điểm đích, lệch nhẹ khỏi pháp tuyến
        const ang = Math.atan2(tg.ny, tg.nx) + (Math.random() - 0.5) * 0.5;
        p.ax = Math.cos(ang); p.ay = Math.sin(ang);
        p.px = -p.ay; p.py = p.ax;
        p.Q = (Math.random() - 0.5) * this.height * 0.05;
        p.L = Math.max(140, this.rayExit(tg.x, tg.y, p.ax, p.ay) * (1.0 + Math.random() * 0.45)); // bắt đầu ngoài mép màn hình
      } else {
        const sgn = this.flowDir === "ltr" ? -1 : 1; // +1: xuất phát bên phải, -1: bên trái
        const f = W * (base + Math.random() * range);
        const sx = sgn === 1 ? f : W - f;
        p.ax = sgn; p.ay = 0; p.px = 0; p.py = 1;
        p.L = Math.max(60, (sx - tg.x) * sgn);
        p.Q = this.fanOffset(tg.y, 0.3);
      }
      return p;
    }

    // Độ lệch điểm xuất phát so với điểm đích: tỉ lệ với khoảng cách tới trục giữa
    // => các tia xòe ra thành chùm (như tia sáng), không bắt chéo nhau
    fanOffset(targetY, noise) {
      return (targetY - this.height * CONFIG.arcAnchorY) * 1.5 + (Math.random() - 0.5) * this.height * noise;
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

    // --- 4. QUỸ ĐẠO: từ xa (theo hướng đã chọn) hội tụ dần về một điểm trên vệt ---
    flowPos(p, t, out) {
      const tg = this.arcPts[Math.round(p.u * ARC_SAMPLES)];
      const e = t * (0.65 + 0.35 * t);            // tăng tốc dần khi bị vệt hút
      const along = p.L * (1 - e);                // khoảng cách còn lại dọc trục tiến vào
      const spread = Math.pow(1 - e, 1.35);
      const amp = 34 * e * (1 - e);
      // Pha lắc phụ thuộc vị trí đích (không phải ngẫu nhiên từng tia) => các tia lân cận uốn lượn cùng nhau
      const sway = Math.sin(e * 5 + (tg.x + tg.y) * 0.006 + this.time * 0.9 + p.wobble * 0.8);
      const perp = p.Q * spread + sway * amp;
      out.x = tg.x + p.ax * along + p.px * perp;
      out.y = tg.y + p.ay * along + p.py * perp;
    }

    // Vệt cong "nóng lên" tại chỗ có ký tự va vào
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

    // --- 5. PHÁT HẠT: bắn một hạt bụi từ điểm (x, y) ---
    emit(x, y, nx, ny, power) {
      const N = CONFIG.maxParticles;
      const i = this.pCursor;
      this.pCursor = (i + 1) % N;

      // 70% hạt bay tỏa ra phía ngoài vệt (lệch ngẫu nhiên rộng), 30% bay hoàn toàn ngẫu nhiên
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

    // Ký tự chạm vệt -> vỡ thành nhiều hạt nhỏ
    burst(p) {
      const pt = this.arcAt(p.u);
      this.hit(p.u, 0.22);

      const extra = Math.min(6, Math.floor(p.text.length / 5)); // chuỗi dài vỡ nhiều hạt hơn
      const n = CONFIG.burstMin + Math.floor(Math.random() * (CONFIG.burstMax - CONFIG.burstMin + 1)) + extra;
      const halfW = Math.min(p.text.length * p.fontSize * 0.28, 16);

      for (let i = 0; i < n; i++) {
        this.emit(
          pt.x + (Math.random() - 0.5) * halfW * 2,
          pt.y + (Math.random() - 0.5) * p.fontSize,
          pt.nx, pt.ny, 1
        );
      }
    }

    // --- 6. VẼ NỀN SAO ---
    drawStars() {
      const ctx = this.ctx;
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < this.stars.length; i++) {
        const s = this.stars[i];
        ctx.globalAlpha = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(this.time * s.sp + s.ph));
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }
      ctx.globalAlpha = 1;
    }

    // Đuôi vệt cong: nhiều đoạn ngắn, mảnh và mờ dần về phía đuôi, đậm dần về phía đầu
    // Kết quả: vị trí đầu vệt nằm trong this._c
    drawTrail(p, t, trailLen, alpha, width, rgb) {
      const ctx = this.ctx, SEG = 4;
      const pt = this._c;
      let x0 = 0, y0 = 0;
      for (let i = 0; i <= SEG; i++) {
        const f = i / SEG;
        this.flowPos(p, Math.max(0, t - trailLen * (1 - f)), pt);
        if (i > 0) {
          ctx.strokeStyle = `rgba(${rgb}, ${alpha * f * f})`;
          ctx.lineWidth = width * (0.3 + 0.7 * f);
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(pt.x, pt.y);
          ctx.stroke();
        }
        x0 = pt.x; y0 = pt.y;
      }
    }

    // Đường bay mảnh của chữ: một nét liền theo đúng quỹ đạo cong, mờ dần về phía điểm xuất phát
    drawTextPath(p, alpha) {
      const mode = CONFIG.textTrail;
      if (mode === "none") return;
      const ctx = this.ctx;
      const pt = this._a;
      const tg = this.arcPts[Math.round(p.u * ARC_SAMPLES)];
      const tEnd = mode === "full" ? 1 : p.t;
      const e = p.t * (0.65 + 0.35 * p.t); // x tuyến tính theo e => e chính là vị trí chữ trên gradient
      const STEPS = 16;

      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        this.flowPos(p, (tEnd * i) / STEPS, pt);
        if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
      }

      const a = alpha * CONFIG.textTrailAlpha;
      // Gradient dọc trục tiến vào: vị trí chữ trên gradient chính là e
      const grad = ctx.createLinearGradient(tg.x + p.ax * p.L, tg.y + p.ay * p.L, tg.x, tg.y);
      grad.addColorStop(0, "rgba(224, 242, 254, 0)");
      grad.addColorStop(Math.min(0.999, Math.max(0.001, e)), `rgba(224, 242, 254, ${a})`);
      if (mode === "full") grad.addColorStop(1, `rgba(224, 242, 254, ${a * 0.25})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = CONFIG.textTrailWidth;
      ctx.stroke();
    }

    // --- 7. VẼ DÒNG CHẢY KÝ TỰ & VỆT SÁNG ---
    drawStreams(k) {
      const ctx = this.ctx;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 1. Vệt sáng mảnh (tia hội tụ)
      for (let i = 0; i < this.sparks.length; i++) {
        const s = this.sparks[i];
        s.t += s.speed * k;
        if (s.t >= 1) {
          const pt = this.arcAt(s.u);
          this.hit(s.u, 0.03);
          const n = 1 + (Math.random() < 0.5 ? 1 : 0);
          for (let j = 0; j < n; j++) this.emit(pt.x, pt.y, pt.nx, pt.ny, 0.7);
          this.sparks[i] = this.spawnSpark();
          continue;
        }

        const alpha = Math.min(1, s.t / 0.2) * (0.12 + 0.5 * s.t);
        this.drawTrail(s, s.t, 0.05 + s.t * 0.09, alpha, s.radius * 0.8,
          s.cyan ? "125, 211, 252" : "226, 240, 255");
      }

      // 2. Công thức & mã nguồn
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < this.textParticles.length; i++) {
        const p = this.textParticles[i];
        p.t += p.speed * k;
        if (p.t >= 1) {
          this.burst(p);
          this.textParticles[i] = this.spawnTextParticle();
          continue;
        }

        let alpha = p.opacity;
        if (p.t < 0.15) alpha *= p.t / 0.15;

        // Đường bay mảnh theo quỹ đạo cong, rồi tính vị trí hiện tại của chữ
        this.drawTextPath(p, alpha);
        const pos = this._c;
        this.flowPos(p, p.t, pos);

        // Giai đoạn "gom": ký tự co lại, rung nhẹ, sáng trắng ngay trước khi vỡ
        const g = p.t > 0.8 ? (p.t - 0.8) / 0.2 : 0;
        const scale = Math.max(0.4, 1 - p.t * 0.3 - g * 0.35);
        const size = Math.max(6, Math.round(p.fontSize * scale));
        const jx = g ? (Math.random() - 0.5) * g * 3 : 0;
        const jy = g ? (Math.random() - 0.5) * g * 3 : 0;

        ctx.font = `${size}px "JetBrains Mono", "Fira Code", monospace`;
        if (g > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * (1 + g * 0.6))})`;
        } else {
          ctx.fillStyle = p.isFormula
            ? `rgba(224, 242, 254, ${alpha * 0.9})`
            : `rgba(203, 213, 225, ${alpha * 0.75})`;
        }
        ctx.fillText(p.text, pos.x + jx, pos.y + jy);
      }
    }

    // --- 8. VẼ VỆT CONG PHÁT SÁNG ---
    drawArc(k) {
      const ctx = this.ctx;
      const closed = this.arcClosed;
      const S = closed ? 128 : 72;
      const P = this._d;
      const decay = Math.pow(0.93, k);
      for (let i = 0; i < BIN_COUNT; i++) this.heat[i] *= decay;

      const pulse = 1 + 0.06 * Math.sin(this.time * 2.2);
      const mid = closed ? this.arcCenter : this.arcAt(0.5);

      // Quầng sáng mềm phía sau vệt
      let avgHeat = 0;
      for (let i = 0; i < BIN_COUNT; i++) avgHeat += this.heat[i];
      avgHeat /= BIN_COUNT;
      const glowR = this.height * 0.5;
      const grad = ctx.createRadialGradient(mid.x, mid.y, 0, mid.x, mid.y, glowR);
      grad.addColorStop(0, `rgba(125, 211, 252, ${0.09 + avgHeat * 0.25})`);
      grad.addColorStop(1, "rgba(3, 7, 18, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(mid.x - glowR, mid.y - glowR, glowR * 2, glowR * 2);

      const buildShape = (widthScale) => {
        ctx.beginPath();
        const outer = [], inner = [];
        for (let j = 0; j <= S; j++) {
          const u = j / S;
          const pt = this.arcLerp(u, P);
          // Cung hở: thon dần về hai đầu. Vòng tròn: giữ độ dày tối thiểu để khép kín, dày nhất ở điểm trái nhất
          const endW = closed ? 0.4 : 0;
          const shape = endW + (1 - endW) * Math.pow(Math.sin(Math.PI * u), 0.85);
          // Số chu kỳ lắc phải là số nguyên ở vòng tròn để chỗ nối không bị gãy
          const wob = Math.sin(u * (closed ? TAU * 2 : 9) + this.time * 1.8) * 1.6 * shape;
          const w = (CONFIG.arcWidth * shape * (1 + 1.6 * this.heatAt(u)) + 0.4) * pulse * widthScale;
          outer.push(pt.x + pt.nx * (wob + w * 0.55), pt.y + pt.ny * (wob + w * 0.55));
          inner.push(pt.x + pt.nx * (wob - w * 0.45), pt.y + pt.ny * (wob - w * 0.45));
        }
        ctx.moveTo(outer[0], outer[1]);
        for (let j = 2; j < outer.length; j += 2) ctx.lineTo(outer[j], outer[j + 1]);
        for (let j = inner.length - 2; j >= 0; j -= 2) ctx.lineTo(inner[j], inner[j + 1]);
        ctx.closePath();
      };

      ctx.save();

      // Lớp phát sáng ngoài
      buildShape(1);
      ctx.shadowColor = "rgba(56, 189, 248, 0.9)";
      ctx.shadowBlur = 26;
      ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
      ctx.fill();

      // Lõi trắng sắc nét
      buildShape(0.4);
      ctx.shadowColor = "rgba(224, 242, 254, 0.9)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Hai sợi sáng mảnh chạy song song (cảm giác ánh sáng bị bẻ cong)
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(186, 230, 253, 0.28)";
      const wisps = closed
        ? [{ off: 18, a: 0, b: 1 }, { off: -14, a: 0, b: 1 }]
        : [{ off: 18, a: 0.14, b: 0.86 }, { off: -14, a: 0.2, b: 0.8 }];
      const WS = closed ? 128 : 40;
      for (const wsp of wisps) {
        ctx.beginPath();
        for (let j = 0; j <= WS; j++) {
          const u = wsp.a + (wsp.b - wsp.a) * (j / WS);
          const pt = this.arcLerp(u, P);
          const x = pt.x + pt.nx * wsp.off, y = pt.y + pt.ny * wsp.off;
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        if (closed) ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
    }

    // --- 9. CẬP NHẬT & VẼ HẠT BỤI ---
    drawParticles(k) {
      const ctx = this.ctx;
      const N = CONFIG.maxParticles;
      const friction = Math.pow(0.968, k);
      const jit = 0.09 * k;

      ctx.globalCompositeOperation = "lighter";

      for (let pass = 0; pass < 3; pass++) {
        ctx.fillStyle = PALETTE[pass];
        for (let i = 0; i < N; i++) {
          if (this.plife[i] <= 0) continue;

          if (pass === 0) {
            // Vật lý: ma sát + nhiễu ngẫu nhiên nhỏ để hạt trôi lơ lửng rồi tan
            this.pvx[i] = this.pvx[i] * friction + (Math.random() - 0.5) * jit;
            this.pvy[i] = this.pvy[i] * friction + (Math.random() - 0.5) * jit;
            this.px[i] += this.pvx[i] * k;
            this.py[i] += this.pvy[i] * k;
            this.plife[i] -= k;
            if (this.plife[i] <= 0) continue;
          }
          if (this.pcol[i] !== pass) continue;

          const f = this.plife[i] / this.pmax[i];
          const twinkle = 0.7 + 0.3 * Math.sin(this.plife[i] * 0.5 + i);
          const size = this.psize[i] * (0.4 + 0.6 * f);
          ctx.globalAlpha = Math.pow(f, 1.3) * twinkle;
          ctx.fillRect(this.px[i] - size / 2, this.py[i] - size / 2, size, size);
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    // --- 10. VÒNG LẶP RENDER CHÍNH ---
    startLoop() {
      const render = (ts) => {
        const dtMs = this.lastTs ? Math.min(64, ts - this.lastTs) : 16.67;
        this.lastTs = ts;
        const k = dtMs / 16.67; // chuẩn hoá theo 60fps (màn 120/144Hz không bị nhanh gấp đôi)
        this.time += 0.016 * k;

        this.ctx.fillStyle = CONFIG.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.drawStars();
        this.drawStreams(k);
        this.drawArc(k);
        this.drawParticles(k);

        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    }

    // --- 11. TÍNH NĂNG F11 ZEN MODE (TOÀN MÀN HÌNH NỀN) ---
    showZenToast() {
      let toast = document.getElementById("cg-zen-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "cg-zen-toast";
        toast.innerText = "✨ Nhấn F11 hoặc ESC để hiển thị lại giao diện";
        document.body.appendChild(toast);
      }
      toast.style.opacity = "1";
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        if (toast) toast.style.opacity = "0";
      }, 2500);
    }

    toggleZenMode() {
      const isZen = document.body.classList.toggle("zen-mode");
      document.documentElement.classList.toggle("zen-mode", isZen);

      if (isZen) {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
        this.showZenToast();
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }

    bindEvents() {
      window.addEventListener("resize", () => this.handleResize());

      if (CONFIG.enableF11Zen) {
        window.addEventListener("keydown", (e) => {
          if (e.key === "F11") {
            e.preventDefault();
            this.toggleZenMode();
          } else if (e.key === "Escape" && document.body.classList.contains("zen-mode")) {
            this.toggleZenMode();
          }
        });

        document.addEventListener("fullscreenchange", () => {
          if (!document.fullscreenElement && document.body.classList.contains("zen-mode")) {
            document.body.classList.remove("zen-mode");
            document.documentElement.classList.remove("zen-mode");
          }
        });

        window.addEventListener("dblclick", () => {
          if (document.body.classList.contains("zen-mode")) {
            this.toggleZenMode();
          }
        });
      }
    }
  }

  window.CurveGatherBackground = CurveGatherBackground;
  const init = () => { 
    if (!window.__curveGatherInstance) {
      window.__curveGatherInstance = new CurveGatherBackground(); 
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
