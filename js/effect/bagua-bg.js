/**
 * ☯ 3D Bagua Gyroscope Background (La Bàn Bát Quái 3D Tiếng Việt)
 * Tự động tạo nền 3D ma trận đa trục không cần thư viện bên ngoài.
 */
(function (window, document) {
  // Cấu hình mặc định
  const DEFAULT_OPTIONS = {
    scale: 1.4,             // Tỉ lệ phóng to để tràn 2 bên màn hình
    opacityDark: 0.85,      // Độ sáng ở nền tối
    opacityLight: 0.65,     // Độ sáng ở nền sáng
    autoMorph: true,        // Tự động chuyển đổi giữa đĩa phẳng và khối 3D
    mouseTilt: true,        // Nghiêng 3D theo chuyển động chuột
    speed: 1.0              // Tốc độ xoay
  };

  const BAGUA_DATA = {
    trigrams: [
      { name: 'Càn', lines: [1, 1, 1] },
      { name: 'Đoài', lines: [0, 1, 1] },
      { name: 'Ly', lines: [1, 0, 1] },
      { name: 'Chấn', lines: [0, 0, 1] },
      { name: 'Tốn', lines: [1, 1, 0] },
      { name: 'Khảm', lines: [0, 1, 0] },
      { name: 'Cấn', lines: [1, 0, 0] },
      { name: 'Khôn', lines: [0, 0, 0] }
    ],
    eightGates: ['Khai môn', 'Hưu môn', 'Sinh môn', 'Thương môn', 'Đỗ môn', 'Cảnh môn', 'Tử môn', 'Kinh môn'],
    branches: ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'],
    mountains: [
      'Nhâm', 'Tý', 'Quý', 'Sửu', 'Cấn', 'Dần', 
      'Giáp', 'Mão', 'Ất', 'Thìn', 'Tốn', 'Tị', 
      'Bính', 'Ngọ', 'Đinh', 'Mùi', 'Khôn', 'Thân', 
      'Canh', 'Dậu', 'Tân', 'Tuất', 'Càn', 'Hợi'
    ]
  };

  const RINGS_CONFIG = [
    {
      id: 'taiji',
      size: 200,
      draw: (ctx, c, isDark) => drawTaiji(ctx, c, 68, isDark),
      speedZ: 0.014, speedX: 0.007, speedY: 0.005, phaseX: 0, phaseY: 0
    },
    {
      id: 'trigrams',
      size: 320,
      draw: (ctx, c, isDark) => {
        drawCircle(ctx, c, 110, 0, isDark ? 0.45 : 0.55, isDark);
        drawTrigramLines(ctx, c, 120, isDark);
        drawCircle(ctx, c, 142, 64, isDark ? 0.3 : 0.4, isDark);
      },
      speedZ: -0.011, speedX: 0.013, speedY: -0.010, phaseX: 1.2, phaseY: 0.8
    },
    {
      id: 'bagua_chars',
      size: 420,
      draw: (ctx, c, isDark) => {
        const names = BAGUA_DATA.trigrams.map(b => b.name);
        const col = isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)';
        drawTextRing(ctx, c, names, 172, 17, col);
        drawCircle(ctx, c, 192, 0, isDark ? 0.4 : 0.5, isDark);
      },
      speedZ: -0.008, speedX: -0.011, speedY: 0.015, phaseX: 2.5, phaseY: 1.7
    },
    {
      id: 'eight_gates',
      size: 520,
      draw: (ctx, c, isDark) => {
        const col = isDark ? 'rgba(129, 140, 248, 0.95)' : 'rgba(79, 70, 229, 0.95)';
        drawTextRing(ctx, c, BAGUA_DATA.eightGates, 222, 13.5, col);
        drawCircle(ctx, c, 242, 72, isDark ? 0.35 : 0.45, isDark);
      },
      speedZ: 0.007, speedX: 0.015, speedY: 0.012, phaseX: 3.8, phaseY: 2.4
    },
    {
      id: 'branches',
      size: 640,
      draw: (ctx, c, isDark) => {
        const col = isDark ? 'rgba(241, 245, 249, 0.9)' : 'rgba(30, 41, 59, 0.9)';
        drawTextRing(ctx, c, BAGUA_DATA.branches, 276, 15, col);
        drawCircle(ctx, c, 300, 96, isDark ? 0.4 : 0.5, isDark);
      },
      speedZ: -0.005, speedX: -0.014, speedY: -0.017, phaseX: 0.5, phaseY: 4.1
    },
    {
      id: 'mountains',
      size: 780,
      draw: (ctx, c, isDark) => {
        const col = isDark ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.85)';
        drawTextRing(ctx, c, BAGUA_DATA.mountains, 340, 13, col);
        drawCircle(ctx, c, 365, 144, isDark ? 0.4 : 0.5, isDark);
      },
      speedZ: 0.004, speedX: 0.018, speedY: -0.011, phaseX: 4.7, phaseY: 3.2
    },
    {
      id: 'outer_compass',
      size: 940,
      draw: (ctx, c, isDark) => {
        drawCircle(ctx, c, 405, 288, isDark ? 0.3 : 0.4, isDark);
        drawCircle(ctx, c, 430, 0, isDark ? 0.5 : 0.6, isDark);
        drawCircle(ctx, c, 455, 144, isDark ? 0.25 : 0.35, isDark);
      },
      speedZ: -0.0025, speedX: -0.010, speedY: 0.016, phaseX: 1.9, phaseY: 5.5
    }
  ];

  // Các hàm vẽ Canvas
  function drawTaiji(ctx, c, r, isDark) {
    ctx.save();
    ctx.translate(c, c);
    const colLight = '#ffffff';
    const colDark = isDark ? '#090e1a' : '#1e293b';

    ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI/2, Math.PI/2); ctx.fillStyle = colLight; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r, Math.PI/2, -Math.PI/2); ctx.fillStyle = colDark; ctx.fill();
    ctx.beginPath(); ctx.arc(0, -r/2, r/2, Math.PI/2, -Math.PI/2); ctx.fillStyle = colLight; ctx.fill();
    ctx.beginPath(); ctx.arc(0, r/2, r/2, -Math.PI/2, Math.PI/2); ctx.fillStyle = colDark; ctx.fill();

    const eyeR = r * 0.16;
    ctx.beginPath(); ctx.arc(0, -r/2, eyeR, 0, Math.PI*2); ctx.fillStyle = colDark; ctx.fill();
    ctx.beginPath(); ctx.arc(0, r/2, eyeR, 0, Math.PI*2); ctx.fillStyle = colLight; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2); ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(30,41,59,0.6)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
  }

  function drawTrigramLines(ctx, c, radius, isDark) {
    const step = (Math.PI * 2) / 8;
    const lineWidth = 36, gap = 6;
    ctx.save();
    ctx.translate(c, c);
    for (let i = 0; i < 8; i++) {
      ctx.save();
      ctx.rotate(i * step);
      const item = BAGUA_DATA.trigrams[i];
      for (let l = 0; l < 3; l++) {
        const r = radius + l * gap;
        ctx.strokeStyle = isDark ? 'rgba(241,245,249,0.9)' : 'rgba(30,41,59,0.85)';
        ctx.lineWidth = 3;
        if (item.lines[l] === 1) {
          ctx.beginPath(); ctx.moveTo(-lineWidth/2, -r); ctx.lineTo(lineWidth/2, -r); ctx.stroke();
        } else {
          const half = (lineWidth - 8) / 2;
          ctx.beginPath(); ctx.moveTo(-lineWidth/2, -r); ctx.lineTo(-lineWidth/2 + half, -r); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(lineWidth/2 - half, -r); ctx.lineTo(lineWidth/2, -r); ctx.stroke();
        }
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function drawTextRing(ctx, c, items, radius, fontSize, color) {
    const count = items.length;
    const step = (Math.PI * 2) / count;
    ctx.save();
    ctx.translate(c, c);
    ctx.font = `600 ${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < count; i++) {
      ctx.save();
      ctx.rotate(i * step);
      ctx.translate(0, -radius);
      ctx.fillText(items[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawCircle(ctx, c, radius, ticks, opacity, isDark) {
    ctx.save();
    ctx.translate(c, c);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = isDark ? `rgba(255,255,255,${opacity})` : `rgba(30,41,59,${opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    if (ticks > 0) {
      const step = (Math.PI * 2) / ticks;
      for (let i = 0; i < ticks; i++) {
        ctx.save();
        ctx.rotate(i * step);
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, -radius + (i % 4 === 0 ? 8 : 4));
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  // Khởi tạo thư viện
  class BaguaBackground {
    constructor(opts = {}) {
      this.opts = Object.assign({}, DEFAULT_OPTIONS, opts);
      this.ringInstances = [];
      this.time = 0;
      this.mouseX = 0;
      this.mouseY = 0;
      this.rootTiltX = 22;
      this.rootTiltY = -10;
      this.initDOM();
      this.rebuildRings(this.isDark());
      this.bindEvents();
      this.startLoop();
    }

    isDark() {
      return document.documentElement.classList.contains('dark') || 
             document.body.classList.contains('dark') || 
             (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    initDOM() {
      // Tiêm CSS vào thẻ head
      const style = document.createElement('style');
      style.innerHTML = `
        #bagua-stage-viewport {
          position: fixed; inset: 0;
          perspective: 1100px; perspective-origin: center center;
          display: flex; align-items: center; justify-content: center;
          z-index: -1; pointer-events: none; overflow: hidden;
          transition: opacity 0.3s ease;
        }
        #bagua-gyro-root {
          position: relative; width: 0; height: 0;
          transform-style: preserve-3d; will-change: transform;
        }
        .bagua-gyro-ring {
          position: absolute; top: 50%; left: 50%;
          transform-style: preserve-3d; will-change: transform; pointer-events: none;
        }
      `;
      document.head.appendChild(style);

      // Tạo viewport DOM
      this.viewport = document.createElement('div');
      this.viewport.id = 'bagua-stage-viewport';

      this.root = document.createElement('div');
      this.root.id = 'bagua-gyro-root';
      this.viewport.appendChild(this.root);

      document.body.prepend(this.viewport);
      this.updateViewportStyle();
    }

    updateViewportStyle() {
      const isD = this.isDark();
      this.viewport.style.opacity = isD ? this.opts.opacityDark : this.opts.opacityLight;
      this.viewport.style.background = isD 
        ? 'radial-gradient(circle at center, #090e1a 0%, #030712 90%)'
        : 'radial-gradient(circle at center, #ffffff 0%, #e2e8f0 100%)';
    }

    rebuildRings(isDark) {
      this.root.innerHTML = '';
      this.ringInstances = RINGS_CONFIG.map(cfg => {
        const canvas = document.createElement('canvas');
        canvas.className = 'bagua-gyro-ring';
        canvas.width = cfg.size;
        canvas.height = cfg.size;
        canvas.style.width = cfg.size + 'px';
        canvas.style.height = cfg.size + 'px';
        canvas.style.marginLeft = -(cfg.size / 2) + 'px';
        canvas.style.marginTop = -(cfg.size / 2) + 'px';

        canvas.style.filter = isDark 
          ? 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.4))'
          : 'drop-shadow(0 0 3px rgba(30, 41, 59, 0.2))';

        const ctx = canvas.getContext('2d');
        cfg.draw(ctx, cfg.size / 2, isDark);
        this.root.appendChild(canvas);

        return { cfg, el: canvas, rotZ: 0 };
      });
    }

    bindEvents() {
      if (this.opts.mouseTilt) {
        window.addEventListener('mousemove', (e) => {
          this.mouseX = (e.clientX / window.innerWidth) - 0.5;
          this.mouseY = (e.clientY / window.innerHeight) - 0.5;
        });
      }

      // Theo dõi đổi Dark/Light mode tự động
      const observer = new MutationObserver(() => {
        const isD = this.isDark();
        this.updateViewportStyle();
        this.rebuildRings(isD);
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    startLoop() {
      const loop = () => {
        this.time += 0.016 * this.opts.speed;

        let split = 0.85;
        if (this.opts.autoMorph) {
          const wave = (Math.sin(this.time * 0.35) + 1) / 2;
          split = 0.2 + wave * 0.75;
        }

        this.ringInstances.forEach(ring => {
          const { cfg } = ring;
          ring.rotZ += cfg.speedZ * this.opts.speed * (180 / Math.PI);
          const maxAngle = 72;
          const tiltX = Math.sin(this.time * cfg.speedX * 60 + cfg.phaseX) * maxAngle * split;
          const tiltY = Math.cos(this.time * cfg.speedY * 60 + cfg.phaseY) * maxAngle * split;

          ring.el.style.transform = `
            rotateX(${tiltX.toFixed(2)}deg) 
            rotateY(${tiltY.toFixed(2)}deg) 
            rotateZ(${ring.rotZ.toFixed(2)}deg)
          `;
        });

        if (this.opts.mouseTilt) {
          this.rootTiltX += ((20 - this.mouseY * 25) - this.rootTiltX) * 0.05;
          this.rootTiltY += ((-10 + this.mouseX * 25) - this.rootTiltY) * 0.05;
        }

        this.root.style.transform = `scale(${this.opts.scale}) rotateX(${this.rootTiltX.toFixed(2)}deg) rotateY(${this.rootTiltY.toFixed(2)}deg)`;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  // Tự động chạy với cấu hình toàn cục (nếu có)
  window.BaguaBackground = BaguaBackground;
  function autoInit() {
    const customConfig = window.BAGUA_CONFIG || {};
    window.baguaInstance = new BaguaBackground(customConfig);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})(window, document);
